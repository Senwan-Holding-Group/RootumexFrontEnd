import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const capitalize = (str: string) =>
  str?.replace(/\b\w/g, (substr) => substr.toUpperCase());
type FormatNumberOptions = {
  decimals?: number;
};
 export const calculateLineTotal = (quantity: number, price: number): number => {
    return Number((Math.abs(quantity) * price).toFixed(4));
  };
export const numberWithCommas = (
  value: number | string | null | undefined,
  options: FormatNumberOptions = {}
): string => {
  const { decimals = 3 } = options;

  try {
    if (value === null || value === undefined || value === "") {
      return String(value ?? "");
    }

    const number = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(number)) {
      return String(value);
    }


    const parts = number.toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (parts[1]) {
      parts[1] = parts[1].replace(/0+$/, "");
      return parts[1].length > 0 ? parts.join(".") : parts[0];
    }

    return parts[0];
  } catch (error) {
    console.log(error);
    
    return String(value ?? "");
  }
};