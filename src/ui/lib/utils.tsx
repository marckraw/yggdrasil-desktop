import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTagColor = (tag: string) => {
  // Better hash function (djb2)
  let hash = 5381;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) + hash + tag.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Define color palette options (you can customize these)
  const colorPalettes = [
    {
      bg: "bg-blue-100 dark:bg-blue-900/50",
      text: "text-blue-800 dark:text-blue-300",
    },
    {
      bg: "bg-green-100 dark:bg-green-900/50",
      text: "text-green-800 dark:text-green-300",
    },
    {
      bg: "bg-purple-100 dark:bg-purple-900/50",
      text: "text-purple-800 dark:text-purple-300",
    },
    {
      bg: "bg-orange-100 dark:bg-orange-900/50",
      text: "text-orange-800 dark:text-orange-300",
    },
    {
      bg: "bg-pink-100 dark:bg-pink-900/50",
      text: "text-pink-800 dark:text-pink-300",
    },
    {
      bg: "bg-cyan-100 dark:bg-cyan-900/50",
      text: "text-cyan-800 dark:text-cyan-300",
    },
    {
      bg: "bg-indigo-100 dark:bg-indigo-900/50",
      text: "text-indigo-800 dark:text-indigo-300",
    },
    {
      bg: "bg-teal-100 dark:bg-teal-900/50",
      text: "text-teal-800 dark:text-teal-300",
    },
    {
      bg: "bg-red-100 dark:bg-red-900/50",
      text: "text-red-800 dark:text-red-300",
    },
    {
      bg: "bg-yellow-100 dark:bg-yellow-900/50",
      text: "text-yellow-800 dark:text-yellow-300",
    },
    {
      bg: "bg-lime-100 dark:bg-lime-900/50",
      text: "text-lime-800 dark:text-lime-300",
    },
    {
      bg: "bg-emerald-100 dark:bg-emerald-900/50",
      text: "text-emerald-800 dark:text-emerald-300",
    },
  ];

  // Use the hash to select a consistent color palette for the tag
  const index = Math.abs(hash) % colorPalettes.length;
  return colorPalettes[index];
};
