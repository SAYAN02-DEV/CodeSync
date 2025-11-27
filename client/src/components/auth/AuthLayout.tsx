import { type ReactNode } from "react";
import bgImage from "@assets/generated_images/dark_abstract_cyberpunk_digital_grid_background_with_neon_accents.svg";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10" />
        <img 
          src={bgImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-purple-500/10 to-transparent z-10 pointer-events-none" />

      <div className="z-20 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
