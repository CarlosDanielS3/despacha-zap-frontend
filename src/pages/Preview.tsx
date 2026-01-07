import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Car, ArrowLeft, Lock, CheckCircle, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchVehiclePreview, VehiclePreview, VehicleNotFoundError, generatePixInvoice } from "@/services/vehicleApi";

const Preview = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plate = searchParams.get("placa") || "";

  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<VehiclePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingPix, setGeneratingPix] = useState(false);

  useEffect(() => {
    if (!plate) {
      navigate("/");
      return;
    }

    const loadVehicle = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchVehiclePreview(plate);
        setVehicle(data);
      } catch (err) {
        if (err instanceof VehicleNotFoundError) {
          setError("Placa não encontrada. Verifique se digitou corretamente.");
        } else {
          setError("Erro ao consultar veículo. Tente novamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [plate, navigate]);

  const formatPlate = (value: string) => {
    if (value.length <= 3) return value;
    return `${value.slice(0, 3)}-${value.slice(3)}`;
  };

  const handleViewAllData = async () => {
    setGeneratingPix(true);
    try {
      const pixData = await generatePixInvoice(plate);
      // Pass PIX data via navigation state
      navigate(`/pagamento?placa=${plate}`, { 
        state: { 
          pixData,
          vehicle 
        } 
      });
    } catch (err) {
      console.error("Erro ao gerar PIX:", err);
      // Navigate anyway but without PIX data
      navigate(`/pagamento?placa=${plate}`, { 
        state: { 
          vehicle,
          pixError: true 
        } 
      });
    } finally {
      setGeneratingPix(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Consultando veículo...</p>
          </div>
        )}

        {error && !loading && (
          <div className="mx-auto max-w-md rounded-xl border border-destructive/20 bg-destructive/10 p-8 text-center">
            <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
              <Car className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">Veículo não encontrado</h2>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button onClick={() => navigate("/")}>Tentar outra placa</Button>
          </div>
        )}

        {vehicle && !loading && (
          <div className="mx-auto max-w-2xl">
            {/* Vehicle Preview Card */}
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary to-accent p-6 text-white md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mb-1 text-sm opacity-80">Veículo encontrado</p>
                  <h1 className="text-3xl font-bold md:text-4xl">
                    {formatPlate(vehicle.placa)}
                  </h1>
                  <p className="mt-2 text-lg opacity-90">
                    {vehicle.marca} {vehicle.modelo}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                  <Car className="h-5 w-5" />
                  <span className="font-semibold">
                    {vehicle.anoFabricacao}/{vehicle.anoModelo}
                  </span>
                </div>
              </div>
            </div>

            {/* Locked Content Preview */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Relatório Completo Disponível
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Acesse todas as informações do veículo
                  </p>
                </div>
              </div>

              {/* Blurred/Locked items */}
              <div className="relative mb-6 space-y-3">
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Conteúdo bloqueado
                    </span>
                  </div>
                </div>

                {[
                  "Renavam: ••••••••••",
                  "Chassi: •••••••••••••••••",
                  "Débitos e Multas: R$ •••,••",
                  "Restrições: •••••••••",
                  "Gravame: •••••••••",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Dados cadastrais completos",
                  "Débitos e multas",
                  "Restrições administrativas/judiciais",
                  "Histórico de KM",
                  "Ficha técnica",
                  "Recall e gravame",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="rounded-xl bg-primary/5 p-6 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                  <Shield className="h-4 w-4" />
                  Pagamento 100% seguro
                </div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">
                  R$ 9,90
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Pagamento único • Acesso imediato
                </p>
                <Button
                  size="lg"
                  className="w-full gap-2 bg-primary shadow-primary hover:bg-primary/90 sm:w-auto"
                  onClick={handleViewAllData}
                  disabled={generatingPix}
                >
                  {generatingPix ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Gerando pagamento...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Ver todos os dados
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Preview;
