import React, { useState } from 'react';
import { useAppStore } from '../store';
import { getTranslation, speakText } from '../i18n';
import { Book, Zap, Shield, Search, Volume2 } from 'lucide-react';
import { cn } from '../utils/cn';

const actsData = [
  {
    id: 'ifa',
    title: 'Indian Factories Act, 1948',
    icon: Shield,
    description: 'The principal legislation that governs the occupational safety, health, and welfare of workers in factories across India.',
    keyPoints: [
      'Chapter IV: Safety (Fencing of machinery, working on or near machinery in motion).',
      'Chapter III: Health (Cleanliness, disposal of wastes, ventilation, dust and fume).',
      'Chapter IVA: Provisions relating to Hazardous Processes.',
      'Working hours, annual leave with wages, and special provisions for women and young persons.'
    ]
  },
  {
    id: 'cea',
    title: 'CEA (Measures Relating to Safety and Electric Supply) Regulations, 2023',
    icon: Zap,
    description: 'Regulations mandated by the Central Electricity Authority to ensure safety during the generation, transmission, distribution, and use of electricity.',
    keyPoints: [
      'Mandatory general safety requirements for electrical installations.',
      'Clearance requirements (ground, structural) for overhead lines.',
      'Earthing and protective measures against electric shock.',
      'Specific regulations for mines, oil fields, and hazardous areas.'
    ]
  }
];

export const StatutoryActs: React.FC = () => {
  const { language } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(actsData[0].id);

  const filteredActs = actsData.filter(act =>
    act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    act.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReadAct = (e: React.MouseEvent, act: typeof actsData[0]) => {
    e.stopPropagation();
    const textToRead = `${act.title}. ${act.description} Key points include: ${act.keyPoints.join('. ')}`;
    speakText(textToRead, language);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <Book className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-800">
            {getTranslation(language, 'acts_title')}
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Acts & Rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredActs.map(act => (
          <div
            key={act.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div
              className={cn(
                "p-6 cursor-pointer hover:bg-slate-50 transition-colors flex items-start",
                expandedId === act.id ? "bg-blue-50/50" : ""
              )}
              onClick={() => setExpandedId(expandedId === act.id ? null : act.id)}
            >
              <div className="bg-blue-100 p-3 rounded-lg mr-4 mt-1">
                <act.icon className="w-6 h-6 text-blue-700" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-slate-800">{act.title}</h2>
                  <button
                    onClick={(e) => handleReadAct(e, act)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-slate-600 mt-2 line-clamp-2">{act.description}</p>
              </div>
            </div>

            {expandedId === act.id && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3 uppercase tracking-wider text-sm">Key Provisions</h3>
                <ul className="space-y-2">
                  {act.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start text-slate-700">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
