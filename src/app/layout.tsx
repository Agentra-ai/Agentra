import Navbar from "@/components/Navbar";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { Providers } from "@/components/provider/Providers";
import { fontAnek, fontGeist, fontHeading,fontOutfit, fontUrbanist } from "@/config/font";
import { validateRequest } from "@/lib/auth/get-session";
// import Script from "next/script";
import "./globals.css";

import viewportConfig  from "@/config/viewport";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/metadata";
import { SWRConfig } from "swr";

export const metadata = siteConfig;
export const viewport = viewportConfig;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  return (
    <html lang="en">
      {/* <Script
        // async
        // src={process.env.UMAMI_SRC}
        // data-website-id={process.env.UMAMI_DATA_WEBSITE_ID}
      /> */}
      <body
        className={cn(
          fontAnek.variable,
          fontGeist.variable,
          fontHeading.variable,
          // fontInter.variable,
          fontUrbanist.variable,
          fontOutfit.variable,
          "min-h-screen h-screen"
        )}>
        <SessionProvider session={session}>
          <Providers>
            {/* <Navbar /> */}
          <SWRConfig>
            {children}
          </SWRConfig>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
