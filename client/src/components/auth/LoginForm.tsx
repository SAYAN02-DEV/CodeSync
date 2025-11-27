import { type FormEvent } from "react";
import { Code2, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

interface LoginFormProps {
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  return (
    <>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              placeholder="dev@codesync.io" 
              className="bg-background/50 border-primary/20 focus-visible:ring-primary/50" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              className="bg-background/50 border-primary/20 focus-visible:ring-primary/50" 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all hover:scale-[1.02]" 
            disabled={isLoading}
          >
            {isLoading ? <Cpu className="w-4 h-4 animate-spin mr-2" /> : <Code2 className="w-4 h-4 mr-2" />}
            {isLoading ? "Authenticating..." : "Initialize Session"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground">System v2.4.0 // Secure Connection</p>
      </CardFooter>
    </>
  );
}
