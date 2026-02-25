import { Link } from "wouter";
import { HelpCircle, Settings } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link href="/help">
              <a className="text-neutral-400 hover:text-neutral-500">
                <span className="sr-only">Help Center</span>
                <HelpCircle className="h-6 w-6" />
              </a>
            </Link>
            <Link href="/settings">
              <a className="text-neutral-400 hover:text-neutral-500">
                <span className="sr-only">Settings</span>
                <Settings className="h-6 w-6" />
              </a>
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-base text-neutral-500">&copy; {new Date().getFullYear()} EduMentorAI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
