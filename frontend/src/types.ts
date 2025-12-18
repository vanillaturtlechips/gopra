import type { ReactNode } from 'react';

export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  linkUrl: string;
}

export interface ProblemSolving {
  id: string;
  summary: string;
  problem: string;
  cause: string;
  metric: string;
  solution: string;
  process: string;
  evaluation: string;
  remarks: string;
}

export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;        
  thumbnail?: string; 
  caption?: string;   
}

export type ProjectType = 'Team' | 'Side';

export interface Project {
  title: string;
  projectType: ProjectType;
  description: string;
  detailedDescription: string;
  architectureImage?: string; 
  tags: string[];
  icon: ReactNode;
  links: {
    github?: string;
    demo?: string;
    docs?: string;
  };
  problemSolving?: ProblemSolving[];
  gallery?: ProjectMedia[];
}