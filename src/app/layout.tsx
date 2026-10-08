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
  title: "AOUJ | Rise In Your Own Way | Luxury Pakistani Fashion",
  description:
    "Discover AOUJ - Timeless luxury, embroidered pret, festive collections, and children's couture crafted with poetic elegance.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/images/aouj-icon-512.png",
    shortcut: "/favicon.ico",
  },
  keywords: [
    "AOUJ",
    "Pakistani fashion",
    "Luxury Pret",
    "Lawn",
    "Embroidered Suit",
    "Women Fashion",
    "Kids Fashion",
    "Eastern Wear",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${manrope.variable} antialiased`}
    >
      <head>
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
        {children}
      </body>
    </html>
  );
}
