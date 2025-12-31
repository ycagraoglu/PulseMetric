'use client';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Github, Mail, Lock, User, Activity } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CobeGlobe } from "@/components/globe/CobeGlobe";
import { Sparkles } from "@/components/effects/Sparkles";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Connection lines effect for the globe
function ConnectionLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full opacity-20" viewBox="0 0 400 400">
        {/* Animated connection arcs */}
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(142 76% 36%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Arc 1 */}
        <path
          d="M50,200 Q200,50 350,180"
          fill="none"
          stroke="url(#lineGradient1)"
          strokeWidth="1.5"
          className="animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        
        {/* Arc 2 */}
        <path
          d="M80,280 Q200,150 320,250"
          fill="none"
          stroke="url(#lineGradient2)"
          strokeWidth="1"
          className="animate-pulse"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        />
        
        {/* Arc 3 */}
        <path
          d="M100,120 Q250,200 350,100"
          fill="none"
          stroke="url(#lineGradient1)"
          strokeWidth="1"
          className="animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '2s' }}
        />

        {/* Glowing dots at connection points */}
        <circle cx="50" cy="200" r="3" fill="hsl(var(--primary))" className="animate-ping" style={{ animationDuration: '2s' }} />
        <circle cx="350" cy="180" r="3" fill="hsl(142 76% 36%)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
        <circle cx="80" cy="280" r="2" fill="hsl(var(--primary))" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="320" cy="250" r="2" fill="hsl(142 76% 36%)" className="animate-ping" style={{ animationDuration: '2s' }} />
      </svg>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Logged in successfully!");
    navigate("/");
    setIsLoading(false);
  };

  const handleGithubLogin = async () => {
    toast.info("GitHub login coming soon!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-sm font-medium text-foreground">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn("pl-10 bg-secondary/50 border-border/50 focus:border-primary", errors.email && "border-destructive")}
          />
        </div>
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => toast.info("Password reset coming soon!")}
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn("pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary", errors.password && "border-destructive")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Signing in...
          </div>
        ) : (
          "Sign in"
        )}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-border/50"
        onClick={handleGithubLogin}
      >
        <Github className="w-4 h-4 mr-2" />
        GitHub
      </Button>
    </form>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!name) {
      newErrors.name = "Name is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Account created successfully!");
    navigate("/");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name" className="text-sm font-medium text-foreground">
          Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="signup-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn("pl-10 bg-secondary/50 border-border/50 focus:border-primary", errors.name && "border-destructive")}
          />
        </div>
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn("pl-10 bg-secondary/50 border-border/50 focus:border-primary", errors.email && "border-destructive")}
          />
        </div>
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn("pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary", errors.password && "border-destructive")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Creating account...
          </div>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}

// Globe markers for visual effect - spread across all continents
const globeMarkers = [
  // North America
  { location: [40.7128, -74.006] as [number, number], size: 0.08 }, // New York
  { location: [37.7749, -122.4194] as [number, number], size: 0.06 }, // San Francisco
  { location: [34.0522, -118.2437] as [number, number], size: 0.05 }, // Los Angeles
  { location: [41.8781, -87.6298] as [number, number], size: 0.05 }, // Chicago
  { location: [25.7617, -80.1918] as [number, number], size: 0.04 }, // Miami
  { location: [49.2827, -123.1207] as [number, number], size: 0.04 }, // Vancouver
  { location: [19.4326, -99.1332] as [number, number], size: 0.05 }, // Mexico City
  
  // Europe
  { location: [51.5074, -0.1278] as [number, number], size: 0.07 }, // London
  { location: [48.8566, 2.3522] as [number, number], size: 0.06 }, // Paris
  { location: [52.52, 13.405] as [number, number], size: 0.05 }, // Berlin
  { location: [41.9028, 12.4964] as [number, number], size: 0.04 }, // Rome
  { location: [40.4168, -3.7038] as [number, number], size: 0.05 }, // Madrid
  { location: [59.3293, 18.0686] as [number, number], size: 0.04 }, // Stockholm
  { location: [52.3676, 4.9041] as [number, number], size: 0.04 }, // Amsterdam
  
  // Asia
  { location: [35.6762, 139.6503] as [number, number], size: 0.08 }, // Tokyo
  { location: [31.2304, 121.4737] as [number, number], size: 0.07 }, // Shanghai
  { location: [22.3193, 114.1694] as [number, number], size: 0.06 }, // Hong Kong
  { location: [1.3521, 103.8198] as [number, number], size: 0.06 }, // Singapore
  { location: [37.5665, 126.978] as [number, number], size: 0.05 }, // Seoul
  { location: [28.6139, 77.209] as [number, number], size: 0.06 }, // New Delhi
  { location: [19.076, 72.8777] as [number, number], size: 0.05 }, // Mumbai
  { location: [13.7563, 100.5018] as [number, number], size: 0.04 }, // Bangkok
  { location: [39.9042, 116.4074] as [number, number], size: 0.06 }, // Beijing
  
  // South America
  { location: [-23.5505, -46.6333] as [number, number], size: 0.07 }, // São Paulo
  { location: [-34.6037, -58.3816] as [number, number], size: 0.05 }, // Buenos Aires
  { location: [-22.9068, -43.1729] as [number, number], size: 0.05 }, // Rio de Janeiro
  { location: [-33.4489, -70.6693] as [number, number], size: 0.04 }, // Santiago
  { location: [4.711, -74.0721] as [number, number], size: 0.04 }, // Bogotá
  
  // Africa
  { location: [-33.9249, 18.4241] as [number, number], size: 0.05 }, // Cape Town
  { location: [30.0444, 31.2357] as [number, number], size: 0.05 }, // Cairo
  { location: [-1.2921, 36.8219] as [number, number], size: 0.04 }, // Nairobi
  { location: [6.5244, 3.3792] as [number, number], size: 0.05 }, // Lagos
  { location: [33.5731, -7.5898] as [number, number], size: 0.04 }, // Casablanca
  
  // Oceania
  { location: [-33.8688, 151.2093] as [number, number], size: 0.06 }, // Sydney
  { location: [-37.8136, 144.9631] as [number, number], size: 0.05 }, // Melbourne
  { location: [-36.8485, 174.7633] as [number, number], size: 0.04 }, // Auckland
  
  // Russia & Central Asia
  { location: [55.7558, 37.6173] as [number, number], size: 0.06 }, // Moscow
  { location: [25.2048, 55.2708] as [number, number], size: 0.05 }, // Dubai
  { location: [41.2995, 69.2401] as [number, number], size: 0.04 }, // Tashkent
];

const Auth = () => {
  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Sparkles background effect */}
      <Sparkles count={80} />
      
      {/* Left side - Globe */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        
        {/* Connection lines effect */}
        <ConnectionLines />
        
        {/* Globe container */}
        <div className="relative w-[500px] h-[500px]">
          <CobeGlobe 
            markers={globeMarkers} 
            className="w-full h-full"
          />
          
          {/* Glow effect behind globe */}
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/5 blur-3xl scale-110" />
        </div>
        
        {/* Branding on globe side */}
        <div className="absolute bottom-12 left-12 text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">PulseMetric</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            Real-time analytics for modern applications. Track, analyze, and optimize your user experience.
          </p>
        </div>
      </div>
      
      
      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo - only visible on small screens */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">PulseMetric</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Analytics dashboard for your apps
            </p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
