import React from "react";
import { redirect } from "next/navigation";

type Props = {};

const DocsRedirect = (props: Props) => {
  return redirect("/docshub/askme");
};

export default DocsRedirect;
