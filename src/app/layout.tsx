import "@/styles/globals.css"
import "@/styles/mdx.css"

import * as React from "react"
import type { Metadata, Viewport } from "next"
import { TooltipProvider } from "@radix-ui/react-tooltip"

// import { Analytics } from "@vercel/analytics/react"

import { env } from "@/env.mjs"
import {
  fontAnek,
  fontGeist,
  fontHeading,
  fontInter,
  fontOutfit,
  fontUrbanist,
} from "@/config/fonts"
import { siteConfig } from "@/config/site"

import { ThemeProvider } from "@/providers/theme-provider"
import SWRProviders from "@/lib/swr-provider"
import { cn } from "@/lib/utils"

import { Toaster } from "@/components/ui/toaster"
import { Tooltip } from "@/components/ui/tooltip"

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

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
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
  // twitter: {
  //   card: "summary_large_image",
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   images: [siteConfig.links.openGraphImage],
  //   creator: siteConfig.author,
  // },
  icons: {
    icon: "/floxify-logo.png",
  },
  manifest: siteConfig.links.manifestFile,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={cn(
          "w-full font-sans antialiased",
          fontInter.variable,
          fontUrbanist.variable,
          fontHeading.variable,
          fontAnek.variable,
          fontGeist.variable,
          fontOutfit.variable
        )}
      >
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <SWRProviders>{children}</SWRProviders>
              <Toaster />
            </ThemeProvider>
          </Tooltip>
        </TooltipProvider>
      </body>
    </html>
  )
}
