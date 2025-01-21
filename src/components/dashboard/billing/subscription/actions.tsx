import { getSubscriptionURLs } from "@/actions/subscription-action"

import { TypeSubscription } from "@/db/schema"

import { SubscriptionActionsDropdown } from "./actions-dropdown"

export async function SubscriptionActions({
  subscription,
}: {
  subscription: TypeSubscription
}) {
  if (
    subscription.status === "expired" ||
    subscription.status === "cancelled" ||
    subscription.status === "unpaid"
  ) {
    return null
  }

  const urls = await getSubscriptionURLs(subscription.lemonSqueezyId)

  return <SubscriptionActionsDropdown subscription={subscription} urls={urls} />
}
