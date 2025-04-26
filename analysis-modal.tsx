import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface VehicleData {
  type: string;
  year: string;
  make: string;
  model: string;
  mileage: string;
}

interface PerformanceData {
  engineHealth: number;
  brakeSystem: number;
  suspension: number;
  electricalSystem: number;
}

interface MaintenanceItem {
  name: string;
  dueIn: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendedPart {
  name: string;
  price: string;
  description: string;
  importance: 'Highly Recommended' | 'Recommended' | 'Optional';
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalysisModal({ isOpen, onClose }: AnalysisModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    type: 'Car',
    year: '2019',
    make: 'Toyota',
    model: 'Camry',
    mileage: '45,000 miles'
  });
  
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    engineHealth: 85,
    brakeSystem: 72,
    suspension: 90,
    electricalSystem: 95
  });
  
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([
    { name: 'Oil Change', dueIn: 'Due in 500 miles or 2 weeks', priority: 'high' },
    { name: 'Tire Rotation', dueIn: 'Due in 2,000 miles or 1 month', priority: 'medium' },
    { name: 'Brake Inspection', dueIn: 'Due in 5,000 miles or 3 months', priority: 'low' }
  ]);
  
  const [recommendedParts, setRecommendedParts] = useState<RecommendedPart[]>([
    { 
      name: 'Synthetic Oil Filter', 
      price: '$12.99', 
      description: 'High-performance filter with extended life', 
      importance: 'Highly Recommended' 
    },
    { 
      name: 'Premium Wiper Blades', 
      price: '$24.95', 
      description: 'All-weather silicone blades for better visibility', 
      importance: 'Recommended' 
    }
  ]);
  
  const handlePrintAnalysis = () => {
    toast({
      title: "Print Requested",
      description: "The analysis report would print in a production environment.",
    });
  };
  
  useEffect(() => {
    // Load last vehicle data from localStorage if available
    const savedVehicleData = localStorage.getItem('yallaTiersVehicleData');
    if (savedVehicleData) {
      try {
        const parsedData = JSON.parse(savedVehicleData);
        setVehicleData(parsedData);
      } catch (error) {
        console.error("Failed to parse vehicle data from localStorage:", error);
      }
    }
  }, [isOpen]);
  
  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high':
        return <span className="text-red-500 mr-2"><i className="fas fa-exclamation-circle"></i></span>;
      case 'medium':
        return <span className="text-yellow-500 mr-2"><i className="fas fa-exclamation-triangle"></i></span>;
      default:
        return <span className="text-blue-500 mr-2"><i className="fas fa-info-circle"></i></span>;
    }
  };
  
  const getImportanceClass = (importance: string) => {
    switch(importance) {
      case 'Highly Recommended':
        return 'bg-green-100 text-green-800';
      case 'Recommended':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[85vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold font-montserrat">Vehicle Analysis</DialogTitle>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold font-montserrat mb-4">Your Vehicle</h4>
                
                <div className="bg-light-gray p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-medium" id="analysisType">{vehicleData.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Year</p>
                      <p className="font-medium" id="analysisYear">{vehicleData.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Make</p>
                      <p className="font-medium" id="analysisMake">{vehicleData.make}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Model</p>
                      <p className="font-medium" id="analysisModel">{vehicleData.model}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">Mileage</p>
                    <p className="font-medium" id="analysisMileage">{vehicleData.mileage}</p>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold font-montserrat mb-4">Performance Analysis</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Engine Health</span>
                      <span>{performanceData.engineHealth}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${performanceData.engineHealth}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Brake System</span>
                      <span>{performanceData.brakeSystem}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-500 h-2.5 rounded-full" 
                        style={{ width: `${performanceData.brakeSystem}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Suspension</span>
                      <span>{performanceData.suspension}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${performanceData.suspension}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Electrical System</span>
                      <span>{performanceData.electricalSystem}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${performanceData.electricalSystem}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-bold font-montserrat mb-4">Maintenance Schedule</h4>
                
                <div className="bg-light-gray p-4 rounded-lg mb-6">
                  <h5 className="font-bold mb-2">Upcoming Maintenance</h5>
                  <ul className="space-y-3">
                    {maintenanceItems.map((item, index) => (
                      <li key={index} className="flex items-start">
                        {getPriorityIcon(item.priority)}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.dueIn}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <h4 className="text-xl font-bold font-montserrat mb-4">Recommended Parts</h4>
                <div className="space-y-4">
                  {recommendedParts.map((part, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold">{part.name}</h5>
                        <span className="text-primary font-bold">{part.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{part.description}</p>
                      <div className="flex justify-between">
                        <span className={`text-xs ${getImportanceClass(part.importance)} py-1 px-2 rounded`}>
                          {part.importance}
                        </span>
                        <a href="#" className="text-primary text-sm hover:underline">View Details</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <Button 
              onClick={handlePrintAnalysis}
              className="bg-primary text-secondary hover:bg-primary/90"
            >
              <i className="fas fa-print mr-2"></i> Print Analysis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
