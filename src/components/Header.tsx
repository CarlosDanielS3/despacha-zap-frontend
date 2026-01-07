import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Recursos
          </a>
          <a href="/contato" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Contato
          </a>
          <Button variant="default" size="sm" onClick={scrollToTop}>
            Consultar Agora
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="border-t border-border bg-background p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="/#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Recursos
            </a>
            <a
              href="/contato"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </a>
            <Button 
              variant="default" 
              size="sm" 
              className="w-full" 
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
            >
              Consultar Agora
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
