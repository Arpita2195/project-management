import { useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import useTaskStore from '../store/useTaskStore';
import useProjectStore from '../store/useProjectStore';

const COLORS = ['#6C63FF', '#43E97B', '#f59e0b', '#FF6584'];

const Reports = () => {
  const { tasks, loadTasks } = useTaskStore();
  const { currentProject } = useProjectStore();

  useEffect(() => {
    if (currentProject?._id) {
      loadTasks(currentProject._id);
    }
  }, [currentProject?._id]);

  const projectTasks = useMemo(() => {
    return tasks.filter(t => (t.project?._id || t.project) === currentProject?._id);
  }, [tasks, currentProject?._id]);

  const statusData = useMemo(() => {
    const counts = { Backlog: 0, 'In Progress': 0, Review: 0, Done: 0 };
    projectTasks.forEach(t => { if (counts[t.column] !== undefined) counts[t.column]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projectTasks]);

  const priorityData = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    projectTasks.forEach(t => { if (counts[t.priority] !== undefined) counts[t.priority]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projectTasks]);

  const burndownData = [
    { day: 'Mon', remaining: 12, completed: 2 },
    { day: 'Tue', remaining: 10, completed: 4 },
    { day: 'Wed', remaining: 9, completed: 5 },
    { day: 'Thu', remaining: 7, completed: 7 },
    { day: 'Fri', remaining: 5, completed: 10 },
    { day: 'Sat', remaining: 3, completed: 12 },
    { day: 'Sun', remaining: 2, completed: 13 },
  ];

  if (!currentProject) return (
    <div className="flex-1 flex items-center justify-center text-gray-500 italic">
      Please select a project to see reports.
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 animate-[fadeUp_0.4s_ease]">
      <div className="mb-6">
        <h2 className="font-head text-2xl font-bold text-primary mb-1">Project Reports</h2>
        <p className="text-sm text-secondary">Analytics for {currentProject.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Distribution */}
        <div className="bg-surface border border-main rounded-2xl p-6">
          <div className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">Status Distribution</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-text)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] text-secondary uppercase font-bold">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Analysis */}
        <div className="bg-surface border border-main rounded-2xl p-6">
          <div className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">Priority Breakdown</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--color-border)' }}
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#6C63FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Burndown Chart */}
      <div className="bg-surface border border-main rounded-2xl p-6">
        <div className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">Weekly Burndown</div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={burndownData}>
              <defs>
                <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#43E97B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#43E97B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="completed" stroke="#43E97B" fillOpacity={1} fill="url(#colorComp)" strokeWidth={3} />
              <Line type="monotone" dataKey="remaining" stroke="#6C63FF" strokeWidth={3} dot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
