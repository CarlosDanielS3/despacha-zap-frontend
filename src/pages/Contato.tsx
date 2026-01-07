import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contato = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=%2B5547988847588&text=${encodedMessage}&type=phone_number&app_absent=0&ice_breaker=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-500">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
                Fale Conosco
              </h1>
              <p className="text-lg text-muted-foreground">
                Envie sua mensagem e entraremos em contato via WhatsApp
              </p>
            </div>

            {/* Form */}
            <div className="rounded-2xl border bg-card p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                    Sua mensagem
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Digite aqui sua dúvida, sugestão ou mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className="resize-none text-base"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-lg font-semibold hover:from-blue-600 hover:to-green-600"
                  disabled={!message.trim()}
                >
                  <Send className="h-5 w-5" />
                  Enviar via WhatsApp
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Você será redirecionado para o WhatsApp com sua mensagem
                </p>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 font-semibold text-foreground">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  +55 47 98884-7588
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 font-semibold text-foreground">Horário de Atendimento</h3>
                <p className="text-sm text-muted-foreground">
                  Segunda a Sexta: 9h às 18h
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
