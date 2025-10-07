"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      // Cek koneksi sebelum mencoba sign in
      if (!navigator.onLine) {
        throw new Error("NO_INTERNET");
      }

      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

    } catch (error: any) {
      if (error.message === "NO_INTERNET") {
        return toast.error("Tidak ada koneksi internet. Periksa sambunganmu.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-4 flex flex-col h-[500px] justify-center items-center">
      <div className="p-6 mx-auto border rounded-md max-w-sm md:w-[500px] text-center">
        <h1 className="font-medium text-2xl italic mb-4">Welcome to WediNote</h1>
        <p className="mb-4 text-muted-foreground">Sign in with Google to continue</p>
        <Button
          onClick={handleGoogleSignIn}
          variant="outline" disabled={isLoading ? true : false} className="flex w-full py-6 hover:cursor-pointer">
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
