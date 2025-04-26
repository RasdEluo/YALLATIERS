import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  onClick?: () => void;
}

export function Logo({ className, size = 'md', withText = false, onClick }: LogoProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };
  
  return (
    <div className={cn("flex items-center", className)} onClick={onClick}>
      <div className={cn(
        "flex items-center justify-center font-bold bg-primary text-secondary rounded-lg shadow-md", 
        sizes[size]
      )}>
        <span>YT</span>
      </div>
      
      {withText && (
        <span className="ml-2 text-primary font-montserrat font-bold text-2xl">
          Yalla Tiers
        </span>
      )}
    </div>
  );
}

export function LogoLarge({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="h-[200px] w-[200px] bg-primary text-secondary rounded-lg shadow-lg flex items-center justify-center mb-4">
        <span className="text-7xl font-bold font-montserrat">YT</span>
      </div>
    </div>
  );
}
