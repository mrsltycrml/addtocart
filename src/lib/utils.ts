import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to format price with peso sign and commas
export function formatPrice(price: number) {
  return `₱${price.toLocaleString('en-PH', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
