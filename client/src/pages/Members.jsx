import { useState } from 'react';
import useProjectStore from '../store/useProjectStore';
import useTaskStore from '../store/useTaskStore';
import InviteMemberModal from '../components/project/InviteMemberModal';

const Members = () => {
  const { currentProject, userRole } = useProjectStore();
  const { tasks } = useTaskStore();
  const [showInvite, setShowInvite] = useState(false);

  const canInvite = ['owner', 'admin'].includes(userRole);

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 italic">
        Please select a project to see team members.
      </div>
    );
  }

  // Combine owner and members for the list
  const allMembers = [
    { ...currentProject.owner, role: 'owner' },
    ...currentProject.members.map(m => ({ ...m.user, role: m.role }))
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 animate-[fadeUp_0.4s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-head text-2xl font-bold text-primary mb-1">Team Members</h2>
          <p className="text-sm text-secondary">{allMembers.length} members in this project</p>
        </div>
        {canInvite && (
          <button 
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary/5 border border-main rounded-xl text-sm font-semibold text-primary hover:bg-secondary/10 hover:border-accent/40 transition-all"
          >
            ➕ Invite Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allMembers.map((m, i) => {
          const initials = m.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
          const memberTasks = tasks.filter(t => t.assignees?.some(a => a._id === m._id));
          const doneTasks = memberTasks.filter(t => t.column === 'Done').length;
          const rate = memberTasks.length ? Math.round((doneTasks / memberTasks.length) * 100) : 0;
          
          return (
            <div
              key={m._id}
              className="bg-surface border border-main rounded-2xl p-6 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all group animate-[card-enter_0.35s_ease_both]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-head text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-all duration-300">
                  {initials}
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest
                  ${m.role === 'owner' ? 'bg-accent2/10 text-accent2' : 
                    m.role === 'admin' ? 'bg-yellow-500/10 text-yellow-400' : 
                    'bg-accent3/10 text-accent3'}`}
                >
                  {m.role}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="font-head text-lg font-bold text-primary mb-0.5">{m.name}</div>
                <div className="text-sm text-secondary">{m.email}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { label: 'Tasks', val: memberTasks.length },
                  { label: 'Done', val: doneTasks },
                  { label: 'Rate', val: `${rate}%` },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-secondary/5 rounded-xl p-2 text-center">
                    <div className="text-sm font-bold text-primary">{val}</div>
                    <div className="text-[10px] text-secondary/60 uppercase font-bold">{label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-secondary/60">
                  <span>Efficiency Rate</span>
                  <span>{rate}%</span>
                </div>
                <div className="h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${rate}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showInvite && <InviteMemberModal onClose={() => setShowInvite(false)} />}
    </div>
  );
};

export default Members;

