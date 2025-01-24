"use client"

import { useEffect, useState } from "react"
import { Anek_Latin } from "next/font/google"
import Link from "next/link"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"

import { cn, getGitHubStars } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import DotPattern from "../magicui/dot-pattern"
import FlickeringGrid from "../ui/flickering-grid"

const font_anek = Anek_Latin({ subsets: ["latin"] })

export function HeroSection() {
  const [gitHubStars, setGitHubStars] = useState<number | null>(null)

  useEffect(() => {
    async function fetchGitHubStars() {
      const stars = await getGitHubStars()
      setGitHubStars(stars)
    }

    fetchGitHubStars()
  }, [])

  return (
    <section
      // id="hero-section"
      // aria-label="hero section"
      className="z-10 mt-16 w-full md:mt-20"
    >
      {/* <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)] "
        )}
      /> */}

      {/* <div className="absolute left-[-35rem] top-[-1rem] -z-10 h-[50rem] w-[50rem] rounded-full bg-[#c2caff] blur-[10rem] dark:bg-[#676394] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
      <div className="absolute right-[-26rem] top-[-1rem] -z-10 h-[50.25rem] w-[50rem] rounded-full bg-[#c5e1ff] blur-[10rem] dark:bg-[#676394] sm:w-[68.75rem] md:right-[-30rem] lg:right-[-28rem] xl:right-[-8em] 2xl:right-[-2rem]"></div>
      <div className="absolute right-[9rem] top-[-6rem] -z-10 h-[38.25rem] w-[31.25rem] rounded-full bg-[#ffffff] blur-[10rem] dark:bg-[#946263] sm:w-[68.75rem]"></div> */}

      {/* <div className="absolute right-[11rem] top-[-6rem] -z-10 h-[31.25rem] w-[31.25rem] rounded-full bg-[#ffe5e5] blur-[10rem] dark:bg-[#946263] sm:w-[68.75rem]"></div> */}
      <div className="absolute left-[-35rem] top-[-1rem] -z-10 h-[31.25rem] w-[50rem] rounded-full bg-[#ffffff] blur-[10rem] dark:bg-[#676394] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>

      <FlickeringGrid
        className={cn(
          "absolute top-0 -z-10",
          "[mask-image:radial-gradient(1400px_circle_at_center,transparent,white)]"
        )}
        squareSize={30}
        gridGap={10}
        color="#3B82F6" // blue-500
        maxOpacity={0.4}
        flickerChance={0.2}
      />

      {/* /* <Image
        fill
        src="/images/radial_1.svg"
        alt="Hero top right corenr radial light effect"
        className="absolute right-0 top-0 opacity-5 lg:opacity-10"
      /> */}
      <div className="container flex flex-col items-center gap-6 text-center">
        {/* {gitHubStars ? (
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="z-10"
          >
            <Badge
              variant="outline"
              aria-hidden="true"
              className="rounded-md px-3.5 py-1.5 text-sm transition-all duration-1000 ease-out hover:opacity-80 md:text-base md:hover:-translate-y-2"
            >
              <Icons.gitHub className="mr-2 size-3.5" aria-hidden="true" />
              {gitHubStars} Stars on GitHub
            </Badge>
            <span className="sr-only">GitHub</span>
          </Link>
        ) : null} */}
        {/* <span className="text-[#0047FF] z-10 font-geist border-2 border-blue-700 bg-opacity-30 px-4 transition-all duration-1000 ease-out py-2 md:hover:-translate-y-2 rounded-full text-sm dark:bg-gray-700 dark:text-white">
              AI-powered All-in-one
            </span> */}

        <h1
          className={`animate-fade-up font-anek text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          <Balancer>
            Seemless{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
              GenAI
            </span>{" "}
            <span className="text-gray-700">Platform</span> for every{" "}
            <span className="text-gray-700">Business</span>, every{" "}
            <span className="text-gray-700">Workflow</span>{" "}
          </Balancer>
        </h1>
        <div className="flex animate-fade-up gap-4">
          <span className="z-10 rounded-full border border-blue-700 bg-opacity-30 px-4 py-2 font-geist text-lg text-[#0047FF] dark:bg-gray-700 dark:text-white">
            Better
          </span>
          <span className="z-10 rounded-full border border-blue-700 bg-opacity-30 px-4 py-2 font-geist text-lg text-[#0047FF] dark:bg-gray-700 dark:text-white">
            Faster
          </span>
          <span className="z-10 rounded-full border border-blue-700 bg-opacity-30 px-4 py-2 font-geist text-lg text-[#0047FF] dark:bg-gray-700 dark:text-white">
            Cost-effective
          </span>
        </div>

        <h3 className="max-w-2xl animate-fade-up  font-geist text-muted-foreground sm:text-xl sm:leading-8">
          <Balancer>
            your business with AI-driven solutions that optimize your processes.
            Automate and Manage All in One Platform.
          </Balancer>
        </h3>

        <div className="z-10 flex animate-fade-up flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "transition-all duration-1000 ease-out md:hover:-translate-y-2"
            )}
          >
            Get Started
          </Link>

          <Link
            href={siteConfig.links.github}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "transition-all duration-1000 ease-out md:hover:-translate-y-2"
            )}
          >
            See Demo
          </Link>
        </div>
      </div>
    </section>
  )
}
