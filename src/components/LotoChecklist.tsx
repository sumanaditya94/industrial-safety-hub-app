import React, { useState } from 'react';
import { useAppStore } from '../store';
import { getTranslation } from '../i18n';
import { Lock, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../utils/cn';

const lotoSteps = [
  "Prepare for shutdown: Understand the equipment, hazards, and necessary control methods.",
  "Notify all affected employees that a lockout/tagout system is going to be utilized.",
  "Equipment Shutdown: Turn off the equipment using normal stopping procedures.",
  "Isolation: Isolate the equipment from its energy sources (electrical, mechanical, hydraulic, etc.).",
  "Lockout/Tagout Application: Apply locks and tags to the energy isolating devices.",
  "Release Stored Energy: Relieve, disconnect, or restrain any residual or stored energy.",
  "Verification: Verify that equipment isolation and de-energization have been accomplished.",
  "Perform Maintenance/Servicing work safely.",
  "Release from Lockout/Tagout: Inspect area, notify employees, remove locks/tags, and restore energy."
];

export const LotoChecklist: React.FC = () => {
  const { language } = useAppStore();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newSteps = new Set(completedSteps);
    if (newSteps.has(index)) {
      newSteps.delete(index);
    } else {
      newSteps.add(index);
    }
    setCompletedSteps(newSteps);
  };

  const progress = Math.round((completedSteps.size / lotoSteps.length) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center space-x-3 mb-8 border-b pb-4">
        <Lock className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-800">
          {getTranslation(language, 'loto_title')}
        </h1>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Isolation Progress</span>
            <span className={cn("text-2xl font-bold", progress === 100 ? "text-green-600" : "text-blue-600")}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className={cn("h-3 rounded-full transition-all duration-500", progress === 100 ? "bg-green-600" : "bg-blue-600")}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {lotoSteps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isNext = !isCompleted && (index === 0 || completedSteps.has(index - 1));
            const isLocked = !isCompleted && !isNext;

            return (
              <div
                key={index}
                onClick={() => !isLocked && toggleStep(index)}
                className={cn(
                  "flex items-start p-4 rounded-lg border-2 transition-all duration-300",
                  isCompleted ? "bg-green-50 border-green-200 cursor-pointer" :
                  isNext ? "bg-blue-50 border-blue-400 cursor-pointer shadow-md transform scale-[1.02]" :
                  "bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed"
                )}
              >
                <div className="mt-1 flex-shrink-0 mr-4">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className={cn("w-6 h-6", isNext ? "text-blue-400" : "text-slate-300")} />
                  )}
                </div>
                <div>
                  <span className={cn(
                    "font-bold mr-2",
                    isCompleted ? "text-green-700" : isNext ? "text-blue-800" : "text-slate-500"
                  )}>
                    Step {index + 1}:
                  </span>
                  <span className={cn(
                    "text-slate-700",
                    isCompleted && "line-through text-slate-500"
                  )}>
                    {step}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
