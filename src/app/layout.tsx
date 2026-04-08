import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

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
        url: "https://zkrasner.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zach Krasner — Engineering leader, builder of platforms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zach Krasner",
    description:
      "Software engineer and technical leader. CTO at Grassroots Analytics.",
    images: ["https://zkrasner.com/og-image.png"],
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
