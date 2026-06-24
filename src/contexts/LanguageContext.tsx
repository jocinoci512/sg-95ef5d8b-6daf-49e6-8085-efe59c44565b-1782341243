import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "es" | "fr" | "de";

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
    
    // Hero
    "hero.title": "Professional Logistics Solutions",
    "hero.subtitle": "Worldwide Shipping Excellence",
    "hero.description": "Secure, reliable transportation services for vehicles, freight, and heavy equipment. Trusted by thousands of customers across the globe.",
    "hero.getQuote": "Get Instant Quote",
    "hero.trackShipment": "Track Shipment",
    
    // Trust Badges
    "trust.licensed": "Licensed & Insured",
    "trust.verified": "Verified Carriers",
    "trust.worldwide": "Worldwide Coverage",
    "trust.support": "24/7 Support",
    "trust.excellence": "Industry Excellence",
    "trust.service": "5-Star Service",
    
    // Stats
    "stats.title": "Trusted by Thousands",
    "stats.subtitle": "Over two decades of excellence in logistics and transportation",
    "stats.years": "Years Experience",
    "stats.shipments": "Shipments Completed",
    "stats.ontime": "On-Time Delivery",
    "stats.countries": "Countries Served",
    
    // Track
    "track.title": "Track Your Shipment",
    "track.description": "Enter your tracking number for real-time shipment updates",
    "track.placeholder": "Enter tracking number (e.g., GCL-12345)",
    "track.button": "Track Shipment",
    
    // Services
    "services.title": "Comprehensive Logistics Services",
    "services.subtitle": "End-to-end transportation solutions for all your shipping needs",
    "services.learnMore": "Learn More",
    "services.getQuote": "Get Quote",
    
    "service.auto.title": "Auto Transport",
    "service.auto.desc": "Safe and reliable vehicle shipping nationwide. Open and enclosed carrier options available.",
    
    "service.international.title": "International Shipping",
    "service.international.desc": "Global freight forwarding with customs clearance and door-to-door delivery worldwide.",
    
    "service.heavy.title": "Heavy Equipment",
    "service.heavy.desc": "Specialized transport for construction equipment, machinery, and oversized cargo.",
    
    "service.motorcycle.title": "Motorcycle Transport",
    "service.motorcycle.desc": "Professional motorcycle shipping with secure loading and specialized equipment.",
    
    "service.enclosed.title": "Enclosed Carrier",
    "service.enclosed.desc": "Premium enclosed transport for luxury, classic, and high-value vehicles.",
    
    "service.fleet.title": "Fleet Transportation",
    "service.fleet.desc": "Multi-vehicle transport solutions for dealerships and corporate fleets.",
    
    // Why Choose Us
    "why.title": "Why Choose Go Cargo Logistics",
    "why.subtitle": "Industry-leading service backed by decades of experience",
    
    // Testimonials
    "testimonials.title": "What Our Customers Say",
    "testimonials.subtitle": "Trusted by thousands of satisfied customers worldwide",
    
    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Find answers to common questions about our shipping services",
    
    // Coverage
    "coverage.title": "Nationwide & Worldwide Coverage",
    "coverage.description": "Our extensive carrier network provides comprehensive coverage across all 50 U.S. states and over 50 countries worldwide.",
    
    // CTA
    "cta.ready": "Ready to Ship?",
    "cta.description": "Get an instant quote, track your shipment, or speak with a logistics specialist today.",
    "cta.requestQuote": "Request Quote",
    "cta.contactUs": "Contact Us",
    
    // Footer
    "footer.company": "Go Cargo Logistics",
    "footer.description": "Professional logistics and transportation services for vehicles, freight, and heavy equipment worldwide.",
    "footer.quickLinks": "Quick Links",
    "footer.services": "Our Services",
    "footer.resources": "Customer Resources",
    "footer.customerLogin": "Customer Login",
    "footer.createAccount": "Create Account",
    "footer.tracking": "Shipment Tracking",
    "footer.faqs": "FAQs",
    "footer.supportCenter": "Support Center",
    "footer.shippingResources": "Shipping Resources",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.sitemap": "Sitemap",
    
    // Contact
    "contact.title": "Contact Our Team",
    "contact.subtitle": "Available 24/7 to answer your questions and provide expert logistics support",
    "contact.getInTouch": "Get In Touch",
    "contact.sendMessage": "Send Us a Message",
    "contact.fullName": "Full Name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.close": "Close",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    
    // Chat
    "chat.title": "Chat with Support",
    "chat.online": "We're online!",
    "chat.offline": "Leave us a message",
    "chat.placeholder": "Type your message...",
    "chat.send": "Send",
    "chat.greeting": "Hello! How can we help you today?",
    "chat.askQuestion": "Ask me about:",
    "chat.shipping": "Shipping times",
    "chat.tracking": "Tracking shipments",
    "chat.pricing": "Pricing info",
    "chat.documents": "Documentation",
    
    // Calculator
    "calc.title": "Shipping Cost Calculator",
    "calc.description": "Get an instant estimate for your shipment",
    "calc.pickupLocation": "Pickup Location",
    "calc.deliveryLocation": "Delivery Location",
    "calc.vehicleType": "Vehicle Type",
    "calc.shippingMethod": "Shipping Method",
    "calc.expedited": "Expedited Shipping",
    "calc.calculate": "Calculate Cost",
    "calc.estimatedCost": "Estimated Cost",
    "calc.transitTime": "Transit Time",
    "calc.distance": "Distance",
    "calc.currency": "Currency",
    "calc.basePrice": "Base Price",
    "calc.days": "days",
    "calc.miles": "miles",
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
    
    // Hero
    "hero.title": "Soluciones Logísticas Profesionales",
    "hero.subtitle": "Excelencia en Envíos Mundiales",
    "hero.description": "Servicios de transporte seguros y confiables para vehículos, carga y equipo pesado. Confiado por miles de clientes en todo el mundo.",
    "hero.getQuote": "Obtener Cotización",
    "hero.trackShipment": "Rastrear Envío",
    
    // Trust Badges
    "trust.licensed": "Licenciado y Asegurado",
    "trust.verified": "Transportistas Verificados",
    "trust.worldwide": "Cobertura Mundial",
    "trust.support": "Soporte 24/7",
    "trust.excellence": "Excelencia Industrial",
    "trust.service": "Servicio 5 Estrellas",
    
    // Stats
    "stats.title": "Confiado por Miles",
    "stats.subtitle": "Más de dos décadas de excelencia en logística y transporte",
    "stats.years": "Años de Experiencia",
    "stats.shipments": "Envíos Completados",
    "stats.ontime": "Entrega a Tiempo",
    "stats.countries": "Países Atendidos",
    
    // Track
    "track.title": "Rastree Su Envío",
    "track.description": "Ingrese su número de rastreo para actualizaciones en tiempo real",
    "track.placeholder": "Ingrese número de rastreo (ej., GCL-12345)",
    "track.button": "Rastrear Envío",
    
    // Services
    "services.title": "Servicios Logísticos Integrales",
    "services.subtitle": "Soluciones de transporte completas para todas sus necesidades de envío",
    "services.learnMore": "Más Información",
    "services.getQuote": "Obtener Cotización",
    
    "service.auto.title": "Transporte de Automóviles",
    "service.auto.desc": "Envío de vehículos seguro y confiable a nivel nacional. Opciones de transportista abierto y cerrado disponibles.",
    
    "service.international.title": "Envío Internacional",
    "service.international.desc": "Transporte de carga global con despacho de aduanas y entrega puerta a puerta en todo el mundo.",
    
    "service.heavy.title": "Equipo Pesado",
    "service.heavy.desc": "Transporte especializado para equipos de construcción, maquinaria y carga sobredimensionada.",
    
    "service.motorcycle.title": "Transporte de Motocicletas",
    "service.motorcycle.desc": "Envío profesional de motocicletas con carga segura y equipo especializado.",
    
    "service.enclosed.title": "Transportista Cerrado",
    "service.enclosed.desc": "Transporte cerrado premium para vehículos de lujo, clásicos y de alto valor.",
    
    "service.fleet.title": "Transporte de Flotas",
    "service.fleet.desc": "Soluciones de transporte de múltiples vehículos para concesionarios y flotas corporativas.",
    
    // Why Choose Us
    "why.title": "Por Qué Elegir Go Cargo Logistics",
    "why.subtitle": "Servicio líder en la industria respaldado por décadas de experiencia",
    
    // Testimonials
    "testimonials.title": "Lo Que Dicen Nuestros Clientes",
    "testimonials.subtitle": "Confiado por miles de clientes satisfechos en todo el mundo",
    
    // FAQ
    "faq.title": "Preguntas Frecuentes",
    "faq.subtitle": "Encuentre respuestas a preguntas comunes sobre nuestros servicios de envío",
    
    // Coverage
    "coverage.title": "Cobertura Nacional y Mundial",
    "coverage.description": "Nuestra extensa red de transportistas proporciona cobertura completa en los 50 estados de EE.UU. y más de 50 países en todo el mundo.",
    
    // CTA
    "cta.ready": "¿Listo para Enviar?",
    "cta.description": "Obtenga una cotización instantánea, rastree su envío o hable con un especialista en logística hoy.",
    "cta.requestQuote": "Solicitar Cotización",
    "cta.contactUs": "Contáctenos",
    
    // Footer
    "footer.company": "Go Cargo Logistics",
    "footer.description": "Servicios profesionales de logística y transporte para vehículos, carga y equipo pesado en todo el mundo.",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.services": "Nuestros Servicios",
    "footer.resources": "Recursos para Clientes",
    "footer.customerLogin": "Inicio de Sesión del Cliente",
    "footer.createAccount": "Crear Cuenta",
    "footer.tracking": "Rastreo de Envíos",
    "footer.faqs": "Preguntas Frecuentes",
    "footer.supportCenter": "Centro de Soporte",
    "footer.shippingResources": "Recursos de Envío",
    "footer.rights": "Todos los derechos reservados.",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos de Servicio",
    "footer.sitemap": "Mapa del Sitio",
    
    // Contact
    "contact.title": "Contacte a Nuestro Equipo",
    "contact.subtitle": "Disponible 24/7 para responder sus preguntas y proporcionar soporte logístico experto",
    "contact.getInTouch": "Póngase en Contacto",
    "contact.sendMessage": "Envíenos un Mensaje",
    "contact.fullName": "Nombre Completo",
    "contact.email": "Correo Electrónico",
    "contact.phone": "Número de Teléfono",
    "contact.subject": "Asunto",
    "contact.message": "Mensaje",
    "contact.send": "Enviar Mensaje",
    "contact.sending": "Enviando...",
    
    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.close": "Cerrar",
    "common.submit": "Enviar",
    "common.cancel": "Cancelar",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.all": "Todos",
    
    // Chat
    "chat.title": "Chat con Soporte",
    "chat.online": "¡Estamos en línea!",
    "chat.offline": "Déjanos un mensaje",
    "chat.placeholder": "Escribe tu mensaje...",
    "chat.send": "Enviar",
    "chat.greeting": "¡Hola! ¿Cómo podemos ayudarte hoy?",
    "chat.askQuestion": "Pregúntame sobre:",
    "chat.shipping": "Tiempos de envío",
    "chat.tracking": "Rastreo de envíos",
    "chat.pricing": "Información de precios",
    "chat.documents": "Documentación",
    
    // Calculator
    "calc.title": "Calculadora de Costos de Envío",
    "calc.description": "Obtenga una estimación instantánea para su envío",
    "calc.pickupLocation": "Ubicación de Recogida",
    "calc.deliveryLocation": "Ubicación de Entrega",
    "calc.vehicleType": "Tipo de Vehículo",
    "calc.shippingMethod": "Método de Envío",
    "calc.expedited": "Envío Acelerado",
    "calc.calculate": "Calcular Costo",
    "calc.estimatedCost": "Costo Estimado",
    "calc.transitTime": "Tiempo de Tránsito",
    "calc.distance": "Distancia",
    "calc.currency": "Moneda",
    "calc.basePrice": "Precio Base",
    "calc.days": "días",
    "calc.miles": "millas",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.about": "À Propos",
    "nav.services": "Services",
    "nav.track": "Suivre",
    "nav.quote": "Devis",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.login": "Connexion",
    "nav.signup": "S'inscrire",
    
    // Hero
    "hero.title": "Solutions Logistiques Professionnelles",
    "hero.subtitle": "Excellence en Expédition Mondiale",
    "hero.description": "Services de transport sécurisés et fiables pour véhicules, fret et équipement lourd. Approuvé par des milliers de clients à travers le monde.",
    "hero.getQuote": "Obtenir un Devis",
    "hero.trackShipment": "Suivre l'Envoi",
    
    // Trust Badges
    "trust.licensed": "Licencié et Assuré",
    "trust.verified": "Transporteurs Vérifiés",
    "trust.worldwide": "Couverture Mondiale",
    "trust.support": "Support 24/7",
    "trust.excellence": "Excellence Industrielle",
    "trust.service": "Service 5 Étoiles",
    
    // Stats
    "stats.title": "Approuvé par des Milliers",
    "stats.subtitle": "Plus de deux décennies d'excellence en logistique et transport",
    "stats.years": "Années d'Expérience",
    "stats.shipments": "Expéditions Réalisées",
    "stats.ontime": "Livraison à Temps",
    "stats.countries": "Pays Desservis",
    
    // Track
    "track.title": "Suivez Votre Envoi",
    "track.description": "Entrez votre numéro de suivi pour des mises à jour en temps réel",
    "track.placeholder": "Entrez le numéro de suivi (ex., GCL-12345)",
    "track.button": "Suivre l'Envoi",
    
    // Services
    "services.title": "Services Logistiques Complets",
    "services.subtitle": "Solutions de transport de bout en bout pour tous vos besoins d'expédition",
    "services.learnMore": "En Savoir Plus",
    "services.getQuote": "Obtenir un Devis",
    
    "service.auto.title": "Transport Automobile",
    "service.auto.desc": "Expédition de véhicules sûre et fiable à l'échelle nationale. Options de transporteur ouvert et fermé disponibles.",
    
    "service.international.title": "Expédition Internationale",
    "service.international.desc": "Transport de fret mondial avec dédouanement et livraison porte-à-porte dans le monde entier.",
    
    "service.heavy.title": "Équipement Lourd",
    "service.heavy.desc": "Transport spécialisé pour équipements de construction, machines et cargaisons surdimensionnées.",
    
    "service.motorcycle.title": "Transport de Motos",
    "service.motorcycle.desc": "Expédition professionnelle de motos avec chargement sécurisé et équipement spécialisé.",
    
    "service.enclosed.title": "Transporteur Fermé",
    "service.enclosed.desc": "Transport fermé premium pour véhicules de luxe, classiques et de grande valeur.",
    
    "service.fleet.title": "Transport de Flottes",
    "service.fleet.desc": "Solutions de transport multi-véhicules pour concessionnaires et flottes d'entreprise.",
    
    // Why Choose Us
    "why.title": "Pourquoi Choisir Go Cargo Logistics",
    "why.subtitle": "Service leader de l'industrie soutenu par des décennies d'expérience",
    
    // Testimonials
    "testimonials.title": "Ce Que Disent Nos Clients",
    "testimonials.subtitle": "Approuvé par des milliers de clients satisfaits dans le monde entier",
    
    // FAQ
    "faq.title": "Questions Fréquemment Posées",
    "faq.subtitle": "Trouvez des réponses aux questions courantes sur nos services d'expédition",
    
    // Coverage
    "coverage.title": "Couverture Nationale et Mondiale",
    "coverage.description": "Notre vaste réseau de transporteurs offre une couverture complète dans les 50 états américains et plus de 50 pays dans le monde.",
    
    // CTA
    "cta.ready": "Prêt à Expédier?",
    "cta.description": "Obtenez un devis instantané, suivez votre envoi ou parlez à un spécialiste en logistique dès aujourd'hui.",
    "cta.requestQuote": "Demander un Devis",
    "cta.contactUs": "Contactez-Nous",
    
    // Footer
    "footer.company": "Go Cargo Logistics",
    "footer.description": "Services professionnels de logistique et de transport pour véhicules, fret et équipement lourd dans le monde entier.",
    "footer.quickLinks": "Liens Rapides",
    "footer.services": "Nos Services",
    "footer.resources": "Ressources Clients",
    "footer.customerLogin": "Connexion Client",
    "footer.createAccount": "Créer un Compte",
    "footer.tracking": "Suivi d'Envoi",
    "footer.faqs": "FAQ",
    "footer.supportCenter": "Centre de Support",
    "footer.shippingResources": "Ressources d'Expédition",
    "footer.rights": "Tous droits réservés.",
    "footer.privacy": "Politique de Confidentialité",
    "footer.terms": "Conditions d'Utilisation",
    "footer.sitemap": "Plan du Site",
    
    // Contact
    "contact.title": "Contactez Notre Équipe",
    "contact.subtitle": "Disponible 24/7 pour répondre à vos questions et fournir un support logistique expert",
    "contact.getInTouch": "Entrer en Contact",
    "contact.sendMessage": "Envoyez-Nous un Message",
    "contact.fullName": "Nom Complet",
    "contact.email": "Adresse Email",
    "contact.phone": "Numéro de Téléphone",
    "contact.subject": "Sujet",
    "contact.message": "Message",
    "contact.send": "Envoyer le Message",
    "contact.sending": "Envoi en cours...",
    
    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.close": "Fermer",
    "common.submit": "Soumettre",
    "common.cancel": "Annuler",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.all": "Tous",
    
    // Chat
    "chat.title": "Chat avec le Support",
    "chat.online": "Nous sommes en ligne!",
    "chat.offline": "Laissez-nous un message",
    "chat.placeholder": "Tapez votre message...",
    "chat.send": "Envoyer",
    "chat.greeting": "Bonjour! Comment pouvons-nous vous aider aujourd'hui?",
    "chat.askQuestion": "Demandez-moi à propos de:",
    "chat.shipping": "Délais d'expédition",
    "chat.tracking": "Suivi des envois",
    "chat.pricing": "Informations sur les prix",
    "chat.documents": "Documentation",
    
    // Calculator
    "calc.title": "Calculateur de Coûts d'Expédition",
    "calc.description": "Obtenez une estimation instantanée pour votre envoi",
    "calc.pickupLocation": "Lieu de Ramassage",
    "calc.deliveryLocation": "Lieu de Livraison",
    "calc.vehicleType": "Type de Véhicule",
    "calc.shippingMethod": "Méthode d'Expédition",
    "calc.expedited": "Expédition Accélérée",
    "calc.calculate": "Calculer le Coût",
    "calc.estimatedCost": "Coût Estimé",
    "calc.transitTime": "Temps de Transit",
    "calc.distance": "Distance",
    "calc.currency": "Devise",
    "calc.basePrice": "Prix de Base",
    "calc.days": "jours",
    "calc.miles": "milles",
  },
  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.about": "Über Uns",
    "nav.services": "Dienstleistungen",
    "nav.track": "Verfolgen",
    "nav.quote": "Angebot",
    "nav.blog": "Blog",
    "nav.contact": "Kontakt",
    "nav.login": "Anmelden",
    "nav.signup": "Registrieren",
    
    // Hero
    "hero.title": "Professionelle Logistiklösungen",
    "hero.subtitle": "Weltweite Versandexzellenz",
    "hero.description": "Sichere, zuverlässige Transportdienste für Fahrzeuge, Fracht und Schwertransporte. Vertraut von Tausenden von Kunden weltweit.",
    "hero.getQuote": "Angebot Erhalten",
    "hero.trackShipment": "Sendung Verfolgen",
    
    // Trust Badges
    "trust.licensed": "Lizenziert & Versichert",
    "trust.verified": "Verifizierte Spediteure",
    "trust.worldwide": "Weltweite Abdeckung",
    "trust.support": "24/7 Support",
    "trust.excellence": "Branchenexzellenz",
    "trust.service": "5-Sterne-Service",
    
    // Stats
    "stats.title": "Vertraut von Tausenden",
    "stats.subtitle": "Über zwei Jahrzehnte Exzellenz in Logistik und Transport",
    "stats.years": "Jahre Erfahrung",
    "stats.shipments": "Abgeschlossene Sendungen",
    "stats.ontime": "Pünktliche Lieferung",
    "stats.countries": "Bediente Länder",
    
    // Track
    "track.title": "Verfolgen Sie Ihre Sendung",
    "track.description": "Geben Sie Ihre Sendungsnummer für Echtzeit-Updates ein",
    "track.placeholder": "Sendungsnummer eingeben (z.B., GCL-12345)",
    "track.button": "Sendung Verfolgen",
    
    // Services
    "services.title": "Umfassende Logistikdienstleistungen",
    "services.subtitle": "End-to-End-Transportlösungen für alle Ihre Versandbedürfnisse",
    "services.learnMore": "Mehr Erfahren",
    "services.getQuote": "Angebot Erhalten",
    
    "service.auto.title": "Autotransport",
    "service.auto.desc": "Sicherer und zuverlässiger Fahrzeugversand bundesweit. Offene und geschlossene Transporteroptionen verfügbar.",
    
    "service.international.title": "Internationaler Versand",
    "service.international.desc": "Globale Frachtspedition mit Zollabfertigung und Tür-zu-Tür-Lieferung weltweit.",
    
    "service.heavy.title": "Schwertransport",
    "service.heavy.desc": "Spezialisierter Transport für Baumaschinen, Maschinen und übergroße Fracht.",
    
    "service.motorcycle.title": "Motorradtransport",
    "service.motorcycle.desc": "Professioneller Motorradversand mit sicherer Verladung und spezialisierter Ausrüstung.",
    
    "service.enclosed.title": "Geschlossener Transporter",
    "service.enclosed.desc": "Premium geschlossener Transport für Luxus-, Oldtimer- und hochwertige Fahrzeuge.",
    
    "service.fleet.title": "Flottentransport",
    "service.fleet.desc": "Multi-Fahrzeug-Transportlösungen für Händler und Unternehmensflotten.",
    
    // Why Choose Us
    "why.title": "Warum Go Cargo Logistics Wählen",
    "why.subtitle": "Branchenführender Service, unterstützt durch jahrzehntelange Erfahrung",
    
    // Testimonials
    "testimonials.title": "Was Unsere Kunden Sagen",
    "testimonials.subtitle": "Vertraut von Tausenden zufriedener Kunden weltweit",
    
    // FAQ
    "faq.title": "Häufig Gestellte Fragen",
    "faq.subtitle": "Finden Sie Antworten auf häufige Fragen zu unseren Versanddienstleistungen",
    
    // Coverage
    "coverage.title": "Bundesweite & Weltweite Abdeckung",
    "coverage.description": "Unser umfangreiches Speditionsnetzwerk bietet umfassende Abdeckung in allen 50 US-Bundesstaaten und über 50 Ländern weltweit.",
    
    // CTA
    "cta.ready": "Bereit zum Versenden?",
    "cta.description": "Erhalten Sie ein sofortiges Angebot, verfolgen Sie Ihre Sendung oder sprechen Sie noch heute mit einem Logistikspezialisten.",
    "cta.requestQuote": "Angebot Anfordern",
    "cta.contactUs": "Kontaktieren Sie Uns",
    
    // Footer
    "footer.company": "Go Cargo Logistics",
    "footer.description": "Professionelle Logistik- und Transportdienste für Fahrzeuge, Fracht und Schwertransporte weltweit.",
    "footer.quickLinks": "Schnelllinks",
    "footer.services": "Unsere Dienstleistungen",
    "footer.resources": "Kundenressourcen",
    "footer.customerLogin": "Kundenanmeldung",
    "footer.createAccount": "Konto Erstellen",
    "footer.tracking": "Sendungsverfolgung",
    "footer.faqs": "FAQs",
    "footer.supportCenter": "Support-Center",
    "footer.shippingResources": "Versandressourcen",
    "footer.rights": "Alle Rechte vorbehalten.",
    "footer.privacy": "Datenschutzrichtlinie",
    "footer.terms": "Nutzungsbedingungen",
    "footer.sitemap": "Sitemap",
    
    // Contact
    "contact.title": "Kontaktieren Sie Unser Team",
    "contact.subtitle": "24/7 verfügbar, um Ihre Fragen zu beantworten und fachkundige Logistikunterstützung zu bieten",
    "contact.getInTouch": "Kontakt Aufnehmen",
    "contact.sendMessage": "Senden Sie Uns Eine Nachricht",
    "contact.fullName": "Vollständiger Name",
    "contact.email": "E-Mail-Adresse",
    "contact.phone": "Telefonnummer",
    "contact.subject": "Betreff",
    "contact.message": "Nachricht",
    "contact.send": "Nachricht Senden",
    "contact.sending": "Senden...",
    
    // Common
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
    "common.close": "Schließen",
    "common.submit": "Absenden",
    "common.cancel": "Abbrechen",
    "common.search": "Suchen",
    "common.filter": "Filtern",
    "common.all": "Alle",
    
    // Chat
    "chat.title": "Chat mit Support",
    "chat.online": "Wir sind online!",
    "chat.offline": "Hinterlassen Sie uns eine Nachricht",
    "chat.placeholder": "Geben Sie Ihre Nachricht ein...",
    "chat.send": "Senden",
    "chat.greeting": "Hallo! Wie können wir Ihnen heute helfen?",
    "chat.askQuestion": "Fragen Sie mich nach:",
    "chat.shipping": "Versandzeiten",
    "chat.tracking": "Sendungsverfolgung",
    "chat.pricing": "Preisinformationen",
    "chat.documents": "Dokumentation",
    
    // Calculator
    "calc.title": "Versandkosten-Rechner",
    "calc.description": "Erhalten Sie eine sofortige Schätzung für Ihre Sendung",
    "calc.pickupLocation": "Abholort",
    "calc.deliveryLocation": "Lieferort",
    "calc.vehicleType": "Fahrzeugtyp",
    "calc.shippingMethod": "Versandmethode",
    "calc.expedited": "Expressversand",
    "calc.calculate": "Kosten Berechnen",
    "calc.estimatedCost": "Geschätzte Kosten",
    "calc.transitTime": "Transitzeit",
    "calc.distance": "Entfernung",
    "calc.currency": "Währung",
    "calc.basePrice": "Grundpreis",
    "calc.days": "Tage",
    "calc.miles": "Meilen",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && ["en", "es", "fr", "de"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en] || key;
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