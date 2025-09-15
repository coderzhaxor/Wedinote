import Image from "next/image";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <div className="logo">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={24}
            height={24}
            className="h-8 w-auto sm:h-8"
            priority
          />
        </div>
        <Button
          variant="outline"
          className="hover:cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-150 ease-in-out"
        >
          Sign In
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
