"use client";

import type { PortfolioData } from "@/lib/types/portfolio";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

type ProfileEditorProps = {
  data: PortfolioData;
  onChange: (data: Partial<PortfolioData>) => void;
  onClose: () => void;
};

export function ProfileEditor({ data, onChange, onClose }: ProfileEditorProps) {
  const updateProject = (
    index: number,
    field: string,
    value: string
  ) => {
    const projects = [...data.projects];
    if (field === "tech") {
      projects[index] = {
        ...projects[index],
        tech: value.split(",").map((t) => t.trim()).filter(Boolean),
      };
    } else {
      projects[index] = { ...projects[index], [field]: value };
    }
    onChange({ projects });
  };

  const addProject = () => {
    onChange({
      projects: [
        ...data.projects,
        { title: "", description: "", tech: [] },
      ],
    });
  };

  const removeProject = (index: number) => {
    onChange({ projects: data.projects.filter((_, i) => i !== index) });
  };

  return (
    <div className="surface space-y-4 p-4 text-sm sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Edit profile</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Name</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Title</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Bio</label>
        <Textarea
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted-foreground">
          Skills (comma-separated)
        </label>
        <input
          className="w-full rounded-md border bg-background px-3 py-2"
          value={data.skills.join(", ")}
          onChange={(e) =>
            onChange({
              skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Projects</label>
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="mr-1 h-3 w-3" />
            Add
          </Button>
        </div>
        {data.projects.map((project, i) => (
          <div key={i} className="surface space-y-2 p-3">
            <div className="flex justify-between">
              <input
                className="flex-1 rounded-md border bg-background px-2 py-1 font-medium"
                placeholder="Project title"
                value={project.title}
                onChange={(e) => updateProject(i, "title", e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeProject(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Textarea
              placeholder="Description"
              value={project.description}
              onChange={(e) => updateProject(i, "description", e.target.value)}
              rows={2}
            />
            <input
              className="w-full rounded-md border bg-background px-2 py-1 text-xs"
              placeholder="Tech stack (comma-separated)"
              value={project.tech.join(", ")}
              onChange={(e) => updateProject(i, "tech", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
