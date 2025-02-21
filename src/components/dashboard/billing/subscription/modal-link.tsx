"use client";

import { useEffect, type ReactNode } from "react";
import { DropdownMenu } from "@lemonsqueezy/wedges";

export function LemonSqueezyModalLink({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    //@ts-ignore
    window.createLemonSqueezy();
  }, []);

  return (
    <DropdownMenu.Item
      onClick={() => {
        if (href) {
          //@ts-ignore
          window.LemonSqueezy.Url.Open(href);
        } else {
          throw new Error(
            "href provided for the Lemon Squeezy modal is not valid.",
          );
        }
      }}
    >
      {children}
    </DropdownMenu.Item>
  );
}
