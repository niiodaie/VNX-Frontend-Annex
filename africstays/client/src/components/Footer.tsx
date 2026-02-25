import { Logo } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <Logo className="mr-2 text-primary text-xl" />
              <h3 className="text-xl font-bold font-heading text-primary">ExploreAfrica</h3>
            </div>
            <p className="mb-6 text-gray-400">Your gateway to unique stays and unforgettable experiences across the African continent.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <i className="fab fa-pinterest-p"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Explore</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Unique Stays</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Popular Destinations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Seasonal Offers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Gift Cards</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Become a Host</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to receive updates on new destinations and special offers.</p>
            <form className="flex flex-col sm:flex-row">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="w-full sm:w-auto mb-2 sm:mb-0 text-neutral-dark rounded-r-none"
              />
              <Button 
                type="submit" 
                className="bg-primary text-white px-4 py-2 rounded-l-none hover:bg-opacity-90 transition"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ExploreAfrica. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
