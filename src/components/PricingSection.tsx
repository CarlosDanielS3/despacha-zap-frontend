import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const PricingSection = () => {
  const features = [
    "Todos dados do veículo",
    "Débitos e multas",
    "Restrições administrativas ou jurídicas",
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            Nossa Consulta
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Dados Cadastrais
          </h2>
          <p className="text-lg text-muted-foreground">
            Acesse todas as informações do veículo em um único relatório.
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-card p-8 shadow-primary transition-all duration-300 hover:-translate-y-1">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-foreground">Dados Cadastrais</h3>
              <p className="text-muted-foreground">
                Consulta completa com todas as informações do veículo.
              </p>
            </div>

            <ul className="mb-8 space-y-4">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full bg-primary py-6 text-lg shadow-primary hover:bg-primary/90"
              onClick={scrollToTop}
            >
              Consultar Agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
