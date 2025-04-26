import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatConditionPercentage } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export interface ProductResult {
  id: string;
  name: string;
  description: string;
  conditionRating: number;
  estimatedPrice: string;
  imageUrl: string;
}

interface ResultsSectionProps {
  isVisible: boolean;
  isLoading: boolean;
  results: ProductResult[];
  onAddToFavorites?: (result: ProductResult) => void;
}

export function ResultsSection({ isVisible, isLoading, results, onAddToFavorites }: ResultsSectionProps) {
  const { isAuthenticated } = useAuth();
  
  if (!isVisible) return null;

  return (
    <section className="py-16 bg-light-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-montserrat text-center mb-6">Results</h2>
        <p className="text-center mb-12 text-dark-gray">
          AI-powered recommendations based on your vehicle and search
        </p>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-dark-gray">Analyzing your vehicle details...</p>
          </div>
        )}

        {/* Results Container */}
        {!isLoading && results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {results.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="result-card bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={result.imageUrl} 
                      alt={result.name} 
                      className="w-full h-full object-cover" 
                    />
                    {isAuthenticated && onAddToFavorites && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-white rounded-full"
                        onClick={() => onAddToFavorites(result)}
                      >
                        <Heart className="h-5 w-5 text-red-500" />
                      </Button>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-montserrat mb-2">{result.name}</h3>
                    <p className="text-gray-600 mb-4">{result.description}</p>

                    <div className="mb-6">
                      <p className="text-dark-gray mb-1">Condition Rating</p>
                      <div className="condition-bar relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"
                          style={{ width: `${result.conditionRating}%` }}
                        />
                        <div 
                          className="condition-marker absolute w-3 h-3 bg-white border-2 border-primary rounded-full -mt-0.5" 
                          style={{ left: `${result.conditionRating}%`, transform: 'translateX(-50%)' }}
                        />
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="font-bold text-lg">
                        Estimated Price: <span className="text-primary">{result.estimatedPrice}</span>
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button 
                        className="w-full bg-secondary text-white hover:bg-gray-800 flex items-center justify-center"
                        onClick={() => window.open(`https://www.amazon.com/s?k=${encodeURIComponent(`${result.name} auto parts`)}`, '_blank')}
                      >
                        <i className="fab fa-amazon mr-2"></i> Amazon
                      </Button>
                      <Button 
                        className="w-full bg-[#e53238] text-white hover:bg-[#e53238]/90 flex items-center justify-center"
                        onClick={() => window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${result.name} auto parts`)}`, '_blank')}
                      >
                        <i className="fab fa-ebay mr-2"></i> eBay
                      </Button>
                      <Button 
                        className="w-full bg-[#3B5998] text-white hover:bg-[#3B5998]/90 flex items-center justify-center"
                        onClick={() => window.open(`https://jo.opensooq.com/en/find?term=${encodeURIComponent(`${result.name} auto parts`)}`, '_blank')}
                      >
                        <i className="fas fa-shopping-cart mr-2"></i> OpenSooq
                      </Button>
                    </div>
                    
                    {onAddToFavorites && (
                      <Button
                        variant="outline"
                        className="w-full mt-2 border-primary text-primary hover:bg-primary/10 flex items-center justify-center"
                        onClick={() => onAddToFavorites(result)}
                      >
                        <Heart className="h-4 w-4 mr-2" /> Add to Favorites
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && results.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-search text-5xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or vehicle details</p>
          </div>
        )}
      </div>
    </section>
  );
}
