import { Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/layout/UserAvatar";

export function HomeHeaderActions() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative hidden sm:block">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search projects..." 
          className="pl-9 w-64 bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-primary/50"
        />
      </div>
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
        <Settings className="w-5 h-5" />
      </Button>
      <UserAvatar />
    </div>
  );
}
