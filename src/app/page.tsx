import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center">
      <Image
        src="/hero-image.svg"
        alt="Hero Image"
        width={300}
        height={100}
        className="rounded-lg mt-10"
      />
      <h1 className="text-3xl font-bold mt-4 text-zinc-800">
        Welcome To <em>WediNote</em>
      </h1>
      <p className="text-center text-muted-foreground mt-2 max-w-lg ">
        Create beautiful wedding invitation messages, customize them for every
        guest, and share with just one click.
      </p>
      <Button className="mt-6 hover:cursor-pointer">
        Create Yours Now <Rocket />
      </Button>
    </main>
  );
}
