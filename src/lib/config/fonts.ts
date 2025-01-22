import { Anek_Latin, Inter, Outfit, Urbanist } from "next/font/google"
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

export const fontHeading = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})


export const fontAnek = Anek_Latin({
  subsets: ["latin"],
  variable: "--font-anek",
})

export const fontGeist = GeistSans
