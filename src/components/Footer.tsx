import Link from "next/link";
import { LinkedinIcon } from "lucide-react";
import { GithubIcon } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="max-w-4xl mx-auto py-8 px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
      <span>© 2025 Januantara - All Right Reserved.</span>
      <div className="flex space-x-2">
        <Link
          href="https://www.linkedin.com/in/januantara/"
          target="_blank"
          rel="noreferrer"
        >
          <Button size="icon" variant="outline">
            <LinkedinIcon />
          </Button>
        </Link>
        <Link
          href="https://github.com/coderzhaxor"
          target="_blank"
          rel="noreferrer"
        >
          <Button size="icon" variant="outline">
            <GithubIcon />
          </Button>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
