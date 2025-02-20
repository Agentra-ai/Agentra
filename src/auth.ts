import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { createWorkspace } from "./actions/workspace/workspace-action";

const { providers: authConfigProviders, ...authConfigRest } = authConfig;

const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [...authConfigProviders],
  events: {
    async signIn({ user }) {
      // const workspace = await createWorkspace({
      //   name: user.name!,
      //   userId: user.id!,
      // })
      // await updateUserWorkspaceInUserTable({
      //   id: user.id!,
      //   workspaceId: workspace?.id!,
      // })
    },
  },
});

export const { signIn, signOut, auth, handlers } = nextAuth;
