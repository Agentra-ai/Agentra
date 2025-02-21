"use client";
// import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/react";

export const Footer = () => {
  return (
    <footer className="py-40">
      <div className="container">
        <h1 className="relative z-10 bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text text-center font-sans text-lg font-bold text-transparent md:text-6xl">
          Join Us on GitHub
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
          Explore our open-source authentication solution on GitHub. Contribute
          to the project, share feedback, and be a part of our growing
          community.
        </p>
        <div className="flex justify-center pt-6">
          <Button
            // startContent={
            //   // <Icon className="text-default-500" icon="fe:github" width={24} />
            // }
            size="lg"
            as={"a"}
            href="https://github.com/teo-goulois/nextjs-lucia-auth-drizzle-orm-template"
            target="_blank"
          >
            GitHub
          </Button>
        </div>
      </div>
    </footer>
  );
};
