import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nl2br = (str: string) => {
  return str.split("\\n").map((line, i) => (
    <>
      {line}
      <br />
    </>
  ));
}

