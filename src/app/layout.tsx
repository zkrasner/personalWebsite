import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import FadeInObserver from "@/components/FadeInObserver";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zach Krasner",
  description:
    "Software engineer and technical leader. CTO at Grassroots Analytics. Building data platforms and backend systems.",
  alternates: {
    canonical: "https://zkrasner.com",
  },
  openGraph: {
    title: "Zach Krasner",
    description:
      "Software engineer and technical leader. CTO at Grassroots Analytics.",
    url: "https://zkrasner.com",
    siteName: "Zach Krasner",
    type: "website",
    images: [
      {
        url: "https://zkrasner.com/photo.jpeg",
        alt: "Zach Krasner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zach Krasner",
    description:
      "Software engineer and technical leader. CTO at Grassroots Analytics.",
    images: ["https://zkrasner.com/photo.jpeg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Zach Krasner",
  url: "https://zkrasner.com",
  jobTitle: "Chief Technology Officer",
  worksFor: {
    "@type": "Organization",
    name: "Grassroots Analytics",
  },
  sameAs: ["https://linkedin.com/in/zkrasner", "https://github.com/zkrasner"],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Pennsylvania",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      {GA_ID && (
        <head>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </head>
      )}
      <body className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-card focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <FadeInObserver />
        {children}
      </body>
    </html>
  );
}
