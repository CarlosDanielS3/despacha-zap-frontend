import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
                Política de Privacidade
              </h1>
              <p className="text-lg text-muted-foreground">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 rounded-2xl border bg-card p-8 shadow-lg md:p-12">
              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">1. Informações que Coletamos</h2>
                <div className="space-y-3 leading-relaxed text-muted-foreground">
                  <p>Coletamos as seguintes informações:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li><strong>Dados de consulta:</strong> Placas de veículos consultadas</li>
                    <li><strong>Dados de pagamento:</strong> Informações necessárias para processar pagamentos (processadas por terceiros seguros)</li>
                    <li><strong>Dados de navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas</li>
                    <li><strong>Dados de contato:</strong> Email e telefone quando fornecidos voluntariamente</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">2. Como Usamos suas Informações</h2>
                <div className="space-y-3 leading-relaxed text-muted-foreground">
                  <p>Utilizamos suas informações para:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Fornecer e melhorar nossos serviços de consulta veicular</li>
                    <li>Processar pagamentos e emitir recibos</li>
                    <li>Enviar atualizações sobre sua consulta</li>
                    <li>Responder a solicitações de suporte</li>
                    <li>Prevenir fraudes e abusos</li>
                    <li>Cumprir obrigações legais</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">3. Compartilhamento de Dados</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Não vendemos suas informações pessoais. Podemos compartilhar dados apenas com:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                  <li><strong>Processadores de pagamento:</strong> Para processar transações com segurança</li>
                  <li><strong>Fornecedores de dados:</strong> Para obter informações veiculares de fontes oficiais</li>
                  <li><strong>Autoridades legais:</strong> Quando exigido por lei</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">4. Segurança dos Dados</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações 
                  contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia 
                  de dados, firewalls e controles de acesso rigorosos.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">5. Cookies e Tecnologias Similares</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso 
                  do site e personalizar conteúdo. Você pode controlar o uso de cookies nas configurações 
                  do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">6. Seus Direitos</h2>
                <div className="space-y-3 leading-relaxed text-muted-foreground">
                  <p>De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Acessar seus dados pessoais</li>
                    <li>Corrigir dados incompletos ou imprecisos</li>
                    <li>Solicitar a exclusão de dados</li>
                    <li>Revogar consentimento</li>
                    <li>Solicitar a portabilidade de dados</li>
                    <li>Obter informações sobre o tratamento de dados</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">7. Retenção de Dados</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e cumprir 
                  obrigações legais. Dados de consultas podem ser retidos por até 5 anos para fins de 
                  auditoria e conformidade legal.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">8. Menores de Idade</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente 
                  informações de menores. Se você acredita que coletamos dados de um menor, entre em contato 
                  para que possamos remover essas informações.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">9. Alterações nesta Política</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                  através do site ou por email. O uso continuado do serviço após alterações constitui 
                  aceitação da nova política.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-foreground">10. Contato</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Para questões sobre privacidade ou para exercer seus direitos, entre em contato:
                </p>
                <ul className="mt-3 space-y-2 leading-relaxed text-muted-foreground">
                  <li><strong>Email:</strong> zapdespacha@gmail.com</li>
                  <li><strong>WhatsApp:</strong> (47) 98884-7588</li>
                  <li><strong>Endereço:</strong> Rio do Sul - SC - Brasil</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
