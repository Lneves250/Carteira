const { verifyToken } = require("@clerk/backend");

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function authorize(request, requireAdmin = false) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const adminUserId = process.env.CLERK_ADMIN_USER_ID;

  if (!secretKey || !adminUserId) {
    throw new ApiError(503, "Autenticação não configurada no servidor.");
  }

  const token = request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new ApiError(401, "Sessão autenticada necessária.");

  let claims;
  try {
    claims = await verifyToken(token, { secretKey });
  } catch {
    throw new ApiError(401, "Sessão inválida ou expirada.");
  }

  const allowedViewers = new Set([
    adminUserId,
    ...(process.env.CLERK_VIEWER_USER_IDS || "")
      .split(",")
      .map((userId) => userId.trim())
      .filter(Boolean),
  ]);

  if (!allowedViewers.has(claims.sub)) {
    throw new ApiError(403, "Esta conta não está autorizada a consultar os dados.");
  }
  if (requireAdmin && claims.sub !== adminUserId) {
    throw new ApiError(403, "Somente a conta administrativa pode publicar dados.");
  }

  return claims.sub;
}

module.exports = { ApiError, authorize };
