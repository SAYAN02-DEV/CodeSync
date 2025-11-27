import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { ProjectCard, type Project } from "./ProjectCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface ProjectGridProps {
  projects: Project[];
  onCreateClick: () => void;
}

export function ProjectGrid({ projects, onCreateClick }: ProjectGridProps) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} variants={item} />
      ))}
      
      {/* Create New Placeholder */}
      <motion.div variants={item}>
        <button 
          onClick={onCreateClick}
          className="w-full h-full min-h-[200px] rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">Create New Project</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
