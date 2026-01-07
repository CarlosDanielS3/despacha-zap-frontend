import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é a consulta veicular da DespachaZap?",
    answer: "É um relatório completo que traz informações importantes sobre um veículo, incluindo dados cadastrais, débitos e multas, restrições, histórico de KM, ficha técnica, recall e gravame. Ideal para quem quer comprar ou vender um carro com segurança.",
  },
  {
    question: "De onde vêm as informações da consulta?",
    answer: "Nossas informações são obtidas de bases oficiais como DETRAN e outras fontes confiáveis. Atualizamos os dados regularmente para garantir precisão.",
  },
  {
    question: "Quanto tempo leva para receber o relatório?",
    answer: "O relatório é gerado instantaneamente após a confirmação do pagamento. Em poucos segundos você terá acesso a todas as informações do veículo.",
  },
  {
    question: "A consulta funciona para qualquer veículo?",
    answer: "Sim! Nossa consulta funciona para carros, motos, caminhões e outros veículos registrados no Brasil. Basta informar a placa.",
  },
  {
    question: "Quais informações estão incluídas no relatório?",
    answer: "O relatório inclui: dados cadastrais completos, débitos e multas pendentes, restrições administrativas e judiciais, histórico de quilometragem, ficha técnica do veículo, chamados de recall pendentes e situação de gravame/financiamento.",
  },
  {
    question: "Quanto custa a consulta?",
    answer: "A consulta custa R$ 9,90 e é um pagamento único. Você terá acesso imediato a todas as informações após a confirmação do pagamento via PIX.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Dúvidas Frequentes
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Tire suas dúvidas sobre nossa consulta veicular.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border/50 bg-card px-6 shadow-soft transition-shadow hover:shadow-medium"
              >
                <AccordionTrigger className="py-5 text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
