
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Atom, BookOpen, Trophy, Users, GraduationCap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#161C1E]">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full border-b border-border/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#26A3E5] flex items-center justify-center">
            <Atom className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-headline font-bold tracking-tight text-[#26A3E5]">Learnova</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Войти</Link>
          </Button>
          <Button className="bg-[#26A3E5] hover:bg-[#26A3E5]/90" asChild>
            <Link href="/dashboard">Начать обучение</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center space-y-12">
        <div className="space-y-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter leading-tight">
            Единая платформа для подготовки к <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#26A3E5] to-[#6B6BFF]">STEM олимпиадам</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Интерактивные курсы, база данных олимпиад и библиотека материалов для успешного участия в соревнованиях.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-10 text-lg bg-[#26A3E5] hover:bg-[#26A3E5]/90 rounded-full" asChild>
              <Link href="/dashboard">Начать сейчас</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-border/20 hover:bg-white/5" asChild>
              <Link href="/courses">Посмотреть курсы</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full pt-20">
          <FeatureCard 
            icon={<BookOpen className="h-8 w-8 text-[#26A3E5]" />}
            title="Библиотека Курсов"
            description="Качественные видеоуроки и разборы задач от лучших преподавателей и победителей олимпиад."
          />
          <FeatureCard 
            icon={<GraduationCap className="h-8 w-8 text-[#FACC15]" />}
            title="Методические материалы"
            description="Глубокие теоретические материалы и практические руководства по всем STEM дисциплинам."
          />
          <FeatureCard 
            icon={<Trophy className="h-8 w-8 text-[#6B6BFF]" />}
            title="Олимпиадный Хаб"
            description="Актуальное расписание и информация о ведущих региональных и мировых соревнованиях."
          />
        </div>
      </main>

      <footer className="p-8 border-t border-border/10 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Learnova Platform. Все права защищены.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-[#1C2529] border border-border/20 text-left space-y-4 hover:border-[#26A3E5]/50 transition-all group">
      <div className="p-3 bg-[#161C1E] rounded-2xl w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
