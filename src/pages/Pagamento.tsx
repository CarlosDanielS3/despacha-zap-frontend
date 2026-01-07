import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PixInvoice, checkPaymentStatus } from "@/services/vehicleApi";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Copy,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// Payment state type
type PaymentState = {
  id: string;
  plate: string;
  amount: number;
  status: "pending" | "paid" | "expired";
  pixCode: string;
  qrCodeImage?: string;
  expiresAt: Date;
  pdfUrl?: string;
};

// Mock payment data - replace with Woovi integration later
const generateMockPayment = (plate: string): PaymentState => ({
  id: `pay_${Date.now()}`,
  plate,
  amount: 9.9,
  status: "pending",
  pixCode:
    "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540519.905802BR5925CONSULTA VEICULAR LTDA6009SAO PAULO62070503***6304ABCD",
  expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
});

const Pagamento = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const plate = searchParams.get("placa") || "";

  // Get PIX data from navigation state
  const pixData = (location.state as { pixData?: PixInvoice })?.pixData;
  const pixError = (location.state as { pixError?: boolean })?.pixError;

  console.log("PIX Data received:", pixData);

  const [payment, setPayment] = useState<PaymentState>(() => {
    if (pixData) {
      console.log("QR Code Image URL:", pixData.qrCodeImage);
      console.log("Using brCode as ID:", pixData.qrCode); // qrCode contains brCode
      
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
      // Store expiration time in localStorage
      localStorage.setItem(`payment_expires_${plate}`, expiresAt.toISOString());
      
      return {
        id: pixData.qrCode || pixData.txid || `pay_${Date.now()}`, // Use qrCode (brCode) as ID
        plate,
        amount: pixData.valor || 9.9,
        status: "pending",
        pixCode: pixData.qrCode || pixData.linhaDigitavel, // qrCode contains brCode
        qrCodeImage: pixData.qrCodeImage,
        expiresAt: expiresAt,
        pdfUrl: undefined,
      };
    }
    return generateMockPayment(plate);
  });
  
  // Calculate initial time left from stored expiration or use 30 minutes
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedExpiration = localStorage.getItem(`payment_expires_${plate}`);
    if (storedExpiration) {
      const expiresAt = new Date(storedExpiration);
      const remaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
      return remaining;
    }
    return 30 * 60;
  });
  const [checking, setChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);

  useEffect(() => {
    if (!plate) {
      navigate("/");
      return;
    }

    if (pixError) {
      toast({
        title: "Aviso",
        description:
          "Não foi possível gerar o QR Code. Você pode tentar novamente.",
        variant: "destructive",
      });
    }
  }, [plate, navigate, pixError, toast]);

  // Automatic payment verification polling (every 10 seconds)
  useEffect(() => {
    if (!payment.id || payment.status !== "pending") {
      return;
    }

    const pollingInterval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(payment.id);

        if (status.status === "paid") {
          clearInterval(pollingInterval);
          setPayment((prev) => ({ ...prev, status: "paid", pdfUrl: status.pdfUrl }));

          toast({
            title: "Pagamento confirmado!",
            description: "Você pode visualizar o relatório completo agora.",
          });
          
          // Clear stored expiration time
          localStorage.removeItem(`payment_expires_${plate}`);
        } else if (status.status === "expired") {
          clearInterval(pollingInterval);
          setPayment((prev) => ({ ...prev, status: "expired" }));

          toast({
            title: "Pagamento expirado",
            description: "O tempo para pagamento expirou.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Erro no polling de pagamento:", err);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(pollingInterval);
  }, [payment.id, payment.status, plate, navigate, toast]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatPlate = (value: string) => {
    if (value.length <= 3) return value;
    return `${value.slice(0, 3)}-${value.slice(3)}`;
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(payment.pixCode);
      toast({
        title: "Código copiado!",
        description: "Cole o código no app do seu banco.",
      });
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente.",
        variant: "destructive",
      });
    }
  };

  const handleCheckPayment = async () => {
    // Check cooldown - must wait 5 seconds between manual checks
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime;
    const cooldownRemaining = 5000 - timeSinceLastCheck;

    if (lastCheckTime && cooldownRemaining > 0) {
      toast({
        title: "Aguarde um momento",
        description: `Você poderá verificar novamente em ${Math.ceil(
          cooldownRemaining / 1000
        )} segundos.`,
      });
      return;
    }

    setChecking(true);
    setLastCheckTime(now);

    try {
      const status = await checkPaymentStatus(payment.id);

      if (status.status === "paid") {
        setPayment((prev) => ({ ...prev, status: "paid", pdfUrl: status.pdfUrl }));

        toast({
          title: "Pagamento confirmado!",
          description: "Você pode visualizar o relatório completo agora.",
        });
        
        // Clear stored expiration time
        localStorage.removeItem(`payment_expires_${plate}`);
      } else if (status.status === "expired") {
        setPayment((prev) => ({ ...prev, status: "expired" }));

        toast({
          title: "Pagamento expirado",
          description: "O tempo para pagamento expirou.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Pagamento pendente",
          description:
            "Ainda não identificamos o pagamento. Aguarde ou tente novamente.",
        });
      }
    } catch (err) {
      toast({
        title: "Erro ao verificar pagamento",
        description: "Não foi possível verificar o status. Tente novamente.",
        variant: "destructive",
      });
    }

    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(`/preview?placa=${plate}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="mx-auto max-w-lg">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Finalize seu pagamento
            </h1>
            <p className="text-muted-foreground">
              Consulta do veículo{" "}
              <span className="font-semibold text-foreground">
                {formatPlate(plate)}
              </span>
            </p>
          </div>

          {/* Payment Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            {/* Timer */}
            <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-warning/10 p-3 text-warning">
              <Clock className="h-5 w-5" />
              <span className="font-medium">
                Expira em {formatTime(timeLeft)}
              </span>
            </div>

            {/* Amount */}
            <div className="mb-6 text-center">
              <p className="text-sm text-muted-foreground">Valor total</p>
              <p className="text-4xl font-bold text-foreground">
                R$ {payment.amount.toFixed(2).replace(".", ",")}
              </p>
            </div>

            {/* QR Code */}
            <div className="mb-6 flex justify-center">
              {payment.qrCodeImage ? (
                <div className="rounded-xl border-2 border-border bg-white p-4">
                  <img
                    src={payment.qrCodeImage}
                    alt="QR Code PIX"
                    className="h-48 w-48 object-contain"
                  />
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    QR Code PIX
                  </p>
                </div>
              ) : (
                <div className="flex h-56 w-56 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50">
                  <p className="text-center text-sm text-muted-foreground">
                    Aguardando QR Code...
                  </p>
                </div>
              )}
            </div>

            {/* Pix Code */}
            <div className="mb-6">
              <p className="mb-2 text-center text-sm text-muted-foreground">
                Ou copie o código PIX:
              </p>
              <div className="flex gap-2">
                <div className="flex-1 overflow-x-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                  <code className="block break-all">{payment.pixCode}</code>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPix}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Check Payment Button or Success State */}
            {payment.status === "paid" ? (
              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-center gap-2 rounded-lg bg-success/10 p-4 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Pagamento confirmado!</span>
                </div>
                <Button
                  className="w-full gap-2 bg-primary shadow-primary hover:bg-primary/90"
                  onClick={() => navigate(`/resultado?placa=${plate}&txid=${payment.id}`, {
                    state: { txid: payment.id, pdfUrl: payment.pdfUrl },
                  })}
                >
                  Ver relatório completo
                </Button>
              </div>
            ) : (
              <Button
                className="mb-4 w-full gap-2 bg-primary shadow-primary hover:bg-primary/90"
                onClick={handleCheckPayment}
                disabled={checking}
              >
                {checking ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Já paguei - Verificar pagamento
                  </>
                )}
              </Button>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              <span>Pagamento 100% seguro via PIX</span>
            </div>
          </div>

          {/* Benefits Reminder */}
          <div className="mt-6 rounded-xl bg-muted/50 p-4">
            <p className="mb-3 text-sm font-medium text-foreground">
              Você terá acesso a:
            </p>
            <div className="grid gap-2">
              {[
                "Dados cadastrais completos",
                "Débitos e multas",
                "Restrições administrativas/judiciais",
                "Histórico de KM",
                "Ficha técnica",
                "Recall e gravame",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pagamento;
