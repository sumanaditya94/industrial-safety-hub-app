export type LanguageKey = 'en' | 'hi' | 'bn' | 'mr';

type Dictionary = Record<string, string>;

export const translations: Record<LanguageKey, Dictionary> = {
  en: {
    app_title: "Industrial Safety Hub",
    nav_dashboard: "Dashboard",
    nav_gas_monitor: "Gas Monitor",
    nav_hira_jsa: "HIRA & JSA",
    nav_loto: "LOTO",
    nav_acts: "Statutory Acts",
    nav_scanner: "Hazard Scanner",
    nav_admin: "Admin Panel",
    welcome: "Welcome to EHS+",
    golden_rules_title: "Daily Safety Golden Rules",
    sds_title: "Chemical SDS Library",
    sds_twa: "TWA",
    sds_stel: "STEL",
    sds_ppe: "PPE",
    sds_first_aid: "First Aid",
    admin_pin_prompt: "Enter Super Admin PIN",
    admin_pin_placeholder: "PIN (e.g. 1234)",
    gas_monitor_title: "4-Gas Confined Space Monitor",
    loto_title: "9-Step LOTO Checklist",
    hira_title: "5x5 HIRA Risk Matrix",
    scanner_title: "AI Hazard Scanner",
    acts_title: "Statutory Acts",
    alerts_title: "Emergency Alerts",
  },
  hi: {
    app_title: "औद्योगिक सुरक्षा हब",
    nav_dashboard: "डैशबोर्ड",
    nav_gas_monitor: "गैस मॉनिटर",
    nav_hira_jsa: "HIRA और JSA",
    nav_loto: "LOTO",
    nav_acts: "वैधानिक अधिनियम",
    nav_scanner: "खतरा स्कैनर",
    nav_admin: "एडमिन पैनल",
    welcome: "EHS+ में आपका स्वागत है",
    golden_rules_title: "दैनिक सुरक्षा स्वर्ण नियम",
    sds_title: "रासायनिक SDS लाइब्रेरी",
    sds_twa: "TWA",
    sds_stel: "STEL",
    sds_ppe: "PPE",
    sds_first_aid: "प्राथमिक चिकित्सा",
    admin_pin_prompt: "सुपर एडमिन पिन दर्ज करें",
    admin_pin_placeholder: "पिन (उदा. 1234)",
    gas_monitor_title: "4-गैस सीमित स्थान मॉनिटर",
    loto_title: "9-चरण LOTO चेकलिस्ट",
    hira_title: "5x5 HIRA जोखिम मैट्रिक्स",
    scanner_title: "AI खतरा स्कैनर",
    acts_title: "वैधानिक अधिनियम",
    alerts_title: "आपातकालीन अलर्ट",
  },
  bn: {
    app_title: "ইন্ডাস্ট্রিয়াল সেফটি হাব",
    nav_dashboard: "ড্যাশবোর্ড",
    nav_gas_monitor: "গ্যাস মনিটর",
    nav_hira_jsa: "HIRA এবং JSA",
    nav_loto: "LOTO",
    nav_acts: "বিধিবদ্ধ আইন",
    nav_scanner: "বিপদ স্ক্যানার",
    nav_admin: "অ্যাডমিন প্যানেল",
    welcome: "EHS+ এ স্বাগতম",
    golden_rules_title: "দৈনিক নিরাপত্তা গোল্ডেন রুলস",
    sds_title: "রাসায়নিক SDS লাইব্রেরি",
    sds_twa: "TWA",
    sds_stel: "STEL",
    sds_ppe: "PPE",
    sds_first_aid: "প্রাথমিক চিকিৎসা",
    admin_pin_prompt: "সুপার অ্যাডমিন পিন লিখুন",
    admin_pin_placeholder: "পিন (উদাঃ 1234)",
    gas_monitor_title: "4-গ্যাস আবদ্ধ স্থান মনিটর",
    loto_title: "9-পদক্ষেপ LOTO চেকলিস্ট",
    hira_title: "5x5 HIRA ঝুঁকি ম্যাট্রিক্স",
    scanner_title: "এআই বিপদ স্ক্যানার",
    acts_title: "বিধিবদ্ধ আইন",
    alerts_title: "জরুরী সতর্কতা",
  },
  mr: {
    app_title: "औद्योगिक सुरक्षा हब",
    nav_dashboard: "डॅशबोर्ड",
    nav_gas_monitor: "गॅस मॉनिटर",
    nav_hira_jsa: "HIRA आणि JSA",
    nav_loto: "LOTO",
    nav_acts: "वैधानिक कायदे",
    nav_scanner: "धोका स्कॅनर",
    nav_admin: "प्रशासन पॅनेल",
    welcome: "EHS+ मध्ये आपले स्वागत आहे",
    golden_rules_title: "दैनिक सुरक्षा सुवर्ण नियम",
    sds_title: "रासायनिक SDS लायब्ररी",
    sds_twa: "TWA",
    sds_stel: "STEL",
    sds_ppe: "PPE",
    sds_first_aid: "प्रथमोपचार",
    admin_pin_prompt: "सुपर प्रशासक पिन प्रविष्ट करा",
    admin_pin_placeholder: "पिन (उदा. 1234)",
    gas_monitor_title: "4-गॅस मर्यादित जागा मॉनिटर",
    loto_title: "9-चरण LOTO चेकलिस्ट",
    hira_title: "5x5 HIRA जोखीम मॅट्रिक्स",
    scanner_title: "AI धोका स्कॅनर",
    acts_title: "वैधानिक कायदे",
    alerts_title: "आणीबाणी अलर्ट",
  },
};

export const getTranslation = (lang: LanguageKey, key: string): string => {
  return translations[lang]?.[key] || translations['en'][key] || key;
};

// Map internal language codes to browser BCP 47 language tags for speech
export const speechLangMap: Record<LanguageKey, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
};

export const speakText = (text: string, lang: LanguageKey) => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLangMap[lang];
  window.speechSynthesis.speak(utterance);
};
