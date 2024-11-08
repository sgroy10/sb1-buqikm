import { useState } from 'react';
import { useProject } from '../hooks/useProject';
import { toPng } from 'html-to-image';

interface ReportGeneratorProps {
  projectId: string;
}

export function ReportGenerator({ projectId }: ReportGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { projects } = useProject();

  const generateReport = async () => {
    setGenerating(true);
    setError(null);

    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');

      // Create report container
      const reportContainer = document.createElement('div');
      reportContainer.className = 'bg-white p-8';
      reportContainer.innerHTML = `
        <h1 class="text-2xl font-bold mb-6">${project.name} - Design Review Report</h1>
        <div class="space-y-6">
          ${project.fileSets.map(fileSet => `
            <div class="border rounded-lg p-4">
              <h2 class="text-lg font-semibold mb-4">Design Set</h2>
              <div class="grid grid-cols-2 gap-4">
                <img src="${fileSet.designImageUrl}" alt="Design" class="w-full" />
                <img src="${fileSet.renderUrl || ''}" alt="Render" class="w-full" />
              </div>
              <div class="mt-4">
                <h3 class="font-medium">Status: ${fileSet.status}</h3>
                <div class="mt-2">
                  <h4 class="font-medium">Comments:</h4>
                  ${fileSet.comments.map(comment => `
                    <div class="mt-1">
                      <span class="font-medium">${comment.userId}:</span>
                      ${comment.text}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Add to document temporarily
      document.body.appendChild(reportContainer);

      // Generate PNG
      const dataUrl = await toPng(reportContainer);

      // Create download link
      const link = document.createElement('a');
      link.download = `${project.name}-report.png`;
      link.href = dataUrl;
      link.click();

      // Cleanup
      document.body.removeChild(reportContainer);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Generate Report</h3>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={generateReport}
        disabled={generating}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {generating ? 'Generating Report...' : 'Generate Report'}
      </button>
    </div>
  );
}