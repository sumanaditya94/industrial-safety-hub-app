import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GasMonitor } from './components/GasMonitor';
import { HiraJsaContainer } from './components/HiraJsa';
import { LotoChecklist } from './components/LotoChecklist';
import { StatutoryActs } from './components/StatutoryActs';
import { HazardScanner } from './components/HazardScanner';
import { Admin } from './pages/Admin';
import { useAppStore } from './store';
import { getTranslation, speakText } from './i18n';
import { Shield, AlertTriangle, Volume2 } from 'lucide-react';


const Dashboard: React.FC = () => {
  const { language, goldenRules } = useAppStore();

  const handleReadRules = () => {
    const textToRead = "Today's Golden Rules are: " + goldenRules.join(". ");
    speakText(textToRead, language);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {getTranslation(language, 'welcome')}
          </h1>
          <p className="text-blue-200 text-lg max-w-xl">
            Your complete enterprise EHS+ safety suite. Monitor hazards, manage risks, and ensure compliance in real-time.
          </p>
        </div>
        <Shield className="w-32 h-32 text-blue-400 opacity-50 hidden md:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
              {getTranslation(language, 'golden_rules_title')}
            </h2>
            <button
              onClick={handleReadRules}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Read Aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-3">
            {goldenRules.map((rule, idx) => (
              <li key={idx} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mr-3">
                  {idx + 1}
                </span>
                <span className="text-slate-700">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
           <img
            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"
            alt="Safety First"
            className="rounded-lg shadow-md mb-4 h-48 w-full object-cover grayscale contrast-125"
          />
          <h3 className="text-xl font-bold text-slate-800">Safety is not an accident</h3>
          <p className="text-slate-600 mt-2">Zero Harm is our ultimate goal. Always prioritize safety in every task.</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { initializeListeners } = useAppStore();

  useEffect(() => {
    // Initialize Firebase syncing listeners on app mount
    initializeListeners();
  }, [initializeListeners]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gas-monitor" element={<GasMonitor />} />
          <Route path="/hira-jsa" element={<HiraJsaContainer />} />
          <Route path="/loto" element={<LotoChecklist />} />
          <Route path="/acts" element={<StatutoryActs />} />
          <Route path="/scanner" element={<HazardScanner />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
