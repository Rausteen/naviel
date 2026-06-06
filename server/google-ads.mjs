/**
 * Import de conversion hors-ligne dans Google Ads (Offline Click Conversion).
 * ───────────────────────────────────────────────────────────────────────────
 * Méthode C : on remonte les VRAIS rendez-vous (pas les clics) à Google Ads,
 * via le `gclid` capturé sur la landing puis transmis par le webhook Cal.com.
 *
 * Utilise l'API REST Google Ads — AUCUNE dépendance externe (fetch natif Node 18+).
 * Tous les secrets viennent des variables d'environnement (jamais côté client).
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";

function env(name) {
  return process.env[name] || "";
}

/** True si toutes les variables nécessaires sont présentes. */
export function googleAdsConfigured() {
  return Boolean(
    env("GOOGLE_ADS_DEVELOPER_TOKEN") &&
      env("GOOGLE_ADS_CLIENT_ID") &&
      env("GOOGLE_ADS_CLIENT_SECRET") &&
      env("GOOGLE_ADS_REFRESH_TOKEN") &&
      env("GOOGLE_ADS_CUSTOMER_ID") &&
      env("GOOGLE_ADS_CONVERSION_ACTION_ID"),
  );
}

/** Échange le refresh token contre un access token OAuth2. */
async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: env("GOOGLE_ADS_CLIENT_ID"),
    client_secret: env("GOOGLE_ADS_CLIENT_SECRET"),
    refresh_token: env("GOOGLE_ADS_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  });
  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!r.ok) throw new Error(`OAuth token error ${r.status}: ${await r.text()}`);
  const json = await r.json();
  return json.access_token;
}

/** Format attendu par Google Ads : "yyyy-MM-dd HH:mm:ss+HH:mm" (avec offset). */
export function formatAdsDateTime(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const tzMin = -date.getTimezoneOffset(); // minutes
  const sign = tzMin >= 0 ? "+" : "-";
  const abs = Math.abs(tzMin);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

/**
 * Importe une conversion « clic » dans Google Ads.
 * @param {{gclid:string, conversionDateTime?:string, value?:string|number, orderId?:string}} p
 */
export async function uploadClickConversion({ gclid, conversionDateTime, value, orderId }) {
  if (!gclid) throw new Error("gclid manquant");
  const customerId = env("GOOGLE_ADS_CUSTOMER_ID").replace(/-/g, "");
  const version = env("GOOGLE_ADS_API_VERSION") || "v18";
  const accessToken = await getAccessToken();

  const conversion = {
    gclid,
    conversionAction: `customers/${customerId}/conversionActions/${env("GOOGLE_ADS_CONVERSION_ACTION_ID")}`,
    conversionDateTime: conversionDateTime || formatAdsDateTime(),
  };
  if (value) {
    conversion.conversionValue = Number(value);
    conversion.currencyCode = env("GOOGLE_ADS_CURRENCY") || "EUR";
  }
  if (orderId) conversion.orderId = String(orderId);

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "developer-token": env("GOOGLE_ADS_DEVELOPER_TOKEN"),
    "Content-Type": "application/json",
  };
  // Requis si le compte est géré par un compte administrateur (MCC)
  if (env("GOOGLE_ADS_LOGIN_CUSTOMER_ID")) {
    headers["login-customer-id"] = env("GOOGLE_ADS_LOGIN_CUSTOMER_ID").replace(/-/g, "");
  }

  const url = `https://googleads.googleapis.com/${version}/customers/${customerId}:uploadClickConversions`;
  const r = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ conversions: [conversion], partialFailure: true }),
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Google Ads API ${r.status}: ${JSON.stringify(json)}`);
  if (json.partialFailureError) {
    throw new Error(`Google Ads partial failure: ${JSON.stringify(json.partialFailureError)}`);
  }
  return json;
}
