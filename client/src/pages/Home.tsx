import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { HomeHeaderActions } from "@/components/home/HomeHeaderActions";
import { DashboardHeader } from "@/components/home/DashboardHeader";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { CreateProjectDialog } from "@/components/home/CreateProjectDialog";
import { JoinSessionDialog } from "@/components/home/JoinSessionDialog";
import { type Project } from "@/components/home/ProjectCard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      return data.projects as Project[];
    },
  });

  const projects = data || [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader variant="home">
        <HomeHeaderActions />
      </AppHeader>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <DashboardHeader 
          onNewProjectClick={() => setIsCreateDialogOpen(true)}
          onJoinSessionClick={() => setIsJoinDialogOpen(true)}
        />
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ProjectGrid 
            projects={projects} 
            onCreateClick={() => setIsCreateDialogOpen(true)}
          />
        )}
      </main>

      <CreateProjectDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      
      <JoinSessionDialog 
        open={isJoinDialogOpen}
        onOpenChange={setIsJoinDialogOpen}
      />
    </div>
  );
}
