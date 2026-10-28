import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aoujofficial.com"),
  title: {
    default: "AOUJ | Luxury Pakistani Fashion, Embroidered Pret & Couture",
    template: "%s | AOUJ Atelier Official",
  },
  description:
    "Explore AOUJ - Premier Pakistani luxury clothing house. Designer embroidered pret, handcrafted festive suits, pure lawn co-ords, and mother-daughter matching couture with nationwide express delivery.",
  keywords: [
    "AOUJ",
    "AOUJ Atelier",
    "Pakistani luxury pret",
    "women clothing Pakistan",
    "designer lawn suits",
    "embroidered pret wear",
    "handcrafted zardozi formal suits",
    "mother daughter matching dresses",
    "girls festive couture",
    "Pakistani dresses online",
    "luxury eastern wear",
    "couture Gujrat",
    "ready to wear suits Pakistan",
  ],
  authors: [{ name: "AOUJ Atelier", url: "https://www.aoujofficial.com" }],
  creator: "AOUJ Atelier",
  publisher: "AOUJ Haute Couture",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "https://www.aoujofficial.com",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://www.aoujofficial.com",
    siteName: "AOUJ Atelier Official",
    title: "AOUJ | Luxury Pakistani Fashion & Heirloom Pret",
    description:
      "Timeless Pakistani luxury pret, artisanal embroidered lawn, and bespoke festive couture handcrafted for elegance.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "AOUJ Luxury Pakistani Couture Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AOUJ | Luxury Pakistani Fashion & Pret",
    description:
      "Handcrafted Pakistani pret, embroidered lawn, and bespoke festive wear delivered across Pakistan.",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    ],
    creator: "@aoujofficial",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/images/aouj-icon-512.png",
    shortcut: "/favicon.ico",
  },
};

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { FloatingWhatsAppWidget } from "@/components/ui/FloatingWhatsAppWidget";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/structuredData";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${cormorant.variable} ${manrope.variable} antialiased`}
    >
      <head>
        {/* Global SEO Structured Data (JSON-LD) for Google Knowledge Graph & Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebSiteSchema()),
          }}
        />

        {/* Protection against browser extensions (Urban VPN, Bitwarden, etc.) injecting bis_skin_checked attributes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const removeExtensionAttrs = () => {
                    const elements = document.querySelectorAll('[bis_skin_checked]');
                    for (let i = 0; i < elements.length; i++) {
                      elements[i].removeAttribute('bis_skin_checked');
                    }
                  };
                  if (typeof MutationObserver !== 'undefined') {
                    const observer = new MutationObserver((mutations) => {
                      for (let i = 0; i < mutations.length; i++) {
                        const m = mutations[i];
                        if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                          m.target.removeAttribute('bis_skin_checked');
                        }
                      }
                    });
                    observer.observe(document.documentElement, {
                      attributes: true,
                      subtree: true,
                      attributeFilter: ['bis_skin_checked']
                    });
                  }
                  window.addEventListener('DOMContentLoaded', removeExtensionAttrs);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#FAF7F2] text-[#211A12] flex flex-col selection:bg-[#907553] selection:text-white"
      >
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
              <FloatingWhatsAppWidget />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
