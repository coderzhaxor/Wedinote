import Link from "next/link";
import Image from "next/image";
import ButtonNavbar from "./ButtonNavbar";

const Navbar = () => {
  return (
    <nav className="bg-white">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="logo">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={24}
            height={24}
            className="h-8 w-auto sm:h-8"
            priority
          />
        </Link>
        <ButtonNavbar />
      </div>
    </nav>
  );
};

export default Navbar;
