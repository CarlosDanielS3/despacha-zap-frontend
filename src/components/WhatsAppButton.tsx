import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const whatsappUrl = "https://api.whatsapp.com/send/?phone=%2B5547988847588&text=Quero%20consultar&type=phone_number&app_absent=0&ice_breaker=quero%20%consultar";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 md:w-16 md:h-16"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
    </a>
  );
};

export default WhatsAppButton;
