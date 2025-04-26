import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getYearRange } from "@/lib/utils";
import { getMakes, getModels } from "@/lib/api";

interface SearchSectionProps {
  onSearch: (searchData: SearchData) => void;
}

export interface SearchData {
  vehicleType: string;
  year: string;
  make: string;
  model: string;
  mileage: string;
  partSearch: string;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [vehicleType, setVehicleType] = useState("");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [mileage, setMileage] = useState("");
  const [partSearch, setPartSearch] = useState("");
  
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState<{makes: boolean, models: boolean}>({makes: false, models: false});
  
  const years = getYearRange();
  
  useEffect(() => {
    if (vehicleType && year) {
      setLoading(prev => ({...prev, makes: true}));
      getMakes(vehicleType, year)
        .then(makesData => {
          setMakes(makesData);
          setMake("");
          setModel("");
        })
        .catch(error => {
          console.error("Error fetching makes:", error);
          setMakes([]);
        })
        .finally(() => {
          setLoading(prev => ({...prev, makes: false}));
        });
    } else {
      setMakes([]);
      setMake("");
      setModel("");
    }
  }, [vehicleType, year]);
  
  useEffect(() => {
    if (vehicleType && year && make) {
      setLoading(prev => ({...prev, models: true}));
      getModels(vehicleType, year, make)
        .then(modelsData => {
          setModels(modelsData);
          setModel("");
        })
        .catch(error => {
          console.error("Error fetching models:", error);
          setModels([]);
        })
        .finally(() => {
          setLoading(prev => ({...prev, models: false}));
        });
    } else {
      setModels([]);
      setModel("");
    }
  }, [vehicleType, year, make]);
  
  const handleSearch = () => {
    onSearch({
      vehicleType,
      year,
      make,
      model,
      mileage,
      partSearch
    });
  };
  
  return (
    <section id="searchSection" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-montserrat text-center mb-12">Find Your Parts</h2>
        
        <div className="max-w-4xl mx-auto bg-light-gray p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((yearValue) => (
                    <SelectItem key={yearValue} value={yearValue.toString()}>
                      {yearValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Make */}
            <div className="space-y-2">
              <Label htmlFor="vehicleMake">Make</Label>
              <Select 
                value={make} 
                onValueChange={setMake} 
                disabled={!vehicleType || !year || loading.makes}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading.makes ? "Loading makes..." : "Select Make"} />
                </SelectTrigger>
                <SelectContent>
                  {makes.map((makeName) => (
                    <SelectItem key={makeName} value={makeName}>
                      {makeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Model */}
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Model</Label>
              <Select 
                value={model} 
                onValueChange={setModel}
                disabled={!vehicleType || !year || !make || loading.models}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading.models ? "Loading models..." : "Select Model"} />
                </SelectTrigger>
                <SelectContent>
                  {models.map((modelName) => (
                    <SelectItem key={modelName} value={modelName}>
                      {modelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Mileage */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="mileage">Mileage/Hours</Label>
              <Input
                id="mileage"
                type="text" 
                placeholder="Enter mileage or hours"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
          </div>
          
          {/* Search Input */}
          <div className="mb-6 space-y-2">
            <Label htmlFor="partSearch">Search for Parts or Products</Label>
            <div className="relative">
              <Input
                id="partSearch"
                type="text"
                placeholder="Enter part name (e.g., brake pads, oil filter)"
                value={partSearch}
                onChange={(e) => setPartSearch(e.target.value)}
                className="pl-10"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </div>
          
          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            className="w-full bg-primary text-secondary hover:bg-primary/90 font-bold"
          >
            <span>Search</span>
            <i className="fas fa-search ml-2"></i>
          </Button>
        </div>
      </div>
    </section>
  );
}
