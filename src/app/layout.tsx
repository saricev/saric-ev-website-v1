import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { company } from '@/data/company';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://saricev.com'),
  title: {
    default: 'Saric - Professional Low-Speed Electric Vehicle Manufacturer',
    template: '%s | Saric EV',
  },
  description:
    'Leading manufacturer of low-speed electric vehicles for tourism, patrol, logistics, and utility applications. CE certified, exported to 60+ countries.',
  keywords: ['electric vehicle', 'low-speed EV', 'sightseeing cart', 'patrol vehicle', 'electric golf cart', 'tourism vehicle'],
  openGraph: {
    siteName: 'Saric EV',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Saric Electric Vehicles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: company.name,
              url: 'https://saricev.com',
              description: company.description,
              address: {
                '@type': 'PostalAddress',
                addressLocality: company.address,
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: company.phone,
                email: company.email,
                contactType: 'sales',
              },
              sameAs: [
                company.social.facebook,
                company.social.linkedin,
                company.social.youtube,
              ].filter(Boolean),
            }),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
