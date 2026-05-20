import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Toggle = ({ defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      onClick={() => setOn((o) => !o)}
      className={`w-10 h-6 rounded-full relative cursor-pointer transition-all duration-200 border
        ${on ? 'bg-accent border-accent' : 'bg-secondary/10 border-main'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </div>
  );
};

const SettingsRow = ({ label, desc, children }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-main last:border-0 hover:bg-secondary/5 transition-colors">
    <div>
      <div className="text-sm font-medium text-primary">{label}</div>
      {desc && <div className="text-xs text-secondary mt-0.5">{desc}</div>}
    </div>
    {children}
  </div>
);

const Settings = ({ theme, toggleTheme }) => {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto p-6 animate-[fadeUp_0.4s_ease]">
      <h2 className="font-head text-xl font-bold text-primary mb-5">Settings</h2>

      {/* Profile */}
      <div className="bg-surface border border-main rounded-2xl mb-4 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-main font-head text-sm font-bold text-primary">Profile</div>
        <SettingsRow label="Display name" desc={user?.name || 'Loading...'}>
          <button onClick={() => toast.success('Edit profile in full version')}
            className="px-3 py-1.5 bg-accent/15 text-accent border border-accent/30 rounded-lg text-xs font-semibold hover:bg-accent/25 transition-all">
            Edit
          </button>
        </SettingsRow>
        <SettingsRow label="Email" desc={user?.email || 'N/A'}>
          <span className="text-xs text-secondary">Verified ✓</span>
        </SettingsRow>
        <SettingsRow label="Change password" desc="Update your account password">
          <button onClick={() => toast.success('Reset link sent to your email')}
            className="px-3 py-1.5 bg-accent/15 text-accent border border-accent/30 rounded-lg text-xs font-semibold hover:bg-accent/25 transition-all">
            Reset
          </button>
        </SettingsRow>
      </div>

      {/* Appearance */}
      <div className="bg-surface border border-main rounded-2xl mb-4 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-main font-head text-sm font-bold text-primary">Appearance</div>
        <SettingsRow label="Dark Mode" desc="Switch between dark and light themes">
          <div
            onClick={toggleTheme}
            className={`w-10 h-6 rounded-full relative cursor-pointer transition-all duration-200 border
              ${theme === 'dark' ? 'bg-accent border-accent' : 'bg-secondary/10 border-main'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${theme === 'dark' ? 'left-[22px]' : 'left-0.5'}`} />
          </div>
        </SettingsRow>
        <SettingsRow label="Compact Mode" desc="Reduce card padding for more content"><Toggle /></SettingsRow>
        <SettingsRow label="Animations" desc="Enable motion effects"><Toggle defaultOn /></SettingsRow>
      </div>

      {/* Notifications */}
      <div className="bg-surface border border-main rounded-2xl mb-4 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-main font-head text-sm font-bold text-primary">Notifications</div>
        <SettingsRow label="Task assignments" desc="Get notified when tasks are assigned to you"><Toggle defaultOn /></SettingsRow>
        <SettingsRow label="Comments & mentions" desc="Receive alerts on @mentions"><Toggle defaultOn /></SettingsRow>
        <SettingsRow label="Due date reminders" desc="24h before task deadline"><Toggle /></SettingsRow>
        <SettingsRow label="Email digest" desc="Weekly summary of project activity"><Toggle defaultOn /></SettingsRow>
      </div>

      {/* Danger zone */}
      <div className="bg-surface border border-accent2/20 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-accent2/20 font-head text-sm font-bold text-accent2">Danger Zone</div>
        <SettingsRow label="Delete account" desc="Permanently remove your account and all data">
          <button onClick={() => toast.error('This action is irreversible')}
            className="px-3 py-1.5 bg-accent2/10 text-accent2 border border-accent2/30 rounded-lg text-xs font-semibold hover:bg-accent2/20 transition-all">
            Delete
          </button>
        </SettingsRow>
      </div>
    </div>
  );
};

export default Settings;
