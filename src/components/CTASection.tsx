import { ArrowRight, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-24">
      {/* Background decorations */}
      <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-primary-foreground">
              <Zap className="h-3.5 w-3.5" />
              Resultado Instantâneo
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-primary-foreground">
              <Shield className="h-3.5 w-3.5" />
              100% Seguro
            </span>
          </div>

          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
            Não compre um carro às cegas
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80">
            Faça uma consulta agora e descubra tudo sobre o veículo antes de fechar negócio.
            Evite prejuízos e negocie com confiança.
          </p>

          <Button
            size="lg"
            className="gap-2 bg-white px-8 text-base font-semibold text-primary shadow-lg transition-all hover:scale-[1.02] hover:bg-white/90"
            onClick={scrollToTop}
          >
            Consultar Veículo Agora
            <ArrowRight className="h-5 w-5" />
          </Button>

          <p className="mt-4 text-sm text-primary-foreground/60">
            Pagamento único • Sem mensalidades • Resultado imediato
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
