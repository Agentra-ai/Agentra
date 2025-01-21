"use client"

import type { FC } from "react"
import React, { useState } from "react"
import clsx from "clsx"

import { triggerFireworks } from "../ui/confetti-button"

// import {Accordion} from "@/components/ui/accordion";
// import { SparklesCore } from "@/components/ui/sparkles";
// import GridPattern from "@/components/magicui/animated-grid-pattern";

interface SelectPlanRangeProps {
  value: "monthly" | "yearly"
  onChange: (value: "monthly" | "yearly") => void
}

type Plan = "sandbox" | "professional" | "team" | "enterprise"
type AllPlan = {
  [key in Plan]: {
    type: Plan
    price: number
    level: number
    messageRequest: { en: string; zh: string }
    modelProviders: string
    teamMembers: number | string
    buildApps: number | string
    vectorSpace: number | string
    documentsUploadQuota: string
    logHistory: number | string
    customTools: number | string
    support: string
    paymentOptions: {
      monthly: {
        link: string
        priceId: string
        price: number
        duration: string
      }
      yearly: {
        link: string
        priceId: string
        price: number
        duration: string
      }
    }
  }
}

const priceClassName =
  "leading-[35px] text-[28px] text-[40px] font-semibold text-gray-900"

const style = {
  sandbox: {
    bg: "bg-[#F2F4F7]",
    title: "text-gray-900",
    hoverAndActive:
      "hover:shadow-lg hover:!text-white hover:!bg-gray-900 hover:!border-gray-900 active:!text-white active:!bg-gray-900 active:!border-gray-900",
  },
  professional: {
    // bg: "bg-[#E0EAFF]",
    bg: "bg-[#E8FFF0]",
    title: "text-[#148219]",
    hoverAndActive:
      "hover:shadow-lg hover:!text-white hover:!bg-[#29bf1e] hover:!border-[#148214] active:!text-white active:!bg-[#148214] active:!border-[#148214]",
  },
  team: {
    bg: "bg-[#E0F2FE]",
    title: "text-[#026AA2]",
    hoverAndActive:
      "hover:shadow-lg hover:!text-white hover:!bg-[#0086C9] hover:!border-[#026AA2] active:!text-white active:!bg-[#026AA2] active:!border-[#026AA2]",
  },
  enterprise: {
    bg: "bg-[#FFEED2]",
    title: "text-[#DC6803]",
    hoverAndActive:
      "hover:shadow-lg hover:!text-white hover:!bg-[#F79009] hover:!border-[#DC6803] active:!text-white active:!bg-[#DC6803] active:!border-[#DC6803]",
  },
}

const ALL_PLANS: AllPlan = {
  sandbox: {
    type: "sandbox",
    price: 0,
    level: 1,
    messageRequest: { en: "50", zh: "50" },
    modelProviders: "OpenAI",
    teamMembers: 2,
    buildApps: 10,
    vectorSpace: "5MB",
    documentsUploadQuota: "50",
    logHistory: "30 days",
    customTools: "only for explore",
    support: "Basic Email Support",
    paymentOptions: {
      monthly: {
        link: "",
        priceId: "",
        price: 0,
        duration: "/month",
      },
      yearly: {
        link: "",
        priceId: "",
        price: 0,
        duration: "/yearly",
      },
    },
  },
  professional: {
    type: "professional",
    price: 19,
    level: 2,
    messageRequest: { en: "5000", zh: "5000" },
    modelProviders:
      "OpenAI/Anthropic/Azure OpenAI/Llama2/Hugging Face/Replicate",
    teamMembers: 10,
    buildApps: "50",
    vectorSpace: "100MB",
    documentsUploadQuota: "500",
    logHistory: "30 days",
    customTools: "10",
    support: "Email Support(within 24 hour)",
    paymentOptions: {
      monthly: {
        link:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_MONTHLY_PROFF_PLAN_PAYMENT_LINK_DEV!
            : process.env.STRIPE_MONTHLY_PROFF_PLAN_PAYMENT_LINK!,
        priceId:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_MONTHLY_PROFF_PLAN_PRICE_ID_DEV!
            : process.env.STRIPE_MONTHLY_PROFF_PLAN_PRICE_ID!,
        price: 19,
        duration: "/month",
      },
      yearly: {
        link:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_SIX_M_PROFF_PLAN_PAYMENT_LINK_DEV!
            : process.env.STRIPE_SIX_M_PROFF_PLAN_PAYMENT_LINK!,
        priceId:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_SIX_M_PROFF_PLAN_PRICE_ID_DEV!
            : process.env.STRIPE_SIX_M_PROFF_PLAN_PRICE_ID!,
        price: 190,
        duration: "/yearly",
      },
    },
  },
  team: {
    type: "team",
    price: 39,
    level: 3,
    messageRequest: { en: "10000", zh: "10000" },
    modelProviders:
      "OpenAI/Anthropic/Azure OpenAI/Llama2/Hugging Face/Replicate",
    teamMembers: 50,
    buildApps: "up to 100",
    vectorSpace: "400MB",
    documentsUploadQuota: "1000",
    logHistory: "unlimited",
    customTools: "unlimited",
    support: "Priority Email & chat support",
    paymentOptions: {
      monthly: {
        link:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_MONTHLY_TEAMS_PLAN_PAYMENT_LINK_DEV!
            : process.env.STRIPE_MONTHLY_TEAMS_PLAN_PAYMENT_LINK!,
        priceId:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_MONTHLY_TEAMS_PLAN_PRICE_ID_DEV!
            : process.env.STRIPE_MONTHLY_TEAMS_PLAN_PRICE_ID!,
        price: 39,
        duration: "/month",
      },
      yearly: {
        link:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_SIX_M_TEAMS_PLAN_PAYMENT_LINK_DEV!
            : process.env.STRIPE_SIX_M_TEAMS_PLAN_PAYMENT_LINK!,
        priceId:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_SIX_M_TEAMS_PLAN_PRICE_ID_DEV!
            : process.env.STRIPE_SIX_M_TEAMS_PLAN_PRICE_ID!,
        price: 390,
        duration: "/yearly",
      },
    },
  },

  enterprise: {
    type: "enterprise",
    price: 99,
    level: 4,
    messageRequest: { en: "22000", zh: "22000" },
    modelProviders:
      "OpenAI/Anthropic/Azure OpenAI/Llama2/Hugging Face/Replicate",
    teamMembers: "up to 200",
    buildApps: "up to 500",
    vectorSpace: "2GB",
    documentsUploadQuota: "Unlimited",
    logHistory: "Unlimited",
    customTools: "Unlimited",
    support: "Priority Email support & chat support (quick)",
    paymentOptions: {
      monthly: {
        link:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_MONTHLY_ENTERPRISING_PLAN_PAYMENT_LINK_DEV!
            : process.env.STRIPE_MONTHLY_ENTERPRISING_PLAN_PAYMENT_LINK!,
        priceId:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_MONTHLY_ENTERPRISING_PLAN_PRICE_ID_DEV!
            : process.env.STRIPE_MONTHLY_ENTERPRISING_PLAN_PRICE_ID!,
        price: 99,
        duration: "/month",
      },
      yearly: {
        link:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_SIX_M_ENTERPRISING_PLAN_PAYMENT_LINK_DEV!
            : process.env.STRIPE_SIX_M_ENTERPRISING_PLAN_PAYMENT_LINK!,
        priceId:
          process.env.NODE_ENV === "development"
            ? process.env.STRIPE_SIX_M_ENTERPRISING_PLAN_PRICE_ID_DEV!
            : process.env.STRIPE_SIX_M_ENTERPRISING_PLAN_PRICE_ID!,
        price: 990,
        duration: "/yearly",
      },
    },
  },
}

const KeyValue = ({
  label,
  value,
  tooltip,
}: {
  label: string
  value: string | number | JSX.Element
  tooltip?: string
}) => {
  return (
    <div className="font-inclusiveSans mt-3.5  text-[16px] font-medium leading-[125%]">
      <div className="flex items-center space-x-1 text-gray-500">
        <div>{label}</div>
      </div>
      <div className="mt-0.5 text-gray-900">{value}</div>
    </div>
  )
}
// SelectPlanRange Component
const SelectPlanRange: FC<SelectPlanRangeProps> = ({ value, onChange }) => {
  return (
    <div className="text-center tracking-normal">
      <div className="mb-4 pl-[100px] font-inter text-sm font-medium text-[#F26725]">
        yeary Tip
      </div>
      <div className="relative flex rounded-full border border-black/5 bg-[#F5F8FF] p-1">
        <div
          className={clsx(
            value === "monthly" ? "bg-[#155EEF] text-white" : "text-gray-900",
            "flex h-11 cursor-pointer items-center rounded-[32px] px-8 text-[15px]"
          )}
          onClick={() => onChange("monthly")}
        >
          <span className="z-48">Monthly</span>
        </div>
        <div
          className={clsx(
            value === "yearly" ? "bg-[#155EEF] text-white" : "text-gray-900",
            "flex h-11 cursor-pointer items-center rounded-[32px] px-8 text-[15px]"
          )}
          onClick={() => onChange("yearly")}
        >
          <span className="z-48">Yearly</span>
        </div>
      </div>
    </div>
  )
}

// PlanItem Component
const PlanItem: FC<{
  currentPlan: string
  plan: keyof typeof ALL_PLANS
  planRange: "monthly" | "yearly"
  canPay: boolean
}> = ({ plan, currentPlan, planRange, canPay }) => {
  const [loading, setLoading] = useState(false)
  const planInfo = ALL_PLANS[plan]
  const isYearly = planRange === "yearly"
  const isCurrent = plan === currentPlan
  const isPlanDisabled =
    planInfo.level <= ALL_PLANS[currentPlan as keyof typeof ALL_PLANS].level ||
    (!canPay && plan !== "enterprise")

  const handleGetPayUrl = async () => {
    if (loading) return

    if (isPlanDisabled) return

    if (plan === "sandbox") return

    if (planInfo.paymentOptions) {
      const option = planInfo.paymentOptions[isYearly ? "yearly" : "monthly"]
      window.location.href = option.link
    }
    setLoading(true)
    try {
      // Simulate payment process
      window.location.href = "https://payment.url"
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={clsx(
        plan === "team" ? "bg-[#1a55ff  ] p-0.5" : "mt-8 p-0.5",
        "flex w-full flex-col rounded-xl border font-anek",
        isPlanDisabled ? "" : `${style[plan].hoverAndActive}`
      )}
    >
      {plan === "team" && (
        <div className="text-md flex h-7 items-center justify-center font-medium leading-[12px] text-[#F5F8FF]">
          Most Popular
        </div>
      )}
      <div className={clsx(style[plan].bg, "rounded-[10px] px-6 py-6")}>
        <div
          className={clsx(
            style[plan].title,
            "mb-1 text-lg font-semibold leading-[125%]"
          )}
        >
          {plan}
        </div>
        <div
          className={clsx(
            plan === "sandbox" ? "mb-5 text-[#FB6514]" : "mb-4 text-gray-500",
            "h-8 text-[13px] font-normal leading-[125%]"
          )}
        >
          Description of {plan}
        </div>

        {/* Price */}
        {plan === "sandbox" && <div className={priceClassName}>Free</div>}
        {/* {plan === "enterprise" && (
          <div className={priceClassName}>Contact Sales</div>
        )} */}
        {plan !== "sandbox" && (
          <div className="flex h-9 items-end">
            <div className={priceClassName}>
              {isYearly
                ? `$${planInfo?.paymentOptions?.yearly.price}`
                : `$${planInfo?.paymentOptions?.monthly.price}`}
            </div>
            <div className="ml-1">
              {isYearly && (
                <div className="text-xs font-medium leading-[18px] text-[#F26725]">
                  {`$${
                    planInfo?.paymentOptions?.monthly.price * 6 -
                    planInfo?.paymentOptions?.yearly.price
                  } off`}
                </div>
              )}
              {isYearly && (
                <div className="text-[13px] font-normal text-gray-500">
                  {`($${(planInfo?.paymentOptions?.yearly.price / 6).toFixed(
                    2
                  )}/month avg)`}
                </div>
              )}
              <div className="text-[15px] font-normal leading-[18px] text-gray-500">
                /{!isYearly ? "month" : "yearly"}
              </div>
            </div>
          </div>
        )}

        <div
          className={clsx(
            plan === "professional" &&
              !isCurrent &&
              "!border !border-[#3538CD] !bg-[#444CE7] !text-white shadow-sm",
            isPlanDisabled
              ? "opacity-30"
              : `${style[plan].hoverAndActive} cursor-pointer`,
            "mt-4 flex h-11 items-center justify-center rounded-3xl border-[2px] border-gray-900 text-sm font-semibold text-gray-900"
          )}
          onClick={handleGetPayUrl}
        >
          {isCurrent ? "Current Plan" : "Get Started"}
        </div>

        <div className="my-4 h-[1px] bg-black/5"></div>

        <div className="text-[13px] font-normal leading-[125%] text-gray-900">
          Includes:
        </div>
        <KeyValue
          label="Message Requests"
          value={planInfo.messageRequest.en}
          tooltip="planInfo"
        />
        <KeyValue label="Model Providers" value={planInfo.modelProviders} />
        <KeyValue label="Team Members" value={planInfo.teamMembers} />
        <KeyValue label="Build Apps" value={planInfo.buildApps} />
        <KeyValue label="Vector Space" value={planInfo.vectorSpace} />
        <KeyValue
          label="Documents Upload Quota"
          value={planInfo.documentsUploadQuota}
        />
        {/* <KeyValue
          label="Document Processing Priority"
        /> */}
        {/* <KeyValue
          label="Annotated Response"
        /> */}
        <KeyValue label="Log History" value={planInfo.logHistory} />
        <KeyValue label="Custom Tools" value={planInfo.customTools} />
        <KeyValue label="Support" value={planInfo.support} />
      </div>
    </div>
  )
}

const Pricing: FC = () => {
  const [planRange, setPlanRange] = useState<"monthly" | "yearly">("monthly")
  const currentPlan = "professional"
  const canPay = true

  React.useEffect(() => {
    triggerFireworks()
  }, [])

  return (
    <div className="container m-0 flex w-full flex-col items-center justify-center p-0 pt-20  font-inter">
      {/* <GridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={4}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[150%] skew-y-12",
        )}
      /> */}
      <div className="relative z-10 flex min-h-[300px] w-full flex-col -tracking-widest">
        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-md">
          <section className="z-10 flex flex-col items-center justify-between gap-10">
            <div className="text-center">
              <h1 className="mb-6 max-w-3xl font-anek text-7xl font-semibold">
                <span className="text-blue-700">Fair </span>and
                <span className="text-blue-700"> transparent</span> pricing to
                help you <span className="text-blue-700">scale</span>
              </h1>
              {/* <span className="text-2xl text-[#3f56ea] bg-blue-500/15 rounded-3xl p-2 px-4">
                Spend wisely, Save nicely
              </span> */}
            </div>
            <SelectPlanRange value={planRange} onChange={setPlanRange} />
          </section>
        </div>

        {/* background */}
        {/* <div className="w-full h-full absolute">

          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-1/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-1/4 blur-sm" />

          <SparklesCore
            background="transparent"
            minSize={0.5}
            maxSize={1.4}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#16457a"
          />

          <div className="absolute inset-0 w-full bg-white h-full [mask-image:radial-gradient(450px_350px_at_top,transparent_20%,white)]"></div>
        </div> */}
      </div>
      <div className="flex w-full flex-col">
        <div className="container mt-8">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
              {Object.keys(ALL_PLANS).map((planKey) => (
                <div key={planKey} className="mb-8 flex">
                  <PlanItem
                    currentPlan={currentPlan}
                    plan={planKey as keyof typeof ALL_PLANS}
                    planRange={planRange}
                    canPay={canPay}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <Accordion /> */}
    </div>
  )
}

export default Pricing
