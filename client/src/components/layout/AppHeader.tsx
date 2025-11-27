import { type ReactNode } from "react";
import { Link } from "wouter";
import { Code, Code2 } from "lucide-react";

interface AppHeaderProps {
  variant?: "home" | "editor";
  children?: ReactNode;
}

export function AppHeader({ variant = "home", children }: AppHeaderProps) {
  const Icon = variant === "home" ? Code : Code2;
  
  return (
    <header className="h-16 border-b border-border glass flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/">
          <div className="flex items-center gap-2 text-primary font-bold font-display text-xl hover:opacity-80 cursor-pointer transition-opacity">
            <Icon className="w-6 h-6" />
            <span>CodeSync</span>
          </div>
        </Link>
        {variant === "home" && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
            <a href="#" className="hover:text-primary transition-colors">Teams</a>
            <a href="#" className="hover:text-primary transition-colors">Activity</a>
          </nav>
        )}
      </div>
      {children}
    </header>
  );
}
