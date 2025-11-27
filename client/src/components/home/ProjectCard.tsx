import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, Folder, MoreHorizontal, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface Project {
  id: string;
  name: string;
  language: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: string;
  ipfsCID?: string;
  collaborators?: string[];
}

interface ProjectCardProps {
  project: Project;
  variants?: any;
}

export function ProjectCard({ project, variants }: ProjectCardProps) {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const collaboratorCount = (project.collaborators?.length || 0) + 1; // +1 for owner

  return (
    <motion.div variants={variants}>
      <Link href={`/editor?project=${project.id}`}>
        <Card className="group cursor-pointer border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-[0_5px_20px_-5px_rgba(6,182,212,0.15)]">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-md bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                <Folder className="w-5 h-5" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="text-lg font-display group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
              Live Session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground border-transparent">
                {project.language}
              </Badge>
              {project.ipfsCID && (
                <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                  <Database className="w-3 h-3 mr-1" />
                  IPFS
                </Badge>
              )}
              <span className="flex items-center gap-1 ml-auto text-xs">
                <Clock className="w-3 h-3" />
                {getTimeAgo(project.updatedAt)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex -space-x-2">
                {[...Array(Math.min(collaboratorCount, 5))].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {collaboratorCount > 5 && (
                  <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    +{collaboratorCount - 5}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                Open Project →
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
