import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Car, FileText, AlertTriangle, Ban, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchVehicleFullData, VehicleFullData } from "@/services/vehicleApi";

// Mock data for demonstration
const getMockVehicleData = (plate: string) => ({
  placa: plate.toUpperCase(),
  renavam: "00123456789",
  chassi: "9BWZZZ377VT004251",
  anoFabricacao: 2021,
  anoModelo: 2022,
  marca: "VOLKSWAGEN",
  modelo: "GOL 1.0 FLEX 12V 5P",
  cor: "BRANCO",
  combustivel: "FLEX",
  potencia: "82 CV",
  cilindradas: "999 CC",
  categoria: "PARTICULAR",
  especie: "PASSAGEIRO",
  tipo: "AUTOMOVEL",
  municipio: "RIO DO SUL",
  uf: "SC",
  situacao: "REGULAR",
  dataLicenciamento: "2024",
  debitos: {
    ipva: { valor: 0, status: "Quitado" },
    licenciamento: { valor: 0, status: "Quitado" },
    multas: { valor: 320.50, status: "Pendente", quantidade: 1 },
    dpvat: { valor: 0, status: "Quitado" },
  },
  restricoes: {
    rouboFurto: false,
    administrativas: false,
    judiciais: false,
    tributarias: false,
    financeiras: true,
    instituicao: "BANCO BRADESCO S.A.",
  },
});

const Resultado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const plate = searchParams.get("placa") || "";
  const txid = (location.state as { txid?: string; pdfUrl?: string })?.txid || searchParams.get("txid") || "";
  const pdfUrl = (location.state as { txid?: string; pdfUrl?: string })?.pdfUrl;
  
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState<VehicleFullData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plate || !txid) {
      navigate("/");
      return;
    }

    const loadFullData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchVehicleFullData(plate, txid);
        setVehicleData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar dados do veículo.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadFullData();
  }, [plate, txid, navigate]);

  const formatPlate = (value: string) => {
    if (value.length <= 3) return value;
    return `${value.slice(0, 3)}-${value.slice(3)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12">
        {/* Header with Back and Download buttons */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nova consulta
          </Button>
          {pdfUrl && (
            <Button
              className="gap-2"
              onClick={() => window.open(pdfUrl, "_blank")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Baixar PDF
            </Button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Carregando dados completos...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Erro ao carregar dados</h2>
            <p className="mb-6 text-center text-muted-foreground">{error}</p>
            <Button onClick={() => navigate("/")}>Voltar para o início</Button>
          </div>
        )}

        {!loading && !error && vehicleData && (
          <>
        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-accent p-6 text-white md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 text-sm opacity-80">Resultado da Consulta</p>
              <h1 className="text-3xl font-bold md:text-4xl">{formatPlate(vehicleData.placa)}</h1>
              <p className="mt-2 text-lg opacity-90">{vehicleData.marca} {vehicleData.modelo}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
              <Car className="h-5 w-5" />
              <span className="font-semibold">{vehicleData.anoFabricacao}/{vehicleData.anoModelo}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Dados do Veículo */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Dados do Veículo</h2>
            </div>
            
            <div className="space-y-3">
              {[
                { label: "Placa", value: formatPlate(vehicleData.placa) },
                ...(vehicleData.placaAlternativa ? [{ label: "Placa Alternativa", value: vehicleData.placaAlternativa }] : []),
                ...(vehicleData.renavam ? [{ label: "Renavam", value: vehicleData.renavam }] : []),
                { label: "Chassi", value: vehicleData.chassi },
                { label: "Marca/Modelo", value: vehicleData.marcaModelo || `${vehicleData.marca} ${vehicleData.modelo}` },
                ...(vehicleData.submodelo ? [{ label: "Submodelo", value: vehicleData.submodelo }] : []),
                ...(vehicleData.versao ? [{ label: "Versão", value: vehicleData.versao }] : []),
                { label: "Ano Fab/Mod", value: `${vehicleData.anoFabricacao}/${vehicleData.anoModelo}` },
                { label: "Cor", value: vehicleData.cor },
                ...(vehicleData.combustivel ? [{ label: "Combustível", value: vehicleData.combustivel }] : []),
                ...(vehicleData.potencia ? [{ label: "Potência", value: vehicleData.potencia }] : []),
                ...(vehicleData.cilindradas ? [{ label: "Cilindradas", value: vehicleData.cilindradas }] : []),
                ...(vehicleData.categoria ? [{ label: "Categoria", value: vehicleData.categoria }] : []),
                ...(vehicleData.especie && vehicleData.tipo ? [{ label: "Espécie/Tipo", value: `${vehicleData.especie} / ${vehicleData.tipo}` }] : []),
                { label: "Município/UF", value: `${vehicleData.municipio} - ${vehicleData.uf}` },
                { label: "Situação", value: vehicleData.situacao },
                ...(vehicleData.dataLicenciamento ? [{ label: "Licenciamento", value: vehicleData.dataLicenciamento }] : []),
              ].map((item, i) => (
                <div key={i} className="flex justify-between border-b border-border/50 pb-2 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Débitos e Multas */}
          {vehicleData.debitos && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-warning/10 p-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Débitos e Multas</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "IPVA", ...vehicleData.debitos.ipva },
                { label: "Licenciamento", ...vehicleData.debitos.licenciamento },
                { label: "DPVAT", ...vehicleData.debitos.dpvat },
                { label: "Multas", ...vehicleData.debitos.multas },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.valor > 0 ? (
                      <>
                        <span className="font-bold text-destructive">
                          R$ {item.valor.toFixed(2).replace('.', ',')}
                        </span>
                        <XCircle className="h-5 w-5 text-destructive" />
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-success">Sem débitos</span>
                        <CheckCircle className="h-5 w-5 text-success" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {vehicleData.debitos.multas.valor > 0 && (
              <div className="mt-4 rounded-lg bg-destructive/10 p-4">
                <p className="text-sm text-destructive">
                  <strong>Atenção:</strong> Este veículo possui {vehicleData.debitos.multas.quantidade} multa(s) pendente(s) 
                  no valor total de R$ {vehicleData.debitos.multas.valor.toFixed(2).replace('.', ',')}.
                </p>
              </div>
            )}
          </div>
          )}

          {/* Tabela FIPE */}
          {vehicleData.fipe && vehicleData.fipe.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-success/10 p-2">
                  <FileText className="h-5 w-5 text-success" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Tabela FIPE</h2>
              </div>
              
              <div className="space-y-4">
                {vehicleData.fipe.map((fipe, i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{fipe.texto_modelo}</p>
                        <p className="text-sm text-muted-foreground">{fipe.texto_marca}</p>
                      </div>
                      <p className="text-lg font-bold text-primary">{fipe.texto_valor}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                      <div>
                        <span className="text-muted-foreground">Ano:</span>
                        <span className="ml-1 font-medium text-foreground">{fipe.ano_modelo}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Código FIPE:</span>
                        <span className="ml-1 font-medium text-foreground">{fipe.codigo_fipe}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Combustível:</span>
                        <span className="ml-1 font-medium text-foreground">{fipe.combustivel}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ref:</span>
                        <span className="ml-1 font-medium text-foreground">{fipe.mes_referencia}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Restrições */}
          {vehicleData.restricoes && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-destructive/10 p-2">
                <Ban className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Restrições Administrativas ou Jurídicas</h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Roubo/Furto", hasRestriction: vehicleData.restricoes.rouboFurto },
                { label: "Restrições Administrativas", hasRestriction: vehicleData.restricoes.administrativas },
                { label: "Restrições Judiciais", hasRestriction: vehicleData.restricoes.judiciais },
                { label: "Restrições Tributárias", hasRestriction: vehicleData.restricoes.tributarias },
                { label: "Restrições Financeiras (Gravame)", hasRestriction: vehicleData.restricoes.financeiras },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between rounded-lg p-4 ${
                    item.hasRestriction 
                      ? "bg-destructive/10 border border-destructive/20" 
                      : "bg-success/10 border border-success/20"
                  }`}
                >
                  <span className="font-medium text-foreground">{item.label}</span>
                  {item.hasRestriction ? (
                    <XCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                </div>
              ))}
            </div>

            {vehicleData.restricoes.financeiras && vehicleData.restricoes.instituicao && (
              <div className="mt-4 rounded-lg bg-warning/10 p-4">
                <p className="text-sm text-warning">
                  <strong>Gravame ativo:</strong> Veículo com alienação fiduciária junto à instituição {vehicleData.restricoes.instituicao}.
                </p>
              </div>
            )}
          </div>
          )}
        </div>
        </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Resultado;
