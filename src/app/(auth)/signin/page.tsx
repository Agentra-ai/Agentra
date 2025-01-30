import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { env } from "@/env.mjs";
import auth from "@/lib/auth";
import { DEFAULT_SIGNIN_REDIRECT } from "@/config/defaults";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { IoEarth } from "react-icons/io5";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage(): Promise<JSX.Element> {
  const session = await auth();
  if (session) {
    redirect(DEFAULT_SIGNIN_REDIRECT);
  }

  return (
    <div className="relative flex min-h-[600px] w-full items-center justify-center px-4 sm:bg-[#eef4ff] rounded-2xl">
      {/* Floxify Logo - Top Left */}
      <div className="absolute top-2 left-2 flex items-center">
        <Image
          src="/floxify-logo.png"
          width={40}
          height={40}
          alt="Floxify Logo"
        />
        <h1 className="text-lg sm:text-2xl font-urbanist font-semibold text-black">
          floxify:
        </h1>
      </div>

      {/* Language Selector - Top Right */}
      <div className="absolute top-2 right-2 flex items-center border rounded-lg px-2 py-1">
        <IoEarth className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        <h1 className="text-sm sm:text-md font-inter p-1 text-black">English</h1>
      </div>

      {/* Authentication Card */}
      <Card className="w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200 p-6 sm:p-10">
        {/* Header */}
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-xl sm:text-2xl font-semibold md:ml-5 text-black text-left">
            👋 Hey, let's get started!
          </CardTitle>
          <CardDescription className="text-gray-800">
            Sign in with one of the following methods. 🔑
          </CardDescription>
        </CardHeader>

        {/* OAuth Login Buttons */}
        <CardContent className="space-y-6 pt-4">
          <OAuthButtons />
        </CardContent>

        {/* Separator */}
        {/* {/* <div className="relative my-6 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <div className="w-full border-t border-gray-300"></div>
        </div> */}

        {/* Sign-In Options (Optional) */} 
        <CardContent className="space-y-4">{/* Placeholder for Email & Password Login (Add Later) */}</CardContent>

        {/* Footer */}
        <CardFooter className="absolute bottom-2 right-2 text-gray-600">
          <p className="text-sm">
            &copy;{new Date().getFullYear()} floxify.ai. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
