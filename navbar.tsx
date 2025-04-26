import { useState } from "react";
import { Link } from "wouter";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Heart, History, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface NavbarProps {
  onLoginClick: () => void;
  onAnalysisClick: () => void;
}

export function Navbar({ onLoginClick, onAnalysisClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLoginClick = () => {
    onLoginClick();
    setMobileMenuOpen(false);
  };

  const handleAnalysisClick = () => {
    onAnalysisClick();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-secondary shadow-md fixed w-full z-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Logo withText size="sm" />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className="text-white hover:text-primary transition-colors duration-300 cursor-pointer">Home</span>
            </Link>
            <button
              onClick={handleAnalysisClick}
              className="text-white hover:text-primary transition-colors duration-300"
            >
              Analysis
            </button>
            <Link href="/">
              <span className="text-white hover:text-primary transition-colors duration-300 cursor-pointer">About</span>
            </Link>
            <Link href="/">
              <span className="text-white hover:text-primary transition-colors duration-300 cursor-pointer">Contact</span>
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="default" 
                    className="bg-primary text-secondary hover:bg-primary/90 mr-2 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    <span>Search History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={onLoginClick} 
                variant="default" 
                className="bg-primary text-secondary hover:bg-primary/90 mr-2"
              >
                Login
              </Button>
            )}
            <button
              className="md:hidden text-white hover:text-primary"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'}`}>
          <div className="flex flex-col space-y-4 py-4 border-t border-gray-700">
            <Link href="/">
              <span className="text-white hover:text-primary transition-colors duration-300 cursor-pointer">Home</span>
            </Link>
            <button
              onClick={handleAnalysisClick}
              className="text-white hover:text-primary transition-colors duration-300 text-left"
            >
              Analysis
            </button>
            <Link href="/">
              <span className="text-white hover:text-primary transition-colors duration-300 cursor-pointer">About</span>
            </Link>
            <Link href="/">
              <span className="text-white hover:text-primary transition-colors duration-300 cursor-pointer">Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
