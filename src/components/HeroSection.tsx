import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [plate, setPlate] = useState("");
  const navigate = useNavigate();

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 7);
    setPlate(value);
  };

  const formatPlate = (value: string) => {
    if (value.length <= 3) return value;
    return `${value.slice(0, 3)}-${value.slice(3)}`;
  };

  const handleSearch = () => {
    if (plate.length >= 7) {
      navigate(`/preview?placa=${plate}`);
    }
  };

  return (
    <section className="hero-gradient relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20">
      {/* Background decorations */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Trust badges */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Shield className="h-3.5 w-3.5" />
              Consulta 100% Segura
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Consulte pela placa e acesse{" "}
            <span className="text-gradient-primary">informações completas</span>{" "}
            do veículo!
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Dados cadastrais, multas, débitos, e muito mais! Tudo em um único
            relatório.
          </p>

          {/* Search box */}
          <div className="mx-auto mb-8 max-w-md">
            <div className="relative rounded-2xl bg-card p-2 shadow-strong">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="ABC-1234"
                    value={formatPlate(plate)}
                    onChange={handlePlateChange}
                    className="plate-input h-14 border-2 border-muted bg-muted/50 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background"
                  />
                </div>
                <Button
                  size="lg"
                  className="h-14 gap-2 bg-primary px-8 text-base font-semibold shadow-primary transition-all hover:scale-[1.02] hover:bg-primary/90"
                  onClick={handleSearch}
                  disabled={plate.length < 7}
                >
                  <Search className="h-5 w-5" />
                  Consultar
                </Button>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/80 to-primary"
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-foreground">+1.000</span> já
              consultaram
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
