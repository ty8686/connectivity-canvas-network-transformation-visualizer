import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Clock, Network, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/editor-store';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
export default function DashboardPage() {
  const projects = useEditorStore(s => s.projects);
  const fetchProjects = useEditorStore(s => s.fetchProjects);
  const deleteProject = useEditorStore(s => s.deleteProject);
  const createNewProject = useEditorStore(s => s.createNewProject);
  const navigate = useNavigate();
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  const handleCreateNew = () => {
    createNewProject();
    navigate('/editor');
  };
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      toast.success('Project deleted');
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-illustrative text-foreground">My Canvases</h1>
            <p className="text-muted-foreground mt-1">Manage and transform your network architectures.</p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="bg-[#F48120] hover:bg-[#D14615] text-white gap-2 sketchy-border border-none px-6 h-12"
          >
            <Plus className="w-5 h-5" /> New Visualization
          </Button>
        </header>
        {projects.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center sketchy-card bg-gray-50/50 border-dashed">
            <Network className="w-16 h-16 text-muted-foreground/30 mb-4" strokeWidth={1} />
            <h2 className="text-xl font-medium text-muted-foreground">No projects found</h2>
            <p className="text-sm text-muted-foreground mb-6">Start by creating your first network diagram.</p>
            <Button variant="outline" onClick={handleCreateNew} className="sketchy-border">
              Create First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                to={`/editor?id=${project.id}`}
                className="group relative sketchy-card p-6 bg-white hover:border-[#F48120] transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <Network className="w-6 h-6 text-[#F48120]" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    onClick={(e) => handleDelete(e, project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-illustrative mb-2 group-hover:text-[#F48120] transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    Updated {formatDistanceToNow(project.metadata?.updatedAt || Date.now())} ago
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 mt-2">
                    <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                      {project.nodes.length} Components
                    </span>
                    <span className="text-2xs font-bold uppercase tracking-wider text-[#F48120] flex items-center gap-1">
                      Open Editor <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}