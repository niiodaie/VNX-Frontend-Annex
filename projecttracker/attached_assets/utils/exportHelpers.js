export function exportToMarkdown(project) {
  let md = `# ${project.title}\n\nStatus: ${project.status}\n\n`;
  project.milestones.forEach(m => {
    md += `## Milestone: ${m.title}\n`;
    m.tasks.forEach(t => {
      md += `- [ ] ${t}\n`;
    });
    md += '\n';
  });
  return md;
}
