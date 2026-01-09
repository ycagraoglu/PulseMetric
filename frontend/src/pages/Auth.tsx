'use client';

import { Eye, EyeOff, Github, Mail, Lock, User, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CobeGlobe } from "@/components/globe/CobeGlobe";
import { Sparkles } from "@/components/effects/Sparkles";
import { cn } from "@/lib/utils";
import { useLoginForm, useSignupForm } from "@/hooks/useAuth";

// ============================================
// Constants
// ============================================

const GLOBE_MARKERS = [
  // North America
  { location: [40.7128, -74.006] as [number, number], size: 0.08 },
  { location: [37.7749, -122.4194] as [number, number], size: 0.06 },
  { location: [34.0522, -118.2437] as [number, number], size: 0.05 },
  { location: [41.8781, -87.6298] as [number, number], size: 0.05 },
  { location: [25.7617, -80.1918] as [number, number], size: 0.04 },
  { location: [49.2827, -123.1207] as [number, number], size: 0.04 },
  { location: [19.4326, -99.1332] as [number, number], size: 0.05 },
  // Europe
  { location: [51.5074, -0.1278] as [number, number], size: 0.07 },
  { location: [48.8566, 2.3522] as [number, number], size: 0.06 },
  { location: [52.52, 13.405] as [number, number], size: 0.05 },
  { location: [41.9028, 12.4964] as [number, number], size: 0.04 },
  { location: [40.4168, -3.7038] as [number, number], size: 0.05 },
  { location: [59.3293, 18.0686] as [number, number], size: 0.04 },
  { location: [52.3676, 4.9041] as [number, number], size: 0.04 },
  // Asia
  { location: [35.6762, 139.6503] as [number, number], size: 0.08 },
  { location: [31.2304, 121.4737] as [number, number], size: 0.07 },
  { location: [22.3193, 114.1694] as [number, number], size: 0.06 },
  { location: [1.3521, 103.8198] as [number, number], size: 0.06 },
  { location: [37.5665, 126.978] as [number, number], size: 0.05 },
  { location: [28.6139, 77.209] as [number, number], size: 0.06 },
  { location: [19.076, 72.8777] as [number, number], size: 0.05 },
  { location: [13.7563, 100.5018] as [number, number], size: 0.04 },
  { location: [39.9042, 116.4074] as [number, number], size: 0.06 },
  // South America
  { location: [-23.5505, -46.6333] as [number, number], size: 0.07 },
  { location: [-34.6037, -58.3816] as [number, number], size: 0.05 },
  { location: [-22.9068, -43.1729] as [number, number], size: 0.05 },
  { location: [-33.4489, -70.6693] as [number, number], size: 0.04 },
  { location: [4.711, -74.0721] as [number, number], size: 0.04 },
  // Africa
  { location: [-33.9249, 18.4241] as [number, number], size: 0.05 },
  { location: [30.0444, 31.2357] as [number, number], size: 0.05 },
  { location: [-1.2921, 36.8219] as [number, number], size: 0.04 },
  { location: [6.5244, 3.3792] as [number, number], size: 0.05 },
  { location: [33.5731, -7.5898] as [number, number], size: 0.04 },
  // Oceania
  { location: [-33.8688, 151.2093] as [number, number], size: 0.06 },
  { location: [-37.8136, 144.9631] as [number, number], size: 0.05 },
  { location: [-36.8485, 174.7633] as [number, number], size: 0.04 },
  // Russia & Central Asia
  { location: [55.7558, 37.6173] as [number, number], size: 0.06 },
  { location: [25.2048, 55.2708] as [number, number], size: 0.05 },
  { location: [41.2995, 69.2401] as [number, number], size: 0.04 },
];

// ============================================
// Sub-Components
// ============================================

const ConnectionLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <svg className="w-full h-full opacity-20" viewBox="0 0 400 400">
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
      <path d="M50,200 Q200,50 350,180" fill="none" stroke="url(#lineGradient1)" strokeWidth="1.5" className="animate-pulse" style={{ animationDuration: '3s' }} />
      <path d="M80,280 Q200,150 320,250" fill="none" stroke="url(#lineGradient2)" strokeWidth="1" className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <path d="M100,120 Q250,200 350,100" fill="none" stroke="url(#lineGradient1)" strokeWidth="1" className="animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      <circle cx="50" cy="200" r="3" fill="hsl(var(--primary))" className="animate-ping" style={{ animationDuration: '2s' }} />
      <circle cx="350" cy="180" r="3" fill="hsl(142 76% 36%)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
      <circle cx="80" cy="280" r="2" fill="hsl(var(--primary))" className="animate-ping" style={{ animationDuration: '3s' }} />
      <circle cx="320" cy="250" r="2" fill="hsl(142 76% 36%)" className="animate-ping" style={{ animationDuration: '2s' }} />
    </svg>
  </div>
);

const LoadingSpinner = () => (
  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
);

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  labelExtra?: React.ReactNode;
}

const FormField = ({
  id,
  label,
  type,
  placeholder,
  value,
  error,
  icon,
  onChange,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  labelExtra,
}: FormFieldProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">{label}</Label>
      {labelExtra}
    </div>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">{icon}</div>
      <Input
        id={id}
        type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "pl-10 bg-secondary/50 border-border/50 focus:border-primary",
          showPasswordToggle && "pr-10",
          error && "border-destructive"
        )}
      />
      {showPasswordToggle && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

const Divider = () => (
  <div className="relative my-4">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border/30" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
    </div>
  </div>
);

const LoginForm = () => {
  const {
    form,
    errors,
    isLoading,
    showPassword,
    updateField,
    togglePassword,
    handleSubmit,
    handleGithubLogin,
    handleForgotPassword,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="login-email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={form.email}
        error={errors.email}
        icon={<Mail className="w-4 h-4" />}
        onChange={(v) => updateField("email", v)}
      />
      <FormField
        id="login-password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={form.password}
        error={errors.password}
        icon={<Lock className="w-4 h-4" />}
        onChange={(v) => updateField("password", v)}
        showPasswordToggle
        showPassword={showPassword}
        onTogglePassword={togglePassword}
        labelExtra={
          <button type="button" className="text-xs text-primary hover:underline" onClick={handleForgotPassword}>
            Forgot password?
          </button>
        }
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <><LoadingSpinner /> Signing in...</> : "Sign in"}
      </Button>
      <Divider />
      <Button type="button" variant="outline" className="w-full border-border/50" onClick={handleGithubLogin}>
        <Github className="w-4 h-4 mr-2" />
        GitHub
      </Button>
    </form>
  );
};

const SignupForm = () => {
  const {
    form,
    errors,
    isLoading,
    showPassword,
    updateField,
    togglePassword,
    handleSubmit,
  } = useSignupForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="signup-name"
        label="Name"
        type="text"
        placeholder="Enter your name"
        value={form.name}
        error={errors.name}
        icon={<User className="w-4 h-4" />}
        onChange={(v) => updateField("name", v)}
      />
      <FormField
        id="signup-email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={form.email}
        error={errors.email}
        icon={<Mail className="w-4 h-4" />}
        onChange={(v) => updateField("email", v)}
      />
      <FormField
        id="signup-password"
        label="Password"
        type="password"
        placeholder="Create a password"
        value={form.password}
        error={errors.password}
        icon={<Lock className="w-4 h-4" />}
        onChange={(v) => updateField("password", v)}
        showPasswordToggle
        showPassword={showPassword}
        onTogglePassword={togglePassword}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <><LoadingSpinner /> Creating account...</> : "Create account"}
      </Button>
    </form>
  );
};

const Branding = ({ mobile = false }: { mobile?: boolean }) => {
  if (mobile) {
    return (
      <div className="lg:hidden text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">PulseMetric</span>
        </div>
        <p className="text-sm text-muted-foreground">Analytics dashboard for your apps</p>
      </div>
    );
  }

  return (
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
  );
};

const GlobeSection = () => (
  <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
    <ConnectionLines />
    <div className="relative w-[500px] h-[500px]">
      <CobeGlobe markers={GLOBE_MARKERS} className="w-full h-full" />
      <div className="absolute inset-0 -z-10 rounded-full bg-primary/5 blur-3xl scale-110" />
    </div>
    <Branding />
  </div>
);

// ============================================
// Main Component
// ============================================

const Auth = () => (
  <div className="min-h-screen flex bg-background relative overflow-hidden">
    <Sparkles count={80} />
    <GlobeSection />
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Branding mobile />
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

export default Auth;
