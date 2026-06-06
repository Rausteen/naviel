/**
 * Webhook Cal.com → import de conversion hors-ligne Google Ads (méthode C).
 * ───────────────────────────────────────────────────────────────────────────
 * Branché sur l'event `BOOKING_CREATED`. On vérifie la signature, on extrait le
 * `gclid` (prérempli sur la landing dans un champ caché Cal), puis on importe la
 * conversion via google-ads.mjs.
 *
 * Sécurité : la signature Cal.com (HMAC-SHA256 du corps brut avec le secret du
 * webhook) est vérifiée. Définir CAL_WEBHOOK_SECRET.
 */
import crypto from "node:crypto";
import {
  googleAdsConfigured,
  uploadClickConversion,
  formatAdsDateTime,
} from "./google-ads.mjs";

function verifySignature(rawBody, signature, secret) {
  if (!secret) return false; // en prod, exiger un secret
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/** Récupère le gclid quelle que soit la forme du payload Cal. */
function extractGclid(payload) {
  const r = payload?.responses || {};
  if (r.gclid && typeof r.gclid === "object" && r.gclid.value) return r.gclid.value;
  if (typeof r.gclid === "string") return r.gclid;
  if (payload?.metadata?.gclid) return payload.metadata.gclid;
  if (Array.isArray(payload?.customInputs)) {
    const f = payload.customInputs.find((c) => /gclid/i.test(c?.label || ""));
    if (f?.value) return f.value;
  }
  return "";
}

/**
 * @param {string} rawBody  corps brut de la requête (pour la signature)
 * @param {Record<string,string|undefined>} headers  en-têtes (clés en minuscules)
 * @returns {Promise<{status:number, body:string}>}
 */
export async function handleCalWebhook(rawBody, headers) {
  const secret = process.env.CAL_WEBHOOK_SECRET || "";
  const sig = headers["x-cal-signature-256"];
  if (!verifySignature(rawBody, sig, secret)) {
    return { status: 401, body: "invalid signature" };
  }

  let data;
  try {
    data = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: "invalid json" };
  }

  if (data?.triggerEvent !== "BOOKING_CREATED") {
    return { status: 200, body: "ignored" };
  }

  const payload = data.payload || {};
  const gclid = extractGclid(payload);
  if (!gclid) {
    console.warn("[cal-webhook] réservation sans gclid (probablement hors Google Ads)");
    return { status: 200, body: "no gclid" };
  }

  if (!googleAdsConfigured()) {
    console.warn("[cal-webhook] Google Ads non configuré — gclid reçu mais conversion non importée");
    return { status: 200, body: "ads not configured" };
  }

  try {
    const when = payload.createdAt || payload.startTime;
    const conversionDateTime = when
      ? formatAdsDateTime(new Date(when))
      : formatAdsDateTime();
    await uploadClickConversion({
      gclid,
      conversionDateTime,
      value: process.env.GOOGLE_ADS_CONVERSION_VALUE || "",
      orderId: payload.uid || payload.bookingId || undefined,
    });
    console.log("[cal-webhook] conversion importée (gclid " + gclid.slice(0, 8) + "…)");
    return { status: 200, body: "ok" };
  } catch (e) {
    // On répond 200 pour éviter les relances en boucle de Cal ; l'erreur est loggée.
    console.error("[cal-webhook] échec import conversion:", e && e.message);
    return { status: 200, body: "logged error" };
  }
}
