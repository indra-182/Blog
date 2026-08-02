import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: { icon: '/favicon.ico' },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fffdf7' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0e0e' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){var t=localStorage.getItem('theme');var d=t==='system'?window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light':t==='light'?'light':'dark';document.documentElement.classList.add(d)})()`}
        </Script>
      </head>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <a className="skip-link" href="#main-content">
            Langsung ke isi
          </a>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="w-full flex-1 py-10 sm:py-14">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
