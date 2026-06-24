import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ChatWidget } from "@/components/ChatWidget";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
      <ChatWidget />
      <Toaster />
    </LanguageProvider>
  );
}
