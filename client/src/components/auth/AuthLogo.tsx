import { Terminal } from "lucide-react";

export function AuthLogo() {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md px-6 py-3 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        <Terminal className="w-6 h-6 text-primary animate-pulse" />
        <span className="text-2xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          CodeSync
        </span>
      </div>
    </div>
  );
}
