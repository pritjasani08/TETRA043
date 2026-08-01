import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Sprout } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppState } from "@/lib/app-state";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AgriShield AI Crop Guard" },
      {
        name: "description",
        content:
          "Log in or register your farm to start AI animal intrusion monitoring with AgriShield AI.",
      },
      { property: "og:title", content: "Sign in — AgriShield AI Crop Guard" },
      {
        property: "og:description",
        content: "Farmer login for AI-powered animal intrusion detection and deterrent alerts.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { ready } = useAppState();
  const { login, signup: signupAuth, isAuthed, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && isAuthed) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [ready, isAuthed, navigate]);

  const [signup, setSignup] = useState({
    fullName: "",
    mobile: "",
    email: "",
    village: "",
    district: "",
    state: "Gujarat",
    farmSize: "",
    cropType: "",
    password: "",
  });

  const [email, setEmail] = useState("ramesh@agrishield.in");
  const [password, setPassword] = useState("demo1234");
  const [pending, setPending] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 lg:flex">
        <div className="grid-lines absolute inset-0 opacity-60" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/20 to-transparent scan-line" />
        <div className="relative">
          <span className="inline-flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <ShieldCheck className="size-6" />
            </span>
            <span className="font-display text-lg font-bold">AgriShield AI</span>
          </span>
        </div>
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Your fields, <span className="text-gradient">watched all night.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Camera-based AI spots wild boar, nilgai, monkeys and stray cattle at the fence line,
            fires the right deterrent, and warns every neighbouring farm in seconds.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              ["97%", "Detection accuracy"],
              ["<3s", "Alert latency"],
              ["3", "Voice languages"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-sidebar-border bg-background/40 p-3">
                <p className="font-display text-xl font-bold text-primary">{v}</p>
                <p className="text-[11px] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-muted-foreground">
          Village Safety Network · Gujarat pilot · Simulated AI demo build
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <ShieldCheck className="size-5 text-primary" />
            <span className="font-display text-lg font-bold">AgriShield AI</span>
          </div>
          <h1 className="font-display text-2xl font-bold">Farmer access</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log in with your mobile number or register your farm.
          </p>

          <Tabs defaultValue="login" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Signup</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-5">
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPending(true);
                  try {
                    await login({ email, password });
                    toast.success("Welcome back", { description: "Monitoring console unlocked." });
                    navigate({ to: "/dashboard" });
                  } catch (err: any) {
                    toast.error("Login failed", { description: err.message || "Invalid credentials." });
                  } finally {
                    setPending(false);
                  }
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email</Label>
                  <Input 
                    id="identifier" 
                    placeholder="ramesh@agrishield.in" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={pending}>
                  {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Enter monitoring console
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Use your registered backend credentials.
                </p>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-5">
              <form
                className="space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPending(true);
                  try {
                    // Extract firstName and lastName from fullName for the backend DTO
                    const names = signup.fullName.split(" ");
                    const firstName = names[0] || "Farmer";
                    const lastName = names.length > 1 ? names.slice(1).join(" ") : "Unknown";
                    
                    await signupAuth({
                      email: signup.email,
                      password: signup.password,
                      firstName,
                      lastName,
                    });
                    toast.success("Account created", { description: "Monitoring console unlocked." });
                    navigate({ to: "/dashboard" });
                  } catch (err: any) {
                    toast.error("Signup failed", { description: err.message || "Could not create account." });
                  } finally {
                    setPending(false);
                  }
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["fullName", "Full name", "Rameshbhai Patel"],
                      ["mobile", "Mobile number", "98250 41122"],
                      ["email", "Email", "ramesh@farm.in"],
                      ["village", "Village", "Shivgadh"],
                      ["district", "District", "Ahmedabad"],
                      ["state", "State", "Gujarat"],
                      ["farmName", "Farm name", "Green Fields"],
                      ["farmSize", "Farm size", "12 acres"],
                      ["cropType", "Crop type", "Cotton"],
                    ] as const
                  ).map(([key, label, ph]) => (
                    <div key={key} className="space-y-1.5">
                      <Label htmlFor={key} className="text-xs">
                        {label}
                      </Label>
                      <Input
                        id={key}
                        placeholder={ph}
                        value={signup[key]}
                        onChange={(e) => setSignup((s) => ({ ...s, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="signup-password" className="text-xs">
                      Password
                    </Label>
                    <Input id="signup-password" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Sprout className="size-4" />
                  Create farm account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
