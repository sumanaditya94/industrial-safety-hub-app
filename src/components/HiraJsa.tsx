import React, { useState } from 'react';
import { useAppStore } from '../store';
import { getTranslation } from '../i18n';
import { ShieldAlert, Plus, Trash2, Printer } from 'lucide-react';
import { cn } from '../utils/cn';

// HIRA Component
const HiraMatrix: React.FC = () => {
  const severities = [
    { level: 1, desc: 'Negligible' },
    { level: 2, desc: 'Minor' },
    { level: 3, desc: 'Moderate' },
    { level: 4, desc: 'Major' },
    { level: 5, desc: 'Fatal' },
  ];

  const likelihoods = [
    { level: 1, desc: 'Rare' },
    { level: 2, desc: 'Unlikely' },
    { level: 3, desc: 'Possible' },
    { level: 4, desc: 'Likely' },
    { level: 5, desc: 'Almost Certain' },
  ];

  const getRiskColor = (score: number) => {
    if (score <= 4) return 'bg-green-400 text-green-900';
    if (score <= 9) return 'bg-yellow-400 text-yellow-900';
    if (score <= 14) return 'bg-orange-400 text-orange-900';
    return 'bg-red-500 text-white font-bold';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <ShieldAlert className="w-6 h-6 mr-2 text-blue-600" />
        5x5 HIRA Risk Matrix
      </h2>

      <div className="min-w-[600px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-slate-100 w-32">Severity \\ Likelihood</th>
              {likelihoods.map(l => (
                <th key={l.level} className="border p-2 bg-slate-50 text-sm">
                  {l.level} - {l.desc}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...severities].reverse().map((s) => (
              <tr key={s.level}>
                <th className="border p-2 bg-slate-50 text-sm text-left">
                  {s.level} - {s.desc}
                </th>
                {likelihoods.map((l) => {
                  const score = s.level * l.level;
                  return (
                    <td key={l.level} className={cn("border p-4 text-center cursor-pointer transition-transform hover:scale-105", getRiskColor(score))}>
                      {score}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex gap-4 text-sm font-medium">
          <div className="flex items-center"><span className="w-4 h-4 bg-green-400 inline-block mr-2"></span> 1-4: Low</div>
          <div className="flex items-center"><span className="w-4 h-4 bg-yellow-400 inline-block mr-2"></span> 5-9: Medium</div>
          <div className="flex items-center"><span className="w-4 h-4 bg-orange-400 inline-block mr-2"></span> 10-14: High</div>
          <div className="flex items-center"><span className="w-4 h-4 bg-red-500 inline-block mr-2"></span> 15-25: Extreme</div>
        </div>
      </div>
    </div>
  );
};

// JSA Component
interface JsaStep {
  id: string;
  step: string;
  hazard: string;
  control: string;
}

const JsaBuilder: React.FC = () => {
  const [steps, setSteps] = useState<JsaStep[]>([]);
  const [newStep, setNewStep] = useState({ step: '', hazard: '', control: '' });

  const addStep = (e: React.FormEvent) => {
    e.preventDefault();
    setSteps([...steps, { id: Date.now().toString(), ...newStep }]);
    setNewStep({ step: '', hazard: '', control: '' });
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Job Safety Analysis (JSA) Builder</h2>
        <button className="flex items-center text-slate-600 hover:text-blue-600" onClick={() => window.print()}>
          <Printer className="w-5 h-5 mr-1" /> Print JSA
        </button>
      </div>

      <form onSubmit={addStep} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-slate-50 p-4 rounded-lg">
        <input required placeholder="Job Step" value={newStep.step} onChange={e => setNewStep({...newStep, step: e.target.value})} className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <input required placeholder="Potential Hazard" value={newStep.hazard} onChange={e => setNewStep({...newStep, hazard: e.target.value})} className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <input required placeholder="Control Measure" value={newStep.control} onChange={e => setNewStep({...newStep, control: e.target.value})} className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-1" /> Add Step
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-left">
              <th className="p-3 rounded-tl-lg">Sequence of Basic Job Steps</th>
              <th className="p-3">Potential Hazards</th>
              <th className="p-3">Recommended Action / Procedure</th>
              <th className="p-3 rounded-tr-lg w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {steps.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 italic border-b border-l border-r">
                  No steps added yet. Add a step above to build your JSA.
                </td>
              </tr>
            ) : (
              steps.map((s, index) => (
                <tr key={s.id} className="border-b border-l border-r hover:bg-slate-50">
                  <td className="p-3">{index + 1}. {s.step}</td>
                  <td className="p-3 text-red-600">{s.hazard}</td>
                  <td className="p-3 text-green-700">{s.control}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => removeStep(s.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const HiraJsaContainer: React.FC = () => {
  const { language } = useAppStore();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 border-b pb-4">
        {getTranslation(language, 'nav_hira_jsa')}
      </h1>
      <HiraMatrix />
      <JsaBuilder />
    </div>
  );
};
