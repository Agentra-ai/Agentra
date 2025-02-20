import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  OAuthSigninButtons,
  OAuthSigninButtonsSkeleton,
} from "@/components/oauth-signin-buttons";
import { Suspense } from "react";

export default function SigninPage() {
  return (
    <main className="mt-4">
      <div className="container">
        {/* OAuth Links */}
        <div className="my-4 h-1 bg-muted" />
        <Suspense fallback={<OAuthSigninButtonsSkeleton />}>
          <OAuthSigninButtons />
        </Suspense>
      </div>
    </main>
  );
}
