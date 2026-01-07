// Vehicle API service

// API Configuration
// Development: Uses Vite dev proxy at /api (vite.config.ts)
//   - Proxy intercepts requests and adds x-api-key header server-side
//   - This keeps the API key hidden during local development
// 
// Production: CloudFront + CloudFront Functions
//   - CloudFront Functions inject x-api-key header at edge
//   - API key NEVER sent from browser - completely secure
//   - Frontend makes requests to /api/* which CloudFront routes to API Gateway
//
// In both environments, frontend NEVER includes x-api-key header
const API_BASE_URL = "/api";

export interface VehiclePreview {
  placa: string;
  marca: string;
  modelo: string;
  anoFabricacao: number;
  anoModelo: number;
}

export interface VehicleFipeData {
  ano_modelo: string;
  codigo_fipe: string;
  texto_marca: string;
  texto_modelo: string;
  texto_valor: string;
  combustivel: string;
  mes_referencia: string;
}

export interface VehicleFullData extends VehiclePreview {
  chassi: string;
  cor: string;
  municipio: string;
  uf: string;
  situacao: string;
  codigoSituacao: string;
  logo?: string;
  placaAlternativa?: string;
  marcaModelo?: string;
  submodelo?: string;
  versao?: string;
  mensagemRetorno?: string;
  fipe?: VehicleFipeData[];
  // Legacy fields (may not be in new API)
  renavam?: string;
  combustivel?: string;
  potencia?: string;
  cilindradas?: string;
  categoria?: string;
  especie?: string;
  tipo?: string;
  dataLicenciamento?: string;
  debitos?: {
    ipva: { valor: number; status: string };
    licenciamento: { valor: number; status: string };
    multas: { valor: number; status: string; quantidade: number };
    dpvat: { valor: number; status: string };
  };
  restricoes?: {
    rouboFurto: boolean;
    administrativas: boolean;
    judiciais: boolean;
    tributarias: boolean;
    financeiras: boolean;
    instituicao: string;
  };
}

export interface PixInvoice {
  qrCode: string;
  qrCodeImage?: string;
  linhaDigitavel: string;
  valor?: number;
  txid?: string;
}

export async function generatePixInvoice(plate: string): Promise<PixInvoice> {
  const normalizedPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

  try {
    const response = await fetch(`${API_BASE_URL}/woovi-pix-invoice-website`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plate: normalizedPlate }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar PIX: ${response.status}`);
    }

    const data = await response.json();
    
    console.log("PIX Invoice Response:", data);

    // Access nested charge object if it exists
    const charge = data.charge || data;

    // brCode is the PIX code used for payment identification
    const brCode = charge.brCode || charge.qrCode || charge.qr_code || charge.emv || data.brCode || data.qrCode || data.qr_code || "";

    return {
      qrCode: brCode,
      qrCodeImage: charge.qrCodeImage || charge.qr_code_image || charge.imagemQrcode || data.qrCodeImage || "",
      linhaDigitavel: charge.linhaDigitavel || charge.linha_digitavel || brCode,
      valor: (charge.valor || charge.value || charge.amount || data.valor || data.value || 0) / 100, // Convert from cents to reais
      txid: brCode, // Use brCode as txid for payment status checks
    };
  } catch (err) {
    console.error("Erro ao gerar PIX:", err);
    throw new Error("Erro ao gerar pagamento PIX. Tente novamente.");
  }
}

export class VehicleNotFoundError extends Error {
  constructor(plate: string) {
    super(`Veículo com placa ${plate} não encontrado`);
    this.name = "VehicleNotFoundError";
  }
}

export interface PaymentStatus {
  status: "pending" | "paid" | "expired";
  txid?: string;
  paidAt?: string;
  pdfUrl?: string;
}

export async function checkPaymentStatus(txid: string): Promise<PaymentStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/payment-status-check?brCode=${txid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao verificar pagamento: ${response.status}`);
    }

    const data = await response.json();

    // Map data.paid boolean to status
    const status = data.paid === true ? "paid" : "pending";

    return {
      status: status,
      txid: data.txid || txid,
      paidAt: data.paidAt || data.paid_at || data.paymentDate,
      pdfUrl: data.pdfUrl || data.pdf_url,
    };
  } catch (err) {
    console.error("Erro ao verificar status do pagamento:", err);
    throw new Error("Erro ao verificar pagamento. Tente novamente.");
  }
}

export async function fetchVehiclePreview(plate: string): Promise<VehiclePreview> {
  const normalizedPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

  try {
    const response = await fetch(`${API_BASE_URL}/plate-preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plate: normalizedPlate }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new VehicleNotFoundError(normalizedPlate);
      }
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    
    // Map API response to VehiclePreview format
    // Backend returns: { marca, modelo, ano, cor, placa }
    const ano = parseInt(data.ano) || 0;
    return {
      placa: data.placa || normalizedPlate,
      marca: data.marca || "N/A",
      modelo: data.modelo || "N/A",
      anoFabricacao: ano,
      anoModelo: ano,
    };
  } catch (err) {
    if (err instanceof VehicleNotFoundError) {
      throw err;
    }
    console.error("Erro ao buscar veículo:", err);
    throw new Error("Erro ao consultar veículo. Tente novamente.");
  }
}

export async function fetchVehicleFullData(plate: string, txid: string): Promise<VehicleFullData> {
  const normalizedPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

  try {
    const response = await fetch(`${API_BASE_URL}/retrieve-plate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        plate: normalizedPlate,
        txid: txid  // Transaction ID to verify payment
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new VehicleNotFoundError(normalizedPlate);
      }
      if (response.status === 402 || response.status === 403) {
        throw new Error("Pagamento não confirmado. Efetue o pagamento para acessar os dados completos.");
      }
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();

    // Map API response to VehicleFullData format
    // Parse year from string to number
    const ano = parseInt(data.ano) || parseInt(data.anoFabricacao) || 0;
    const anoModelo = parseInt(data.anoModelo) || ano;
    
    // Map FIPE data if available
    const fipeData = data.fipe?.dados?.map((item: any) => ({
      ano_modelo: item.ano_modelo,
      codigo_fipe: item.codigo_fipe,
      texto_marca: item.texto_marca,
      texto_modelo: item.texto_modelo,
      texto_valor: item.texto_valor,
      combustivel: item.combustivel,
      mes_referencia: item.mes_referencia,
    }));
    
    return {
      // Basic info
      placa: data.placa || normalizedPlate,
      marca: data.marca || data.MARCA || "N/A",
      modelo: data.modelo || data.MODELO || "N/A",
      anoFabricacao: ano,
      anoModelo: anoModelo,
      
      // Required fields
      chassi: data.chassi || "N/A",
      cor: data.cor || "N/A",
      municipio: data.municipio || "N/A",
      uf: data.uf || "N/A",
      situacao: data.situacao || "N/A",
      codigoSituacao: data.codigoSituacao || "0",
      
      // New API fields
      logo: data.logo,
      placaAlternativa: data.placa_alternativa,
      marcaModelo: data.marcaModelo,
      submodelo: data.SUBMODELO || data.submodelo,
      versao: data.VERSAO || data.versao,
      mensagemRetorno: data.mensagemRetorno,
      fipe: fipeData,
      
      // Legacy/optional fields (may not exist in new API)
      renavam: data.renavam,
      combustivel: data.combustivel,
      potencia: data.potencia,
      cilindradas: data.cilindradas,
      categoria: data.categoria,
      especie: data.especie,
      tipo: data.tipo,
      dataLicenciamento: data.dataLicenciamento || data.data_licenciamento,
      debitos: data.debitos ? {
        ipva: { 
          valor: data.debitos?.ipva?.valor || 0, 
          status: data.debitos?.ipva?.status || "N/A" 
        },
        licenciamento: { 
          valor: data.debitos?.licenciamento?.valor || 0, 
          status: data.debitos?.licenciamento?.status || "N/A" 
        },
        multas: { 
          valor: data.debitos?.multas?.valor || 0, 
          status: data.debitos?.multas?.status || "N/A",
          quantidade: data.debitos?.multas?.quantidade || 0
        },
        dpvat: { 
          valor: data.debitos?.dpvat?.valor || 0, 
          status: data.debitos?.dpvat?.status || "N/A" 
        },
      } : undefined,
      restricoes: data.restricoes ? {
        rouboFurto: data.restricoes?.rouboFurto || data.restricoes?.roubo_furto || false,
        administrativas: data.restricoes?.administrativas || false,
        judiciais: data.restricoes?.judiciais || false,
        tributarias: data.restricoes?.tributarias || false,
        financeiras: data.restricoes?.financeiras || false,
        instituicao: data.restricoes?.instituicao || "N/A",
      } : undefined,
    };
  } catch (err) {
    if (err instanceof VehicleNotFoundError) {
      throw err;
    }
    console.error("Erro ao buscar dados completos do veículo:", err);
    throw new Error("Erro ao consultar dados do veículo. Tente novamente.");
  }
}
