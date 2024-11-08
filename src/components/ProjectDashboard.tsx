import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { NotificationCenter } from './NotificationCenter';

export function ProjectDashboard() {
  const { projects, loading } = useProject();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');

  const filteredProjects = projects
    .filter(project => filterStatus === 'all' || project.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
      return a.status.localeCompare(b.status);
    });

  const projectStats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    inReview: projects.filter(p => p.status === 'in_review').length,
    approved: projects.filter(p => p.status === 'approved').length,
    revision: projects.filter(p => p.status === 'revision').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">JewelryViz</Link>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <Link to="/viewer" className="text-gray-600 hover:text-gray-900">Viewer</Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Total Projects</div>
            <div className="text-2xl font-bold">{projectStats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{projectStats.pending}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">In Review</div>
            <div className="text-2xl font-bold text-blue-600">{projectStats.inReview}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Approved</div>
            <div className="text-2xl font-bold text-green-600">{projectStats.approved}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Needs Revision</div>
            <div className="text-2xl font-bold text-red-600">{projectStats.revision}</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="revision">Needs Revision</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'status')}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <Link
            to="/projects/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            New Project
          </Link>
        </div>

        {/* Project List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading projects...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Files
                  </th>
                  <th className="px-6 py-3 relative">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${project.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                        ${project.status === 'revision' ? 'bg-red-100 text-red-800' : ''}
                        ${project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${project.status === 'in_review' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {project.fileSets?.length || 0} files
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}