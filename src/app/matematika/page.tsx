import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MatematikaPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Математика</h1>
          <p className="text-muted-foreground text-lg">Материалы и учебная программа по математике.</p>
        </div>
        <div>
          <Link href="/strategy">
            <Button variant="outline" className="h-10">Назад</Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-xl border border-border/40 bg-card/30 py-20">
        <span className="text-lg text-muted-foreground">Coming soon</span>
      </div>
    </div>
  )
}
