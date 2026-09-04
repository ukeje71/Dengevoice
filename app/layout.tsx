import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Warm, editorial serif for headlines   carries the "storytelling" feel.
// Body text stays on Geist (clean, legible, works for low-literacy users).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const siteTitle = "DengeVoice — Report a problem, in your own words";
const siteDescription =
  "Speak your complaint naturally in mixed Igbo and English. No formal English, no trip to a station, no fear of being dismissed. DengeVoice turns your voice into a clear, trackable report for the right office.";

export const metadata: Metadata = {
  // Resolves relative OG/Twitter image URLs (e.g. the generated
  // opengraph-image) to absolute ones. Uses the deploy URL when Vercel sets
  // it, falling back to localhost in dev. Override with NEXT_PUBLIC_SITE_URL
  // once a custom domain is live.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  title: {
    default: siteTitle,
    template: "%s · DengeVoice",
  },
  description: siteDescription,
  applicationName: "DengeVoice",
  keywords: [
    "civic complaint",
    "Igbo",
    "code-switching",
    "voice report",
    "Nigeria",
    "anonymous reporting",
    "public services",
  ],
  openGraph: {
    type: "website",
    siteName: "DengeVoice",
    title: siteTitle,
    description: siteDescription,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
