import { Anek_Latin, Inter, Outfit, Urbanist, IBM_Plex_Mono } from "next/font/google"
import localFont from "next/font/local"
import { GeistSans } from "geist/font/sans"

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const fontUrbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
})

export const fontOutfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const fontHeading = localFont({
  src: "../../public/fonts/cal-sans-semi-bold.woff2",
  variable: "--font-heading",
})

export const fontAnek = Anek_Latin({
  subsets: ["latin"],
  variable: "--font-anek",
})


export const ibmPlex = IBM_Plex_Mono({
  weight: ["400"],
  subsets: ["latin"],
  // variable: "--font-ibm-plex-sans",
});

export const fontGeist = GeistSans
