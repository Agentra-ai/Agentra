import {
  Anek_Latin,
  IBM_Plex_Mono,
  Inter,
  Outfit,
  Urbanist,
} from "next/font/google";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontHeading = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontUrbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const fontOutfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

// export const fontHeading = localFont({
//   src: "../../public/fonts",
//   variable: "--font-heading",
// });

export const fontAnek = Anek_Latin({
  subsets: ["latin"],
  variable: "--font-anek",
});

export const fontIbemPlex = IBM_Plex_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

export const fontGeist = GeistSans;
