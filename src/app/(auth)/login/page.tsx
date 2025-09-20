"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl p-4 flex flex-col h-[500px] justify-center items-center">
      <div className="p-6 mx-auto border rounded-md w-[500px] text-center">
        <h1 className="font-medium text-2xl italic mb-4">Welcome to WediNote</h1>
        <p className="mb-4 text-muted-foreground">Sign in with Google to continue</p>
        <Button variant="outline" className="flex w-full">
          <Image src="/google.svg" width={16} height={16} alt={"Google"} />
          Login with Google
        </Button>
      </div>
      <Button
        variant="link"
        onClick={() => router.back()}
        className="text-center mt-4 text-sm text-muted-foreground hover:underline hover:text-primary hover:cursor-pointer">
        ← Kembali ke beranda
      </Button>
    </div>
  )
};

export default LoginPage;
