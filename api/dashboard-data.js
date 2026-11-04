const { Client } = require("pg");
const { ApiError, authorize } = require("./_auth");

const maxPayloadBytes = 3 * 1024 * 1024;
const maxRecords = 30000;

function createDatabaseClient() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new ApiError(503, "Banco PostgreSQL não configurado no servidor.");
  }
  return new Client({ connectionString });
}

function validateDashboardData(data) {
  if (
    !data ||
    !data.open ||
    !data.closed ||
    !Array.isArray(data.records) ||
    !Array.isArray(data.files) ||
    !data.asOf
  ) {
    throw new ApiError(400, "Os dados das planilhas estão incompletos.");
  }
  if (data.records.length === 0 || data.records.length > maxRecords) {
    throw new ApiError(400, `A base deve conter de 1 a ${maxRecords} registros.`);
  }

  const requiredRecordFields = [
    "source",
    "atc",
    "pole",
    "orderId",
    "month",
    "city",
    "family",
    "priority",
    "status",
    "initiative",
    "tss",
    "cause",
    "scheduled",
  ];

  for (const record of data.records) {
    if (
      !record ||
      typeof record !== "object" ||
      Array.isArray(record) ||
      requiredRecordFields.some((field) => !(field in record))
    ) {
      throw new ApiError(400, "Um ou mais registros estão incompletos.");
    }
    if (record.source !== "open" && record.source !== "closed") {
      throw new ApiError(400, "A base contém um tipo de registro inválido.");
    }
  }
}

module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "private, no-store");
  response.setHeader("Vary", "Authorization");

  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Método não permitido." });
  }

  let client;
  try {
    await authorize(request, request.method === "POST");
    client = createDatabaseClient();
    await client.connect();

    if (request.method === "GET") {
      const { rows } = await client.query(
        "SELECT payload, updated_at FROM dashboard_snapshot WHERE id = 1",
      );
      if (!rows.length) {
        return response.status(404).json({ error: "Ainda não há planilhas publicadas." });
      }

      return response.status(200).json({
        ...rows[0].payload,
        updatedAt: rows[0].updated_at,
      });
    }

    validateDashboardData(request.body);
    const serialized = JSON.stringify(request.body);
    if (Buffer.byteLength(serialized, "utf8") > maxPayloadBytes) {
      throw new ApiError(413, "A base excede o limite de publicação de 3 MB.");
    }

    await client.query(
      `INSERT INTO dashboard_snapshot (id, payload, updated_at)
       VALUES (1, $1::jsonb, now())
       ON CONFLICT (id) DO UPDATE
       SET payload = EXCLUDED.payload, updated_at = now()`,
      [serialized],
    );

    return response.status(200).json({ published: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return response.status(error.status).json({ error: error.message });
    }
    console.error("Falha ao processar a base privada do dashboard.", error);
    return response.status(500).json({ error: "Não foi possível processar a base privada." });
  } finally {
    if (client) {
      await client.end().catch((error) => {
        console.error("Falha ao encerrar conexão PostgreSQL.", error);
      });
    }
  }
};
