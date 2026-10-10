import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"
import { requestUser } from '@/lib/server-auth'
import { isApprovedTeacher } from '@/lib/teacher-access'
import { isRegistrationAcknowledgement } from '@/lib/legal-config'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get("uid")
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 })
    if (await requestUser(req) !== uid) return NextResponse.json({ error: 'Требуется вход в свой аккаунт.' }, { status: 401 })

    const db = getDb()
    const snap = await db.doc(`users/${uid}`).get()
    if (!snap.exists) return NextResponse.json({})

    return NextResponse.json({ ...snap.data(), role: isApprovedTeacher(snap.data()) ? 'teacher' : 'student' })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const uid = body.uid
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 })
    if (await requestUser(req) !== uid) return NextResponse.json({ error: 'Требуется вход в свой аккаунт.' }, { status: 401 })
    if (['role', 'teacherStatus', 'reviewedBy', 'reviewedAt', 'admin'].some(key => key in body)) return NextResponse.json({ error: 'Права аккаунта изменяет только администратор.' }, { status: 403 })
    if (body.legalAcknowledgement !== undefined && !isRegistrationAcknowledgement(body.legalAcknowledgement)) {
      return NextResponse.json({ error: 'Invalid registration acknowledgement', code: 'INVALID_LEGAL_ACKNOWLEDGEMENT' }, { status: 400 })
    }

    const editable = ['displayName', 'email', 'photoURL', 'school', 'grade', 'about', 'codeforces', 'leetcode', 'goal', 'watchedVideos']
    const safeBody = Object.fromEntries(editable.filter(key => body[key] !== undefined).map(key => [key, body[key]]))

    const db = getDb()
    await db.runTransaction(async tx => {
      const ref = db.doc(`users/${uid}`)
      const snap = await tx.get(ref)
      tx.set(ref,
        {
          ...safeBody,
          ...(body.legalAcknowledgement && !snap.data()?.legalAcknowledgement ? {
            legalAcknowledgement: {
              version: body.legalAcknowledgement.version,
              termsAccepted: true,
              privacyRead: true,
              ageRange: body.legalAcknowledgement.ageRange,
              guardianPermission: body.legalAcknowledgement.guardianPermission,
              acceptedAt: FieldValue.serverTimestamp(),
            },
          } : {}),
          ...(!snap.exists ? { role: 'student' } : {}),
          uid,
          createdAt: snap.exists ? (snap.data()!.createdAt || FieldValue.serverTimestamp()) : FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      )
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
