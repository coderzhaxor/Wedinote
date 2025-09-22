"use client"

import Avatar from "./Avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const ButtonNavbar = () => {
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  const handleLogout = useCallback(async () => {
    if (isSigningOut) return router.push("/login")
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
      router.push("/login");
    }
  }, [isSigningOut]);

  // Skeleton component
  const Skeleton = () => (
    <div className="animate-pulse">
      <div className="rounded-full bg-gray-200 h-8 w-8" />
    </div>
  );

  return (
    <>
      {isPending || isSigningOut ? (
        <Skeleton />
      ) : !session ? (
        <Button
          asChild
          variant="outline"
          className="hover:cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-150 ease-in-out"
        >
          <Link href="/login" >
            Sign In
          </Link>
        </Button>
      ) : (
        <Avatar
          onClick={handleLogout}
          name={session.user.name}
          email={session.user.email}
          src={session.user.image || "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=100&w=64&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        />
      )}
    </>
  );
};

export default ButtonNavbar;
