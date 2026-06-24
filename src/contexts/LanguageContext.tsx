import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.track": "Track",
    "nav.quote": "Get Quote",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.close": "Close",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    
    // Chat
    "chat.title": "Chat with Support",
    "chat.online": "We're online!",
    "chat.offline": "Leave us a message",
    "chat.placeholder": "Type your message...",
    "chat.send": "Send",
    "chat.greeting": "Hello! How can we help you today?",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.services": "Servicios",
    "nav.track": "Rastrear",
    "nav.quote": "Cotización",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    
    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.close": "Cerrar",
    "common.submit": "Enviar",
    "common.cancel": "Cancelar",
    
    // Chat
    "chat.title": "Chat con Soporte",
    "chat.online": "¡Estamos en línea!",
    "chat.offline": "Déjanos un mensaje",
    "chat.placeholder": "Escribe tu mensaje...",
    "chat.send": "Enviar",
    "chat.greeting": "¡Hola! ¿Cómo podemos ayudarte hoy?",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "en" || saved === "es")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}