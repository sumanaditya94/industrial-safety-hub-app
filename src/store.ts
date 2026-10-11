import { create } from 'zustand';
import { db } from './services/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

export type Language = 'en' | 'hi' | 'bn' | 'mr';

export interface SdsEntry {
  id: string;
  chemicalName: string;
  twa: string;
  stel: string;
  ppe: string;
  firstAid: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'emergency';
  timestamp: number;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;

  sdsEntries: SdsEntry[];
  goldenRules: string[];
  alerts: Alert[];

  // Actions that sync with Firebase
  addSdsEntry: (entry: SdsEntry) => Promise<void>;
  deleteSdsEntry: (id: string) => Promise<void>;
  setGoldenRules: (rules: string[]) => Promise<void>;
  addAlert: (alert: Alert) => Promise<void>;

  // Initialization
  initializeListeners: () => void;
}

export const useAppStore = create<AppState>((set) => {
  let listenersInitialized = false;

  return {
    language: 'en',
    setLanguage: (language) => set({ language }),

    sdsEntries: [],
    goldenRules: [
      'Always obtain a valid permit to work before starting any high-risk job.',
      'Verify isolation (LOTO) before working on energized equipment.',
      'Never bypass safety interlocks or protective devices.',
      'Always wear appropriate PPE for the task.',
      'Report all near misses and incidents immediately.'
    ],
    alerts: [],

    addSdsEntry: async (entry) => {
      try {
        await setDoc(doc(db, 'sdsEntries', entry.id), entry as any);
      } catch (error) {
        console.error("Firebase error (fallback to local state):", error);
        set((state) => ({ sdsEntries: [...state.sdsEntries, entry] }));
      }
    },

    deleteSdsEntry: async (id) => {
      try {
        await deleteDoc(doc(db, 'sdsEntries', id));
      } catch (error) {
        console.error("Firebase error (fallback to local state):", error);
        set((state) => ({ sdsEntries: state.sdsEntries.filter(e => e.id !== id) }));
      }
    },

    setGoldenRules: async (rules) => {
      try {
        await setDoc(doc(db, 'settings', 'goldenRules'), { rules });
      } catch (error) {
        console.error("Firebase error (fallback to local state):", error);
        set({ goldenRules: rules });
      }
    },

    addAlert: async (alert) => {
      try {
        await setDoc(doc(db, 'alerts', alert.id), alert as any);
      } catch (error) {
        console.error("Firebase error (fallback to local state):", error);
        set((state) => ({ alerts: [alert, ...state.alerts] }));
      }
    },

    initializeListeners: () => {
      if (listenersInitialized) return;
      listenersInitialized = true;

      try {
        // SDS Listeners
        onSnapshot(collection(db, 'sdsEntries'), (snapshot) => {
          const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SdsEntry));
          // If firestore is empty initially, don't overwrite with empty array if we want defaults,
          // but for this implementation we'll assume Firebase is the source of truth.
          if (entries.length > 0) {
             set({ sdsEntries: entries });
          } else {
             // Mock defaults if DB is truly empty/mocked
             set({ sdsEntries: [
              {
                id: '1',
                chemicalName: 'Benzene',
                twa: '0.5 ppm',
                stel: '2.5 ppm',
                ppe: 'Respirator, Gloves, Goggles',
                firstAid: 'Move to fresh air, wash skin.',
              },
              {
                id: '2',
                chemicalName: 'Hydrogen Sulfide (H2S)',
                twa: '10 ppm',
                stel: '15 ppm',
                ppe: 'SCBA, Gas Monitor',
                firstAid: 'Move to fresh air immediately. Give CPR if not breathing.',
              }
             ]});
          }
        }, (error) => console.error("SDS Snapshot Error:", error));

        // Golden Rules Listener
        onSnapshot(doc(db, 'settings', 'goldenRules'), (docSnapshot) => {
          if (docSnapshot.exists() && docSnapshot.data().rules) {
            set({ goldenRules: docSnapshot.data().rules });
          }
        }, (error) => console.error("Golden Rules Snapshot Error:", error));

        // Alerts Listener
        onSnapshot(collection(db, 'alerts'), (snapshot) => {
          const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
          alerts.sort((a, b) => b.timestamp - a.timestamp);
          if (alerts.length > 0) {
            set({ alerts });
          }
        }, (error) => console.error("Alerts Snapshot Error:", error));

      } catch (error) {
        console.error("Could not initialize Firebase listeners. Ensure config is valid.", error);
      }
    }
  };
});
