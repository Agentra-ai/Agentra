"use server";

import { lucia } from "@/lib/auth";
import { validateRequest } from "@/lib/auth/get-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/auth/login");
};
