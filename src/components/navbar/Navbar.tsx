import Link from "next/link";
import Image from "next/image";
import ButtonNavbar from "./ButtonNavbar";

const Navbar = () => {
  return (
    <nav className="bg-white">
      <div className="max-w-4xl mx-auto flex items-center justify-between py-4 px-4 md:px-6 lg:px-0">
        <Link href="/" className="logo">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={24}
            height={24}
            className="h-6 w-auto sm:h-8"
            priority
          />
        </Link>
        <ButtonNavbar />
      </div>
    </nav>
  );
};

export default Navbar;
