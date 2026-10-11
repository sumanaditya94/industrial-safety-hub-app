import React, { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { getTranslation, speechLangMap } from '../i18n';
import { Camera, Upload, AlertTriangle, Loader2, Mic, MicOff } from 'lucide-react';
import { analyzeHazardImage } from '../services/gemini';
import { cn } from '../utils/cn';

export const HazardScanner: React.FC = () => {
  const { language } = useAppStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech Recognition State
  const [customPrompt, setCustomPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setAnalysisResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const mimeTypeMatch = imagePreview.match(/^data:(image\/[a-zA-Z]*);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

      const result = await analyzeHazardImage(imagePreview, mimeType, customPrompt);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze image. Check API key configuration.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = speechLangMap[language];
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCustomPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-6 border-b pb-4">
        <Camera className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-800">
          {getTranslation(language, 'scanner_title')}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p className="text-slate-600 mb-6">
          Upload an image. Use text or voice to customize the AI EHS audit prompt.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[300px]"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-[250px] object-contain rounded-lg shadow-sm" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 font-medium">Click to upload or capture image</p>
                  <p className="text-sm text-slate-400 mt-2">Supports JPG, PNG, WEBP</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />

            <div className="relative">
              <textarea
                className="w-full pl-3 pr-12 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
                placeholder="Optional: Custom prompt for the AI (e.g., 'Focus specifically on scaffolding safety...')"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <button
                onClick={toggleSpeechRecognition}
                className={cn(
                  "absolute right-2 bottom-2 p-2 rounded-full transition-colors",
                  isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
                title={isListening ? "Stop listening" : "Use Voice Command"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!imagePreview || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing EHS Hazards...
                </>
              ) : (
                'Run AI Hazard Audit'
              )}
            </button>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 min-h-[300px]">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Audit Findings
            </h2>

            {error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            ) : analysisResult ? (
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                {analysisResult}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-slate-400">
                <Camera className="w-10 h-10 mb-3 opacity-20" />
                <p>Upload an image and run the audit to see results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
