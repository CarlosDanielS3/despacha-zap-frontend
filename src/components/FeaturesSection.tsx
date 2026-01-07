import { 
  Car, 
  FileText, 
  DollarSign, 
  Gauge,
  Wrench,
  Ban,
  MapPin,
  CheckCircle2
} from "lucide-react";

const features = [
  { icon: DollarSign, title: "Débitos e Multas", description: "Pendências financeiras do veículo" },
  { icon: FileText, title: "Dados Cadastrais", description: "Informações completas do veículo" },
  { icon: Ban, title: "Restrições", description: "Impedimentos administrativos e jurídicos" },
  { icon: Gauge, title: "Histórico de KM", description: "Quilometragem registrada" },
  { icon: Car, title: "Ficha Técnica", description: "Especificações completas" },
  { icon: Wrench, title: "Recall", description: "Chamados de fábrica pendentes" },
  { icon: MapPin, title: "Gravame", description: "Status de financiamento" },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Recursos Completos
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Tudo que você precisa saber sobre o veículo
          </h2>
          <p className="text-lg text-muted-foreground">
            A consulta mais completa do mercado, com informações exclusivas que te ajudam a negociar com segurança.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
              <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-success opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
