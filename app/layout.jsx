import { Inter, Manrope } from "next/font/google";
import { constructMetadata } from "@/lib/metadata";
import { ToastProvider } from "@/components/ui/toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/shared/Preloader";
import { ScrollIndicator } from "@/components/shared/ScrollIndicator";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata = constructMetadata();

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-background text-foreground font-sans flex flex-col selection:bg-light-green selection:text-primary-hover">
        <ToastProvider>
          <Preloader>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <ScrollIndicator />
          </Preloader>
        </ToastProvider>
      </body>
    </html>
  );
}
