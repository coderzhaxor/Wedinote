"use client"

import { Button } from "../ui/button";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";

const ButtonNavbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth()

  const handleAuth = () => setIsAuthenticated(!isAuthenticated);

  return (
    <>
      {!isAuthenticated ? (
        <Button
          onClick={handleAuth}
          variant="outline"
          className="hover:cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-150 ease-in-out"
        >
          Sign In
        </Button>
      ) : (
        <Avatar
          onClick={handleAuth}
          name="Alif Januantara Prima"
          email="ajanuantara@gmail.com"
          src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=100&w=64&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      )}
    </>
  );
};

export default ButtonNavbar;
