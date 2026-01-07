import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const TermosUso = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
                Termos de Uso
              </h1>
              <p className="text-lg text-muted-foreground">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 rounded-2xl border bg-card p-8 shadow-lg md:p-12">
              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">1. Aceitação dos Termos</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Ao acessar e usar o DespachaZap, você concorda em cumprir e estar vinculado aos seguintes 
                  termos e condições de uso. Se você não concordar com qualquer parte destes termos, 
                  não deve usar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">2. Descrição do Serviço</h2>
                <p className="leading-relaxed text-muted-foreground">
                  O DespachaZap oferece serviços de consulta veicular online, fornecendo informações sobre 
                  veículos registrados no Brasil, incluindo dados cadastrais, débitos, multas e histórico. 
                  As informações são obtidas de fontes públicas e oficiais.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">3. Uso do Serviço</h2>
                <div className="space-y-3 leading-relaxed text-muted-foreground">
                  <p>Você concorda em:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Fornecer informações precisas e atualizadas ao utilizar o serviço</li>
                    <li>Usar o serviço apenas para fins legais e legítimos</li>
                    <li>Não compartilhar os relatórios obtidos sem autorização</li>
                    <li>Não tentar acessar áreas restritas do sistema</li>
                    <li>Não usar o serviço para spam ou atividades fraudulentas</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">4. Pagamento e Reembolso</h2>
                <p className="leading-relaxed text-muted-foreground">
                  As consultas são pagas antecipadamente. Os valores são informados antes da confirmação da compra. 
                  Reembolsos podem ser solicitados em caso de falha técnica que impeça a entrega do relatório, 
                  mas não são garantidos após a entrega bem-sucedida das informações.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">5. Limitação de Responsabilidade</h2>
                <p className="leading-relaxed text-muted-foreground">
                  O DespachaZap atua como intermediário na consulta de informações públicas. Não nos 
                  responsabilizamos por decisões tomadas com base nas informações fornecidas. 
                  As consultas devem ser usadas como ferramenta de auxílio, não como única fonte de decisão.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">6. Propriedade Intelectual</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Todo o conteúdo do site, incluindo design, textos, gráficos e logos, é propriedade do 
                  DespachaZap e está protegido por leis de direitos autorais. O uso não autorizado 
                  pode violar leis de direitos autorais e outras legislações.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">7. Modificações</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Reservamos o direito de modificar estes termos a qualquer momento. As alterações 
                  entram em vigor imediatamente após sua publicação no site. O uso continuado do 
                  serviço após alterações constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">8. Contato</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Para questões relacionadas a estes termos, entre em contato conosco através do 
                  WhatsApp: (47) 98884-7588 ou email: zapdespacha@gmail.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermosUso;
