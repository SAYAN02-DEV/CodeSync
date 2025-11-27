import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";

export function RegisterForm() {
  return (
    <CardContent>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            placeholder="neo_dev" 
            className="bg-background/50 border-primary/20" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-email">Email</Label>
          <Input 
            id="reg-email" 
            type="email" 
            placeholder="dev@codesync.io" 
            className="bg-background/50 border-primary/20" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-password">Password</Label>
          <Input 
            id="reg-password" 
            type="password" 
            className="bg-background/50 border-primary/20" 
          />
        </div>
        <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
          Create Account
        </Button>
      </form>
    </CardContent>
  );
}
