import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Clock, Network, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useEditorStore } from '@/store/editor-store';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
export default function DashboardPage() {
  const projects = useEditorStore(useShallow(s => s.projects));
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
    if (confirm('Permanently delete this project?')) {
      await deleteProject(id);
      toast.success('Project removed');
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-16">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Canvas Console</h1>
            <p className="text-muted-foreground mt-2 text-lg">Manage your connectivity transformation roadmaps.</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-[#F38020] hover:bg-[#D14615] text-white gap-2 px-8 h-12 rounded-md shadow-lg"
          >
            <Plus className="w-5 h-5" /> New Visualization
          </Button>
        </header>
        {projects.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center bg-secondary/20 rounded-xl border-2 border-dashed border-border">
            <Network className="w-16 h-16 text-muted-foreground/20 mb-6" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-foreground">No Projects Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm text-center">Your architecture visualizations will appear here once you create them.</p>
            <Button variant="default" onClick={handleCreateNew} className="rounded-md bg-foreground text-background">
              Build Your First Canvas
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/editor?id=${project.id}`}
                className="block group"
              >
                <Card className="h-full border border-border hover:border-[#F38020] transition-all hover:shadow-xl rounded-xl overflow-hidden flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#F38020] group-hover:bg-[#F38020] group-hover:text-white transition-colors">
                      <Network size={20} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full"
                      onClick={(e) => handleDelete(e, project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardTitle className="text-xl font-bold mb-2 group-hover:text-[#F38020] transition-colors">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Updated {formatDistanceToNow(project.metadata?.updatedAt || Date.now())} ago
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border bg-secondary/10 flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground">{project.nodes.length} Components</span>
                    <span className="text-[#F38020] flex items-center gap-1">
                      Open Editor <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}