import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Suara Nabawiy — Radio Streaming Islami",
    template: "%s | Suara Nabawiy",
  },
  description:
    "Radio streaming islami dengan koleksi kajian, jadwal siaran, dan toko produk islami. Dengarkan kajian sunnah kapan saja, di mana saja.",
  keywords: ["radio islami", "kajian sunnah", "streaming radio", "suara nabawiy"],
  openGraph: {
    title: "Suara Nabawiy — Radio Streaming Islami",
    description:
      "Radio streaming islami dengan koleksi kajian, jadwal siaran, dan toko produk islami.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
