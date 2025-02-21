import "@/styles/globals.css";

import * as React from "react";
import type { Metadata, Viewport } from "next";
import { TooltipProvider } from "@radix-ui/react-tooltip";

// import { Analytics } from "@vercel/analytics/react"

import {
  fontAnek,
  fontGeist,
  fontHeading,
  fontIbemPlex,
  fontInter,
  fontOutfit,
  fontUrbanist,
} from "@/lib/fonts";
import { siteConfig } from "@/lib/site";

import { ThemeProvider } from "@/provider/theme-provider";
import SWRProviders from "@/lib/swr-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";

// import { TailwindIndicator } from "@/components/tailwind-indicator"

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   minimumScale: 1,
//   maximumScale: 1,
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
// }

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL ?? ""),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.links.authorsWebsite,
    },
  ],
  creator: siteConfig.author,
  keywords: siteConfig.keywords,
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    // images: [siteConfig.links.openGraphImage],
    creator: siteConfig.author,
  },
  icons: {
    icon: "/floxify-logo.png",
  },
  // manifest: siteConfig.links.manifestFile,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="icon" href="/floxify-logo.png" />
      </head>

      <body
        className={cn(
          "w-full font-sans antialiased",
          fontInter.variable,
          fontUrbanist.variable,
          fontHeading.variable,
          fontAnek.variable,
          fontGeist.variable,
          fontOutfit.variable,
          fontIbemPlex.variable,
        )}
      >
        <Providers>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <SWRProviders>
                  {/* <Navbar/> */}
                  {children}
                </SWRProviders>
                <Toaster />
              </ThemeProvider>
            </Tooltip>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
