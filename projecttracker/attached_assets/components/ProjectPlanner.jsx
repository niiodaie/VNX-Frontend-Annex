import React, { useContext, useState } from 'react';
import { ProAccessContext } from '../context/ProAccessContext';
import TaskItem from './TaskItem';
import MilestoneBlock from './MilestoneBlock';
import TimelineView from './TimelineView';
import ExportMenu from './ExportMenu';

export default function ProjectPlanner() {
  const { isPro } = useContext(ProAccessContext);
  const [project, setProject] = useState({
    title: '',
    status: 'Not Started',
    tags: [],
    milestones: [],
  });

  if (!isPro) return <p>This feature is available in the Pro tier.</p>;

  return (
    <div className="p-4 space-y-4">
      <input 
        type="text" 
        placeholder="Project Title" 
        value={project.title}
        onChange={(e) => setProject({ ...project, title: e.target.value })}
        className="text-xl font-bold border-b w-full"
      />
      <MilestoneBlock project={project} setProject={setProject} />
      <TimelineView milestones={project.milestones} />
      <ExportMenu project={project} />
    </div>
  );
}
