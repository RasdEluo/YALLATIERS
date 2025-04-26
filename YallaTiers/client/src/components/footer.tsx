import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo withText size="md" className="mb-4" />
            <p className="text-gray-400">
              Your one-stop solution for finding the perfect auto parts with AI-powered recommendations.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-montserrat mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer">How It Works</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-montserrat mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer">Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer">FAQ</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer">Vehicle Database</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer">Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-montserrat mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
            </div>
            <p className="text-gray-400">Subscribe to our newsletter for updates</p>
            <div className="mt-2 flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-dark-gray text-white rounded-l" 
              />
              <Button className="bg-primary text-secondary rounded-l-none hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Yalla Tiers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
