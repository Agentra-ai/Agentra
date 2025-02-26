"use client";

import {
  forwardRef,
  useState,
  type ComponentProps,
  type ElementRef,
} from "react";
import { useRouter } from "next/navigation";
import { changePlan, getCheckoutURL } from "@/actions/subscription-action";
import { Button, Loading } from "@lemonsqueezy/wedges";
import { CheckIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { TypePricingPlan } from "@/drizzle/schema";

type ButtonElement = ElementRef<typeof Button>;
type ButtonProps = ComponentProps<typeof Button> & {
  embed?: boolean;
  isChangingPlans?: boolean;
  currentPlan?: TypePricingPlan | null;
  plan: TypePricingPlan;
};

export const SignupButton = forwardRef<ButtonElement, ButtonProps>(
  (props, ref) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
      embed = true,
      plan,
      currentPlan,
      isChangingPlans = false,
      ...otherProps
    } = props;

    const isCurrent = currentPlan && plan.id === currentPlan.id;

    // eslint-disable-next-line no-nested-ternary -- allow
    const label = isCurrent
      ? "Your plan"
      : isChangingPlans
        ? "Switch to this plan"
        : "Sign up";

    // eslint-disable-next-line no-nested-ternary -- disabled
    const before = loading ? (
      <Loading size="sm" className="dark size-4" color="secondary" />
    ) : (props.before ?? isCurrent) ? (
      <CheckIcon className="size-4" />
    ) : (
      <PlusIcon className="size-4" />
    );

    return (
      <Button
        ref={ref}
        before={before}
        disabled={(loading || isCurrent) ?? props.disabled}
        onClick={async () => {
          // If changing plans, call server action.
          if (isChangingPlans) {
            if (!currentPlan?.id) {
              throw new Error("Current plan not found.");
            }

            if (!plan.id) {
              throw new Error("New plan not found.");
            }

            setLoading(true);
            await changePlan(currentPlan.id, plan.id);
            setLoading(false);

            return;
          }

          // Otherwise, create a checkout and open the Lemon.js modal.
          let checkoutUrl: string | undefined = "";
          try {
            setLoading(true);
            checkoutUrl = await getCheckoutURL(plan.variantId, embed);
          } catch (error) {
            setLoading(false);
            toast("Error creating a checkout.", {
              description:
                "Please check the server console for more information.",
            });
          } finally {
            embed && setLoading(false);
          }

          embed
            ? //@ts-ignore
              checkoutUrl && window.LemonSqueezy.Url.Open(checkoutUrl)
            : router.push(checkoutUrl ?? "/");
        }}
        {...otherProps}
      >
        {label}
      </Button>
    );
  },
);

SignupButton.displayName = "SignupButton";
