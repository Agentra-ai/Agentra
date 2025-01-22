import { NextApiRequest, NextApiResponse } from "next"

import { db } from "@/lib/db"
import { pricingPlans } from "@/db/schema"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await db.select().from(pricingPlans)
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
