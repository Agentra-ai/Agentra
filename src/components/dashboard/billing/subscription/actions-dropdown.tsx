"use client";

import { useState } from "react";
import {
  cancelSub,
  pauseUserSubscription,
  unpauseUserSubscription,
  type getSubscriptionURLs,
} from "@/actions/subscription-action";
import { Button, DropdownMenu, Loading } from "@lemonsqueezy/wedges";
import { MoreVerticalIcon } from "lucide-react";

import { TypeSubscription } from "@/drizzle/schema";

import { LemonSqueezyModalLink } from "./modal-link";

export function SubscriptionActionsDropdown({
  subscription,
  urls,
}: {
  subscription: TypeSubscription;
  urls: Awaited<ReturnType<typeof getSubscriptionURLs>>;
}) {
  const [loading, setLoading] = useState(false);

  if (
    subscription.status === "expired" ||
    subscription.status === "cancelled" ||
    subscription.status === "unpaid"
  ) {
    return null;
  }

  return (
    <>
      {loading && (
        <div className="bg-surface-50/50 absolute inset-0 z-10 flex items-center justify-center rounded-md">
          <Loading size="sm" />
        </div>
      )}

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button
            size="sm"
            variant="transparent"
            className="data-[state=open]:bg-surface-50 size-8"
            before={<MoreVerticalIcon className="size-4" />}
          />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content side="bottom" className="z-10" align="end">
          <DropdownMenu.Group>
            {!subscription.isPaused && (
              <DropdownMenu.Item
                onClick={async () => {
                  setLoading(true);
                  await pauseUserSubscription(subscription.lemonSqueezyId).then(
                    () => {
                      setLoading(false);
                    },
                  );
                }}
              >
                Pause payments
              </DropdownMenu.Item>
            )}

            {subscription.isPaused && (
              <DropdownMenu.Item
                onClick={async () => {
                  setLoading(true);
                  await unpauseUserSubscription(
                    subscription.lemonSqueezyId,
                  ).then(() => {
                    setLoading(false);
                  });
                }}
              >
                Unpause payments
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Item asChild>
              <a href={urls.customer_portal}>Customer portal ↗</a>
            </DropdownMenu.Item>

            <LemonSqueezyModalLink href={urls.update_payment_method}>
              Update payment method
            </LemonSqueezyModalLink>
          </DropdownMenu.Group>

          <DropdownMenu.Separator />

          <DropdownMenu.Group>
            <DropdownMenu.Item
              onClick={async () => {
                if (
                  // eslint-disable-next-line no-alert -- allow
                  confirm(
                    `Please confirm if you want to cancel your subscription.`,
                  )
                ) {
                  setLoading(true);
                  await cancelSub(subscription.lemonSqueezyId).then(() => {
                    setLoading(false);
                  });
                }
              }}
              destructive
            >
              Cancel subscription
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}
