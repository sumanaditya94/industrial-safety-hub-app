import React, { useState } from 'react';
import { useAppStore } from '../store';
import { getTranslation } from '../i18n';
import { Activity, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';

interface GasReading {
  name: string;
  unit: string;
  safeMin: number;
  safeMax: number;
  maxSlider: number;
}

export const GasMonitor: React.FC = () => {
  const { language } = useAppStore();

  const [readings, setReadings] = useState<{ [key: string]: number }>({
    O2: 20.9,
    LEL: 0,
    CO: 0,
    H2S: 0,
  });

  const config: GasReading[] = [
    { name: 'O2', unit: '%', safeMin: 19.5, safeMax: 23.5, maxSlider: 30 },
    { name: 'LEL', unit: '%', safeMin: 0, safeMax: 10, maxSlider: 100 },
    { name: 'CO', unit: 'ppm', safeMin: 0, safeMax: 25, maxSlider: 100 },
    { name: 'H2S', unit: 'ppm', safeMin: 0, safeMax: 10, maxSlider: 50 },
  ];

  const handleSliderChange = (name: string, value: number) => {
    setReadings(prev => ({ ...prev, [name]: value }));
  };

  const isAlarm = (value: number, safeMin: number, safeMax: number) => {
    return value < safeMin || value >= safeMax;
  };

  const hasAnyAlarm = config.some(c => isAlarm(readings[c.name], c.safeMin, c.safeMax));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-800">
          {getTranslation(language, 'gas_monitor_title')}
        </h1>
      </div>

      <div className={cn(
        "p-6 rounded-2xl shadow-lg border-2 transition-colors duration-500",
        hasAnyAlarm ? "bg-red-50 border-red-500" : "bg-white border-green-500"
      )}>
        {hasAnyAlarm && (
          <div className="flex items-center justify-center space-x-2 text-red-600 mb-6 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
            <h2 className="text-2xl font-bold uppercase tracking-wider">Evacuate Area</h2>
            <AlertTriangle className="w-8 h-8" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {config.map((gas) => {
            const val = readings[gas.name];
            const alarm = isAlarm(val, gas.safeMin, gas.safeMax);

            return (
              <div key={gas.name} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-700">{gas.name}</h3>
                  <span className={cn(
                    "text-2xl font-black font-mono px-3 py-1 rounded-md",
                    alarm ? "bg-red-600 text-white animate-pulse" : "bg-green-100 text-green-800"
                  )}>
                    {val.toFixed(1)} <span className="text-sm font-normal">{gas.unit}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={gas.maxSlider}
                    step="0.1"
                    value={val}
                    onChange={(e) => handleSliderChange(gas.name, parseFloat(e.target.value))}
                    className={cn(
                      "w-full h-3 rounded-lg appearance-none cursor-pointer",
                      alarm ? "bg-red-300 accent-red-600" : "bg-slate-300 accent-green-600"
                    )}
                  />
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Safe Range:</span>
                    <span>{gas.safeMin} - {gas.safeMax} {gas.unit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
