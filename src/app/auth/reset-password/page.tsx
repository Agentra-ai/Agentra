import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <ResetPasswordForm />
    </>
  );
}
