import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              A consulta veicular mais completa do Brasil. Compre e venda veículos com segurança.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Consultas</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#pricing" className="text-muted-foreground transition-colors hover:text-foreground">
                  Dados Cadastrais
                </a>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/contato" className="text-muted-foreground transition-colors hover:text-foreground">
                  Fale conosco
                </a>
              </li>
              <li>
                <a href="/termos-de-uso" className="text-muted-foreground transition-colors hover:text-foreground">
                  Termos de uso
                </a>
              </li>
              <li>
                <a href="/politica-de-privacidade" className="text-muted-foreground transition-colors hover:text-foreground">
                  Política de privacidade
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                zapdespacha@gmail.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                (47) 98884-7588
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Rio do Sul - SC - Brasil
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DespachaZap. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
