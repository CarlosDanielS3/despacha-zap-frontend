import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Eduardo",
    role: "Comprou um Honda Civic",
    content: "Descobri que o carro tinha passagem por leilão antes de fechar o negócio. Economizei mais de R$ 10.000!",
    rating: 5,
  },
  {
    name: "Ana Paula",
    role: "Vendedora de veículos",
    content: "Uso diariamente na loja. Os clientes confiam mais quando mostro o relatório completo do veículo.",
    rating: 5,
  },
  {
    name: "Roberto Silva",
    role: "Comprou um Corolla",
    content: "O histórico de KM mostrou que o odômetro tinha sido adulterado. Evitei uma grande dor de cabeça!",
    rating: 5,
  },
  {
    name: "Mariana Costa",
    role: "Primeira compra",
    content: "Super fácil de usar. Em 2 minutos tive acesso a todas as informações que precisava.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-warning/10 px-4 py-1.5 text-sm font-medium text-warning">
            Depoimentos
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-muted-foreground">
            Milhares de pessoas já economizaram dinheiro e evitaram problemas com nossas consultas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-border/50 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
              
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-primary" />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
