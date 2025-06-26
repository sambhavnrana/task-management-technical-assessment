import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import type { Task } from '../types/task';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const sortOptions = [
  { value: 'created_at', label: 'Date' },
  { value: 'priority', label: 'Priority' },
];

const taskStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const taskPriorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const Dashboard: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
  });
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  const fetchTasks = () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    axios.get<Task[]>('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setTasks(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load tasks'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [token]);

  const filteredTasks = tasks
    .filter(task => (statusFilter ? task.status === statusFilter : true))
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditTaskId(null);
    setForm({ title: '', description: '', status: 'pending', priority: 'medium' });
    setModalError(null);
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditTaskId(task.id);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
    setModalError(null);
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      setModalError('Title is required');
      return;
    }
    setModalLoading(true);
    setModalError(null);
    try {
      if (editTaskId) {
        await axios.put(`/api/tasks/${editTaskId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/tasks', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      setForm({ title: '', description: '', status: 'pending', priority: 'medium' });
      setEditTaskId(null);
      fetchTasks();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-2 sm:p-4 relative">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700 mb-1">Dashboard</h1>
            <p className="text-gray-500">Welcome, <span className="font-semibold text-blue-600">{user?.name}</span>!</p>
          </div>
          <button
            className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 shadow"
            onClick={logout}
          >
            Logout
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 px-2">
          <select
            className="border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className="border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="text-center py-10 text-blue-600 font-semibold animate-pulse">Loading tasks...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No tasks found.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filteredTasks.map(task => (
              <div key={task.id} className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-2 border-t-8 border-blue-200 hover:shadow-xl transition relative">
                <button
                  className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 bg-blue-50 rounded-full p-1 shadow-sm"
                  onClick={() => openEditModal(task)}
                  aria-label="Edit Task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.789l-4 1 1-4 14.362-14.302ZM19 7l-2-2" />
                  </svg>
                </button>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-lg text-blue-800 truncate" title={task.title}>{task.title}</span>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{task.status}</span>
                </div>
                <div className="text-sm text-gray-500 line-clamp-2">{task.description}</div>
                <div className="flex justify-between text-xs mt-2">
                  <span className={`font-semibold ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>{task.priority}</span>
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Floating Action Button for Add Task */}
      <button
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition flex items-center gap-2 z-50"
        aria-label="Add Task"
        onClick={openCreateModal}
      >
        <div className="h-6 w-6">+</div>
        <span className="hidden sm:inline font-semibold">Add Task</span>
      </button>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">{editTaskId ? 'Edit Task' : 'Create Task'}</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                disabled={modalLoading}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                disabled={modalLoading}
                rows={3}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleModalChange}
                  className="border rounded-lg px-3 py-2 flex-1"
                  disabled={modalLoading}
                >
                  {taskStatusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleModalChange}
                  className="border rounded-lg px-3 py-2 flex-1"
                  disabled={modalLoading}
                >
                  {taskPriorityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {modalError && <div className="text-red-500 text-sm text-center">{modalError}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={modalLoading}
              >
                {modalLoading ? (editTaskId ? 'Saving...' : 'Creating...') : (editTaskId ? 'Save Changes' : 'Create Task')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 