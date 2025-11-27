import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onNewProjectClick: () => void;
  onJoinSessionClick: () => void;
}

export function DashboardHeader({ onNewProjectClick, onJoinSessionClick }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your collaborative sessions and projects.</p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={onJoinSessionClick}
          variant="outline" 
          className="border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
        >
          <Users className="w-4 h-4 mr-2" />
          Join Session
        </Button>
        <Button 
          onClick={onNewProjectClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
    </div>
  );
}
