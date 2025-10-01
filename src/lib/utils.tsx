import { type ClassValue, clsx } from "clsx";
import DOMPurify from "isomorphic-dompurify";
import Papa from "papaparse";
import { twMerge } from "tailwind-merge";

export interface Contact {
  name: string;
  phone: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nl2br = (str: string) => {
  return str.split("\\n").map((line, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: using array index as key is acceptable here
    <div key={i}>
      {line}
      <br />
    </div>
  ));
}

export const parseToDatabase = (text: string) => parseWhatsappMarkdown(text.split(/\n{4,}/g).join("<br><br>").split(/\n{2,}/g).join("<br>"));

export const parseWhatsappMarkdown = (text: string): string => {
  const variables: string[] = [];

  // step 1: amankan {{...}} ke placeholder
  const protectedText = text.replace(/\{\{[\w_]+\}\}/g, (match) => {
    const index = variables.length;
    variables.push(match); // simpan asli
    return `%%VAR-${index}%%`; // placeholder unik
  });

  let formatted = protectedText
    .replace(/\n{4,}/g, "<br><br>")
    .replace(/\n{2,}/g, "<br>")
    // .replace(/<br><br>/g, "<br>")
    // .replace(/<br><br><br><br>/g, "<br><br>")
    .replace(/\*([^*]+)\*/g, "<strong>$1</strong>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/~([^~]+)~/g, "<s>$1</s>");

  formatted = formatted.replace(/%%VAR-(\d+)%%/g, (_, idx) => variables[idx]);

  return purify(formatted)
}



export const purify = (str: string) => (
  DOMPurify.sanitize(str, {
    ALLOWED_TAGS: ['em', 'strong', 'a', 'br', 's'],
  })
)


export const parseContacts = (input: string) => {
  return input
    .split("\n")
    .filter(line => line.trim() !== "")
    .map(line => {
      const match = line.match(/^(.*?)(?:\((.*?)\))?$/);

      const name = match?.[1]?.trim() ?? "";
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
        const parsed = results.data as Contact[];

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