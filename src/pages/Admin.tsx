import React, { useState } from 'react';
import { useAppStore } from '../store';
import { getTranslation } from '../i18n';
import { Lock, Plus, Trash2, Send } from 'lucide-react';

export const Admin: React.FC = () => {
  const { language, sdsEntries, goldenRules, addSdsEntry, deleteSdsEntry, setGoldenRules, addAlert } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');

  const [newSds, setNewSds] = useState({ chemicalName: '', twa: '', stel: '', ppe: '', firstAid: '' });
  const [alertMessage, setAlertMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid PIN');
    }
  };

  const handleAddSds = (e: React.FormEvent) => {
    e.preventDefault();
    addSdsEntry({ id: Date.now().toString(), ...newSds });
    setNewSds({ chemicalName: '', twa: '', stel: '', ppe: '', firstAid: '' });
  };

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertMessage.trim()) return;

    addAlert({
      id: Date.now().toString(),
      message: alertMessage,
      severity: 'emergency',
      timestamp: Date.now(),
    });
    setAlertMessage('');
    alert('Alert Broadcasted successfully!');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-slate-800">
            {getTranslation(language, 'admin_pin_prompt')}
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={getTranslation(language, 'admin_pin_placeholder')}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 border-b pb-4">
        {getTranslation(language, 'nav_admin')} Dashboard
      </h1>

      {/* Broadcast Alerts */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <Send className="w-5 h-5 mr-2 text-red-500" />
          Broadcast Emergency Alert
        </h2>
        <form onSubmit={handleBroadcastAlert} className="flex gap-4">
          <input
            type="text"
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
            placeholder="Enter emergency message..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Broadcast
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Manage SDS Library (Cloud Synced)</h2>

          <form onSubmit={handleAddSds} className="space-y-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-sm text-slate-600">Add New Chemical</h3>
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Chemical Name" value={newSds.chemicalName} onChange={e => setNewSds({...newSds, chemicalName: e.target.value})} className="col-span-2 px-3 py-2 border rounded" />
              <input required placeholder="TWA" value={newSds.twa} onChange={e => setNewSds({...newSds, twa: e.target.value})} className="px-3 py-2 border rounded" />
              <input required placeholder="STEL" value={newSds.stel} onChange={e => setNewSds({...newSds, stel: e.target.value})} className="px-3 py-2 border rounded" />
              <input required placeholder="PPE" value={newSds.ppe} onChange={e => setNewSds({...newSds, ppe: e.target.value})} className="col-span-2 px-3 py-2 border rounded" />
              <input required placeholder="First Aid" value={newSds.firstAid} onChange={e => setNewSds({...newSds, firstAid: e.target.value})} className="col-span-2 px-3 py-2 border rounded" />
            </div>
            <button type="submit" className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add Entry
            </button>
          </form>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sdsEntries.map(sds => (
              <div key={sds.id} className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-800">{sds.chemicalName}</h4>
                  <p className="text-xs text-slate-500">TWA: {sds.twa} | STEL: {sds.stel}</p>
                </div>
                <button onClick={() => deleteSdsEntry(sds.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Manage Golden Rules (Cloud Synced)</h2>
          <div className="space-y-4">
            <textarea
              rows={10}
              className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              value={goldenRules.join('\n')}
              onChange={(e) => setGoldenRules(e.target.value.split('\n').filter(r => r.trim()))}
            />
            <p className="text-xs text-slate-500">Enter one rule per line. Changes sync via Firebase.</p>
          </div>
        </section>
      </div>
    </div>
  );
};
