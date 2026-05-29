import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { WalletProviders } from "@/lib/wagmi/providers";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090820",
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbit-forum.vercel.app"
  ),
  title: "Orbit — Filecoin Governance Forum",
  description:
    "The wallet-gated forum where Filecoin ambassadors publish reports, propose projects, and shape the future of decentralized storage — transparently, on-chain.",
  authors: [{ name: "Orbit" }],
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Orbit",
    title: "Orbit — Filecoin Governance Forum",
    description:
      "The wallet-gated forum where Filecoin ambassadors publish reports, propose projects, and shape the future of decentralized storage — transparently, on-chain.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kl0ren",
    title: "Orbit — Filecoin Governance Forum",
    description:
      "The wallet-gated forum where Filecoin ambassadors publish reports, propose projects, and shape the future of decentralized storage.",
    images: ["/opengraph.png"],
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
      className={`${hankenGrotesk.variable} ${hankenGrotesk.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WalletProviders>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
          </AuthProvider>
        </WalletProviders>
      </body>
    </html>
  );
}
