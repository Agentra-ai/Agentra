import { Subscription } from "@lemonsqueezy/lemonsqueezy.js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.BASE_URL}${path}`;
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export async function getGitHubStars(): Promise<number | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/pjborowiecki/SAASY-LAND-Next-14-Starters-With-Authentication-And-Database-Implemented",
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: {
          revalidate: 60,
        },
      },
    );

    if (!response.ok) return null;

    const data = (await response.json()) as { stargazers_count: number };

    return data.stargazers_count;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}

export function formatPrice(priceInCents: string) {
  const price = parseFloat(priceInCents);
  const dollars = price / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // Use minimumFractionDigits to handle cases like $59.00 -> $59
    minimumFractionDigits: dollars % 1 !== 0 ? 2 : 0,
  }).format(dollars);
}

export function formatDate(date: string | number | Date | null | undefined) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function checkRequiredEnv() {
  if (!process.env.LEMONSQUEEZY_API_KEY) {
    throw new Error("Missing LEMONSQUEEZY_API_KEY. Set it in your .env file.");
  }

  if (!process.env.LEMONSQUEEZY_STORE_ID) {
    throw new Error("Missing LEMONSQUEEZY_STORE_ID. Set it in your .env file.");
  }

  if (!process.env.LEMONSQUEEZY_STORE_ID) {
    throw new Error("Missing LEMONSQUEEZY_API_KEY. Set it in your .env file.");
  }
}

export function isValidSubscription(
  status: Subscription["data"]["attributes"]["status"],
) {
  return status !== "cancelled" && status !== "expired" && status !== "unpaid";
}

export function takeUniqueOrThrow<T extends unknown[]>(values: T): T[number] {
  if (values.length !== 1)
    throw new Error("Found non unique or inexistent value");
  return values[0];
}
