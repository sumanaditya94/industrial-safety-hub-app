import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../store';
import { getTranslation, type LanguageKey } from '../i18n';
import { Activity, FileText, Lock, Book, Camera, Settings, ExternalLink } from 'lucide-react';
import logo from '../assets/logo.png';
import { cn } from '../utils/cn';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, alerts } = useAppStore();

  const navItems = [
    { to: '/', icon: Activity, labelKey: 'nav_dashboard' }, // Adjusted dashboard icon for demo
    { to: '/gas-monitor', icon: Activity, labelKey: 'nav_gas_monitor' },
    { to: '/hira-jsa', icon: FileText, labelKey: 'nav_hira_jsa' },
    { to: '/loto', icon: Lock, labelKey: 'nav_loto' },
    { to: '/acts', icon: Book, labelKey: 'nav_acts' },
    { to: '/scanner', icon: Camera, labelKey: 'nav_scanner' },
    { to: '/admin', icon: Settings, labelKey: 'nav_admin' },
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col h-full hidden md:flex">
        <div className="p-4 border-b border-slate-800 flex items-center justify-center">
          <img src={logo} alt="EHS+ Logo" className="h-12 object-contain" />
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{getTranslation(language, item.labelKey)}</span>
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <a
              href="https://ehsplus.blogspot.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Official Blog</span>
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <label className="text-xs text-slate-400 mb-1 block">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageKey)}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-md p-2 focus:outline-none focus:border-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header / Alerts Bar */}
        {alerts.length > 0 && (
          <div className="bg-red-600 text-white p-3 shadow-md flex justify-between items-center z-10">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">{getTranslation(language, 'alerts_title')}:</span>
              <span>{alerts[0].message}</span>
            </div>
            {alerts.length > 1 && (
              <span className="text-xs bg-red-800 px-2 py-1 rounded-full">
                +{alerts.length - 1} more
              </span>
            )}
          </div>
        )}

        {/* Mobile Nav Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-10">
           <img src={logo} alt="EHS+ Logo" className="h-8 object-contain" />
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
