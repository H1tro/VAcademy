export function isApprovedTeacher(profile: Record<string, unknown> | undefined): boolean {
  return profile?.role === 'teacher' && profile?.teacherStatus === 'approved';
}
