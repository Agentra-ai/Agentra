import React from "react"
import { redirect } from "next/navigation"

type Props = {}

const page = (props: Props) => {
  return redirect("/apps/explore")
}

export default page
