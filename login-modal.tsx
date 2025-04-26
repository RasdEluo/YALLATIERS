import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onShowRegister }: LoginModalProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md overflow-hidden">
        <div className="flex">
          {/* Left side with image */}
          <div className="hidden md:block w-1/3 bg-primary">
            <div className="h-full flex items-center justify-center p-6">
              <Logo size="lg" />
            </div>
          </div>
          
          {/* Right side with login form */}
          <div className="w-full md:w-2/3">
            <DialogHeader className="p-6 pb-2">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold font-montserrat">Login</DialogTitle>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </DialogHeader>
            
            <div className="p-6 pt-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your password" 
                            type="password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-secondary hover:bg-primary/90 font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Loading...' : 'Login'}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button 
                    onClick={onShowRegister}
                    className="text-primary font-medium hover:underline"
                  >
                    Register
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
