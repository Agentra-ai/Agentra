/* eslint-disable @typescript-eslint/prefer-optional-chain -- allow */
import { getUserSubscriptions, syncPlans } from "@/actions/subscription-action"
import { type Subscription } from "@lemonsqueezy/lemonsqueezy.js"

import { db } from "@/lib/db"
import { pricingPlans, TypePricingPlan } from "@/lib/db/schema"

import { InfoMessage, NoPlans, Plan } from "./plan"

export async function Plans({
  isChangingPlans = false,
}: {
  isChangingPlans?: boolean
  currentPlan?: TypePricingPlan
}) {
  let allPlans: TypePricingPlan[] = await db.select().from(pricingPlans)
  const userSubscriptions = await getUserSubscriptions()

  // Do not show plans if the user already has a valid subscription.
  if (userSubscriptions.length > 0) {
    const hasValidSubscription = userSubscriptions.some((subscription) => {
      const status =
        subscription.status as Subscription["data"]["attributes"]["status"]

      return (
        status !== "cancelled" && status !== "expired" && status !== "unpaid"
      )
    })

    if (hasValidSubscription && !isChangingPlans) {
      return null
    }
  }

  // If there are no plans in the database, sync them from Lemon Squeezy.
  // You might want to add logic to sync plans periodically or a webhook handler.
  if (!allPlans.length) {
    allPlans = await syncPlans()
  }

  if (!allPlans.length) {
    return <NoPlans />
  }

  const sortedPlans = allPlans.sort((a, b) => {
    if (
      a.sort === undefined ||
      a.sort === null ||
      b.sort === undefined ||
      b.sort === null
    ) {
      return 0
    }

    return a.sort - b.sort
  })

  return (
    <div>
      <h2 className='after:bg-surface-100 flex items-center after:ml-5 after:h-px after:grow after:content-[""]'>
        Plans
      </h2>

      <div className="mb-5 mt-3 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
        {sortedPlans.map((plan, index) => {
          return <Plan key={`plan-${index}`} plan={plan} />
        })}
      </div>

      <InfoMessage />
    </div>
  )
}
