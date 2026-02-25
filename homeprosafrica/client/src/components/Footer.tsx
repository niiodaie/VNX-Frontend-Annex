import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail, 
  Send 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-6 font-heading">
              HomePros<span className="text-accent">Africa</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Connecting African homeowners with trusted professionals for all home service needs.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Instagram size={18} />} />
              <SocialLink href="#" icon={<Linkedin size={18} />} />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 font-heading">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="#services">Services</FooterLink>
              <FooterLink href="#professionals">Professionals</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 font-heading">Services</h4>
            <ul className="space-y-3">
              <FooterLink href="#">Plumbing</FooterLink>
              <FooterLink href="#">Electrical Work</FooterLink>
              <FooterLink href="#">Cleaning</FooterLink>
              <FooterLink href="#">Landscaping</FooterLink>
              <FooterLink href="#">Carpentry</FooterLink>
              <FooterLink href="#">Painting</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 font-heading">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for tips and the latest service updates.
            </p>
            <form className="mb-4">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 border border-gray-700 rounded-r-none text-white"
                />
                <Button type="submit" className="bg-primary text-white rounded-l-none hover:bg-primary/90">
                  <Send size={18} />
                </Button>
              </div>
            </form>
            <p className="text-gray-400 text-sm">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} HomeProsAfrica. All rights reserved. 
            <span className="block mt-1">Powered by <span className="text-accent font-semibold">Visnec</span></span>
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="#">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            </Link>
            <Link href="#">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
            </Link>
            <Link href="#">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href}>
      <a className="text-gray-400 hover:text-white transition-colors">
        {icon}
      </a>
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href}>
        <a className="text-gray-400 hover:text-white transition-colors">{children}</a>
      </Link>
    </li>
  );
}
