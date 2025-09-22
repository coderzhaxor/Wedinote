import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Papa from "papaparse";

export interface Contact {
  name: string;
  phone: string;
}

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

export const parseContacts = (input: string) => {
  return input
    .split("\n")
    .filter(line => line.trim() !== "")
    .map(line => {
      const match = line.match(/^(.*?)(?:\((.*?)\))?$/);

      let name = match?.[1]?.trim() ?? "";
      let phone = match?.[2]?.trim() ?? "08xxxxxxxxx";

      // Normalisasi nomor telepon
      if (phone.startsWith("0")) {
        phone = "+62" + phone.slice(1);
      } else if (phone.startsWith("6")) {
        phone = "+" + phone;
      } else if (phone.startsWith("8")) {
        phone = "+62" + phone;
      }

      return { name, phone };
    });
}

export const parseCsvContacts = (file: File): Promise<Contact[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as any[];

        const formatted: Contact[] = parsed.map((row) => ({
          name: row.name?.trim() ?? "",
          phone: row.phone?.trim() || "08xxxxxxxxx",
        }));

        resolve(formatted);
      },
      error: (err) => reject(err),
    });
  });
}

// Jika data adalah array of object, gunakan ini:
export const contactsToString = (contacts: Contact[]): string => {
  return contacts
    .map(({ name, phone }) => `${name} (${phone})`)
    .join('\n');
}