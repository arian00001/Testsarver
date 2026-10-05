import crypto from "node:crypto";
import type { Project } from "./types.js";

const projects = new Map<string, Project>();

export const store = {
  createProject(name: string, prompt: string): Project {
    const now = new Date().toISOString();
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      prompt,
      status: "idle",
      plan: [],
      architecture: {},
      designSystem: {},
      events: [],
      createdAt: now,
      updatedAt: now
    };
    projects.set(project.id, project);
    return project;
  },

  getProject(id: string) {
    return projects.get(id);
  },

  updateProject(id: string, patch: Partial<Project>) {
    const current = projects.get(id);
    if (!current) throw new Error("Project not found");
    const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
    projects.set(id, next);
    return next;
  },

  addEvent(id: string, event: Record<string, unknown>) {
    const current = projects.get(id);
    if (!current) throw new Error("Project not found");
    current.events.push({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...event
    });
    current.updatedAt = new Date().toISOString();
    return current;
  }
};
