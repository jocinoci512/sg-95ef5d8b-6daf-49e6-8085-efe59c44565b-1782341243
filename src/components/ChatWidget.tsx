import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

const faqDatabase = {
  en: {
    shipping_times: {
      keywords: ["long", "time", "days", "how long", "transit", "delivery time", "when"],
      answer: "Domestic shipments typically take 3-7 days. Expedited shipping takes 1-3 days. International shipping varies by destination, usually 14-30 days including customs clearance."
    },
    shipping_methods: {
      keywords: ["methods", "options", "carrier", "open", "enclosed", "expedited", "international"],
      answer: "We offer Open Carrier (most economical), Enclosed Carrier (premium protection), Expedited Transport (1-3 days), International Shipping, Motorcycle Transport, and Heavy Equipment Transport."
    },
    quote: {
      keywords: ["quote", "price", "cost", "estimate", "how much"],
      answer: "You can request a free instant quote on our website by visiting the 'Get Quote' page. Just provide pickup/delivery locations and vehicle details. You can also use our Shipping Calculator on the Services page."
    },
    coverage: {
      keywords: ["areas", "locations", "where", "countries", "states", "international", "serve"],
      answer: "We serve all 50 US states, Alaska, Hawaii, Puerto Rico, and over 50 countries worldwide including Canada, Mexico, Europe, Asia, Australia, South America, and the Middle East."
    },
    tracking: {
      keywords: ["track", "tracking", "number", "where is", "status", "location", "gps"],
      answer: "Track your shipment 24/7 using your unique tracking number on our Track Shipment page. You'll get real-time GPS updates, status notifications, and estimated delivery times. Email and SMS notifications are also available."
    },
    status_meaning: {
      keywords: ["status", "mean", "pending", "transit", "delivered", "pickup"],
      answer: "Shipment statuses: Pending (quote accepted, awaiting pickup), In Transit (on the way), Out for Delivery (arriving soon), Delivered (completed). You can view detailed tracking events in your customer portal."
    },
    fees: {
      keywords: ["fees", "additional", "hidden", "extra", "charges"],
      answer: "We provide transparent pricing with no hidden fees. The quote includes pickup, transport, and delivery. Optional services like expedited shipping or additional insurance are clearly listed."
    },
    documents: {
      keywords: ["documents", "paperwork", "required", "need", "title", "registration"],
      answer: "For domestic transport: valid ID, vehicle title or registration, and proof of insurance. For international shipping: original title, bill of sale, export declaration, and destination country import permits. Our team provides a complete checklist."
    },
    download_documents: {
      keywords: ["download", "bill", "lading", "receipt", "invoice"],
      answer: "You can download all shipping documents from your customer portal. Go to Portal → Shipments → Select your shipment → Documents tab. Bills of lading, receipts, and insurance certificates are available there."
    },
    account: {
      keywords: ["account", "register", "sign up", "create"],
      answer: "Create an account by clicking 'Sign Up' in the top navigation. You'll need an email address and password. Your account gives you access to quotes, shipment tracking, documents, and support."
    },
    login: {
      keywords: ["login", "sign in", "access", "portal"],
      answer: "Click 'Login' in the top navigation to access your customer portal. Use the email and password you created during registration. If you forgot your password, use the 'Forgot Password' link."
    },
    password_reset: {
      keywords: ["password", "reset", "forgot", "recover"],
      answer: "Click 'Login' → 'Forgot Password' and enter your email address. You'll receive a password reset link. Follow the link to create a new password."
    },
    support: {
      keywords: ["contact", "support", "help", "phone", "email"],
      answer: "Contact us 24/7 at +1 (800) 555-0123 or email info@gocargologistics.com. You can also use the Contact page to submit a message. Our average response time is under 2 hours."
    },
    hours: {
      keywords: ["hours", "open", "available", "business hours"],
      answer: "Our operations run 24/7. Office hours are Monday-Friday 8 AM - 6 PM PST. Weekend support is available Saturday-Sunday 9 AM - 5 PM PST. Phone and chat support are always available."
    },
  },
  es: {
    shipping_times: {
      keywords: ["cuánto", "tiempo", "días", "cuanto tiempo", "tránsito", "entrega", "cuando"],
      answer: "Los envíos domésticos generalmente toman 3-7 días. El envío acelerado toma 1-3 días. El envío internacional varía según el destino, generalmente 14-30 días incluido el despacho de aduanas."
    },
    shipping_methods: {
      keywords: ["métodos", "opciones", "transportista", "abierto", "cerrado", "acelerado", "internacional"],
      answer: "Ofrecemos Transportista Abierto (más económico), Transportista Cerrado (protección premium), Transporte Acelerado (1-3 días), Envío Internacional, Transporte de Motocicletas y Transporte de Equipo Pesado."
    },
    quote: {
      keywords: ["cotización", "precio", "costo", "estimación", "cuánto cuesta"],
      answer: "Puede solicitar una cotización instantánea gratuita en nuestro sitio web visitando la página 'Obtener Cotización'. Solo proporcione ubicaciones de recogida/entrega y detalles del vehículo. También puede usar nuestra Calculadora de Envío en la página de Servicios."
    },
    coverage: {
      keywords: ["áreas", "ubicaciones", "dónde", "países", "estados", "internacional", "servir"],
      answer: "Servimos todos los 50 estados de EE.UU., Alaska, Hawái, Puerto Rico y más de 50 países en todo el mundo, incluidos Canadá, México, Europa, Asia, Australia, América del Sur y Medio Oriente."
    },
    tracking: {
      keywords: ["rastrear", "rastreo", "número", "dónde está", "estado", "ubicación", "gps"],
      answer: "Rastree su envío 24/7 usando su número de rastreo único en nuestra página de Rastreo de Envíos. Obtendrá actualizaciones GPS en tiempo real, notificaciones de estado y tiempos estimados de entrega. Las notificaciones por email y SMS también están disponibles."
    },
    status_meaning: {
      keywords: ["estado", "significa", "pendiente", "tránsito", "entregado", "recogida"],
      answer: "Estados de envío: Pendiente (cotización aceptada, esperando recogida), En Tránsito (en camino), Listo para Entrega (llegando pronto), Entregado (completado). Puede ver eventos de rastreo detallados en su portal de cliente."
    },
    fees: {
      keywords: ["tarifas", "adicionales", "ocultas", "extra", "cargos"],
      answer: "Proporcionamos precios transparentes sin tarifas ocultas. La cotización incluye recogida, transporte y entrega. Los servicios opcionales como envío acelerado o seguro adicional se enumeran claramente."
    },
    documents: {
      keywords: ["documentos", "papeleo", "requeridos", "necesito", "título", "registro"],
      answer: "Para transporte doméstico: identificación válida, título del vehículo o registro, y prueba de seguro. Para envío internacional: título original, factura de venta, declaración de exportación y permisos de importación del país de destino. Nuestro equipo proporciona una lista completa."
    },
    account: {
      keywords: ["cuenta", "registrar", "inscribirse", "crear"],
      answer: "Cree una cuenta haciendo clic en 'Registrarse' en la navegación superior. Necesitará una dirección de email y contraseña. Su cuenta le da acceso a cotizaciones, rastreo de envíos, documentos y soporte."
    },
    support: {
      keywords: ["contacto", "soporte", "ayuda", "teléfono", "email"],
      answer: "Contáctenos 24/7 al +1 (800) 555-0123 o envíe un email a info@gocargologistics.com. También puede usar la página de Contacto para enviar un mensaje. Nuestro tiempo promedio de respuesta es de menos de 2 horas."
    },
  },
  fr: {
    shipping_times: {
      keywords: ["combien", "temps", "jours", "combien de temps", "transit", "livraison", "quand"],
      answer: "Les expéditions domestiques prennent généralement 3-7 jours. L'expédition accélérée prend 1-3 jours. L'expédition internationale varie selon la destination, généralement 14-30 jours incluant le dédouanement."
    },
    shipping_methods: {
      keywords: ["méthodes", "options", "transporteur", "ouvert", "fermé", "accéléré", "international"],
      answer: "Nous offrons Transporteur Ouvert (le plus économique), Transporteur Fermé (protection premium), Transport Accéléré (1-3 jours), Expédition Internationale, Transport de Motos et Transport d'Équipement Lourd."
    },
    quote: {
      keywords: ["devis", "prix", "coût", "estimation", "combien"],
      answer: "Vous pouvez demander un devis instantané gratuit sur notre site web en visitant la page 'Obtenir un Devis'. Fournissez simplement les emplacements de ramassage/livraison et les détails du véhicule. Vous pouvez également utiliser notre Calculateur d'Expédition sur la page Services."
    },
    coverage: {
      keywords: ["zones", "emplacements", "où", "pays", "états", "international", "servir"],
      answer: "Nous desservons les 50 états américains, l'Alaska, Hawaï, Porto Rico et plus de 50 pays dans le monde, y compris le Canada, le Mexique, l'Europe, l'Asie, l'Australie, l'Amérique du Sud et le Moyen-Orient."
    },
    tracking: {
      keywords: ["suivre", "suivi", "numéro", "où est", "statut", "emplacement", "gps"],
      answer: "Suivez votre expédition 24/7 en utilisant votre numéro de suivi unique sur notre page de Suivi d'Envoi. Vous recevrez des mises à jour GPS en temps réel, des notifications de statut et des délais de livraison estimés. Les notifications par email et SMS sont également disponibles."
    },
    support: {
      keywords: ["contact", "support", "aide", "téléphone", "email"],
      answer: "Contactez-nous 24/7 au +1 (800) 555-0123 ou par email à info@gocargologistics.com. Vous pouvez également utiliser la page Contact pour soumettre un message. Notre temps de réponse moyen est inférieur à 2 heures."
    },
  },
  de: {
    shipping_times: {
      keywords: ["wie lange", "zeit", "tage", "wie lang", "transit", "lieferung", "wann"],
      answer: "Inlandsversand dauert in der Regel 3-7 Tage. Expressversand dauert 1-3 Tage. Internationaler Versand variiert je nach Zielort, normalerweise 14-30 Tage einschließlich Zollabfertigung."
    },
    shipping_methods: {
      keywords: ["methoden", "optionen", "transporter", "offen", "geschlossen", "express", "international"],
      answer: "Wir bieten Offener Transporter (am wirtschaftlichsten), Geschlossener Transporter (Premium-Schutz), Expresstransport (1-3 Tage), Internationaler Versand, Motorradtransport und Schwertransport."
    },
    quote: {
      keywords: ["angebot", "preis", "kosten", "schätzung", "wie viel"],
      answer: "Sie können ein kostenloses Sofortangebot auf unserer Website anfordern, indem Sie die Seite 'Angebot Erhalten' besuchen. Geben Sie einfach Abhol-/Lieferorte und Fahrzeugdetails an. Sie können auch unseren Versandrechner auf der Services-Seite verwenden."
    },
    coverage: {
      keywords: ["bereiche", "standorte", "wo", "länder", "staaten", "international", "bedienen"],
      answer: "Wir bedienen alle 50 US-Bundesstaaten, Alaska, Hawaii, Puerto Rico und über 50 Länder weltweit, einschließlich Kanada, Mexiko, Europa, Asien, Australien, Südamerika und dem Nahen Osten."
    },
    tracking: {
      keywords: ["verfolgen", "tracking", "nummer", "wo ist", "status", "standort", "gps"],
      answer: "Verfolgen Sie Ihre Sendung 24/7 mit Ihrer eindeutigen Sendungsnummer auf unserer Sendungsverfolgungsseite. Sie erhalten GPS-Updates in Echtzeit, Statusbenachrichtigungen und geschätzte Lieferzeiten. E-Mail- und SMS-Benachrichtigungen sind ebenfalls verfügbar."
    },
    support: {
      keywords: ["kontakt", "support", "hilfe", "telefon", "email"],
      answer: "Kontaktieren Sie uns 24/7 unter +1 (800) 555-0123 oder per E-Mail an info@gocargologistics.com. Sie können auch die Kontaktseite verwenden, um eine Nachricht zu senden. Unsere durchschnittliche Antwortzeit beträgt weniger als 2 Stunden."
    },
  },
};

export function ChatWidget() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: t("chat.greeting"),
        sender: "support",
        timestamp: new Date(),
      },
    ]);
  }, [language, t]);

  const detectQuestion = (userMessage: string): string | null => {
    const normalizedMessage = userMessage.toLowerCase();
    const currentLangDB = faqDatabase[language as keyof typeof faqDatabase] || faqDatabase.en;

    for (const [, faq] of Object.entries(currentLangDB)) {
      for (const keyword of faq.keywords) {
        if (normalizedMessage.includes(keyword.toLowerCase())) {
          return faq.answer;
        }
      }
    }

    return null;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setShowQuickReplies(false);
    const userInput = inputValue;
    setInputValue("");

    const faqAnswer = detectQuestion(userInput);

    setTimeout(() => {
      if (faqAnswer) {
        const botReply: Message = {
          id: messages.length + 2,
          text: faqAnswer,
          sender: "support",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botReply]);
      } else {
        const escalationMessages = {
          en: "Thank you for your question! A support specialist will respond shortly. For immediate assistance, please call +1 (800) 555-0123 or email info@gocargologistics.com.",
          es: "¡Gracias por su pregunta! Un especialista de soporte responderá en breve. Para asistencia inmediata, llame al +1 (800) 555-0123 o envíe un email a info@gocargologistics.com.",
          fr: "Merci pour votre question! Un spécialiste du support répondra sous peu. Pour une assistance immédiate, appelez le +1 (800) 555-0123 ou envoyez un email à info@gocargologistics.com.",
          de: "Vielen Dank für Ihre Frage! Ein Support-Spezialist wird in Kürze antworten. Für sofortige Hilfe rufen Sie bitte +1 (800) 555-0123 an oder senden Sie eine E-Mail an info@gocargologistics.com.",
        };
        
        const escalationReply: Message = {
          id: messages.length + 2,
          text: escalationMessages[language as keyof typeof escalationMessages] || escalationMessages.en,
          sender: "support",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, escalationReply]);
      }
    }, 800);
  };

  const handleQuickReply = (topic: string) => {
    const quickReplyQuestions = {
      shipping: {
        en: "How long does shipping take?",
        es: "¿Cuánto tiempo toma el envío?",
        fr: "Combien de temps prend l'expédition?",
        de: "Wie lange dauert der Versand?",
      },
      tracking: {
        en: "How do I track my shipment?",
        es: "¿Cómo rastreo mi envío?",
        fr: "Comment puis-je suivre mon envoi?",
        de: "Wie verfolge ich meine Sendung?",
      },
      pricing: {
        en: "How is shipping cost calculated?",
        es: "¿Cómo se calcula el costo de envío?",
        fr: "Comment le coût d'expédition est-il calculé?",
        de: "Wie werden die Versandkosten berechnet?",
      },
      documents: {
        en: "What documents are required?",
        es: "¿Qué documentos se requieren?",
        fr: "Quels documents sont requis?",
        de: "Welche Dokumente werden benötigt?",
      },
    };

    const question = quickReplyQuestions[topic as keyof typeof quickReplyQuestions][language as keyof typeof quickReplyQuestions.shipping];
    setInputValue(question);
    handleSend();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="outline"
          onClick={() => setIsMinimized(false)}
          className="shadow-lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          {t("chat.title")}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]">
      <Card className="border-border shadow-xl">
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold">{t("chat.title")}</div>
              <div className="text-xs opacity-90">{t("chat.online")}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="h-[400px] overflow-y-auto p-4 bg-background space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {showQuickReplies && messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">{t("chat.askQuestion")}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply("shipping")}
                  className="text-xs h-auto py-2"
                >
                  {t("chat.shipping")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply("tracking")}
                  className="text-xs h-auto py-2"
                >
                  {t("chat.tracking")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply("pricing")}
                  className="text-xs h-auto py-2"
                >
                  {t("chat.pricing")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply("documents")}
                  className="text-xs h-auto py-2"
                >
                  {t("chat.documents")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              placeholder={t("chat.placeholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-background"
            />
            <Button onClick={handleSend} size="sm" className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}