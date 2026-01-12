import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import AuthGuard from "@/components/AuthGuard";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const publicPages = ['/', '/auth/login', '/auth/register'];

  if (publicPages.includes(router.pathname)) {
    return <Component {...pageProps} />;
  }

  return (
    <NextUIProvider>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </NextUIProvider>
  );
}
