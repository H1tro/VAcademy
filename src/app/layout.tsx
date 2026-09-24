import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'VAcademy — learn at the speed of thought',
  description: 'Premium educational platform for STEM olympiad preparation. Courses, trajectories, and measurable growth.',
  viewport: 'width=device-width, initial-scale=1',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('next-intl-locale')?.value || 'ru';
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <NextIntlClientProvider locale={locale} messages={messages} defaultLocale="ru">
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
