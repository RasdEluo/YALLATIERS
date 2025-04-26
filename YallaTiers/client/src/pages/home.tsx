import { useState, useRef } from "react";
import { WelcomeOverlay } from "@/components/welcome-overlay";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { SearchSection, SearchData } from "@/components/search-section";
import { ResultsSection, ProductResult } from "@/components/results-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { LoginModal } from "@/components/login-modal";
import { RegisterModal } from "@/components/register-modal";
import { AnalysisModal } from "@/components/analysis-modal";
import { getProductResults } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  // Auth state
  const { user, saveSearch, addFavorite, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  
  // Search & results state
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [lastSearchData, setLastSearchData] = useState<SearchData | null>(null);
  
  // Refs for scrolling
  const searchSectionRef = useRef<HTMLDivElement>(null);
  
  // Modal handlers
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };
  
  const handleShowRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };
  
  const handleShowLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };
  
  const handleAnalysisClick = () => {
    setIsAnalysisModalOpen(true);
  };
  
  // Scroll to search section
  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Handle search submission
  const handleSearch = async (searchData: SearchData) => {
    setIsResultsVisible(true);
    setIsSearching(true);
    setLastSearchData(searchData);
    
    try {
      const results = await getProductResults(searchData);
      setSearchResults(results);
      
      // Save search to history if user is logged in
      if (user) {
        await saveSearch(searchData);
        toast({
          title: "Search saved",
          description: "This search has been saved to your history",
        });
      }
    } catch (error) {
      console.error("Error performing search:", error);
      setSearchResults([]);
      
      toast({
        title: "Search error",
        description: "There was an error performing your search",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle adding a result to favorites
  const handleAddToFavorites = async (result: ProductResult) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to favorites",
        variant: "destructive",
      });
      setIsLoginModalOpen(true);
      return;
    }
    
    try {
      // First save the part to the database
      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.name,
          description: result.description,
          conditionRating: result.conditionRating,
          estimatedPrice: result.estimatedPrice,
          imageUrl: result.imageUrl,
          vehicleType: lastSearchData?.vehicleType || '',
          year: lastSearchData?.year || '',
          make: lastSearchData?.make || '',
          model: lastSearchData?.model || ''
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save part");
      }
      
      const savedPart = await response.json();
      
      // Then add to favorites
      await addFavorite(savedPart.id);
      
      toast({
        title: "Added to favorites",
        description: `${result.name} has been added to your favorites`,
      });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({
        title: "Error",
        description: "Failed to add item to favorites",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen">
      <WelcomeOverlay />
      
      <Navbar 
        onLoginClick={handleLoginClick} 
        onAnalysisClick={handleAnalysisClick} 
      />
      
      <HeroSection onGetStartedClick={scrollToSearch} />
      
      <div ref={searchSectionRef}>
        <SearchSection onSearch={handleSearch} />
      </div>
      
      <ResultsSection 
        isVisible={isResultsVisible}
        isLoading={isSearching}
        results={searchResults}
        onAddToFavorites={handleAddToFavorites}
      />
      
      <FeaturesSection />
      
      <Footer />
      
      <ScrollToTop />
      
      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onShowRegister={handleShowRegister}
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onShowLogin={handleShowLogin}
      />
      
      <AnalysisModal 
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
      />
    </div>
  );
}
