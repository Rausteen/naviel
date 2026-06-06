/**
 * Serveur statique de production pour le dossier `dist/` (sortie Astro static).
 * ───────────────────────────────────────────────────────────────────────────
 * Zéro dépendance. Écoute sur 0.0.0.0:$PORT pour être joignable par le reverse
 * proxy (Dokploy / Nixpacks / Docker). Lancé via `pnpm start` après le build.
 */
import { createServer } from "node:http";
import { stat, readFile } from "node:fs/promises";
import { join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { handleCalWebhook } from "./server/cal-webhook.mjs";

const ROOT = fileURLToPath(new URL("./dist", import.meta.url));

/** Lit le corps brut d'une requête (limité à 1 Mo). */
function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

/** Résout une URL en chemin de fichier sûr dans dist/ (anti path-traversal). */
function resolvePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const safe = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return join(ROOT, safe);
}

async function tryFile(path) {
  try {
    const s = await stat(path);
    if (s.isDirectory()) return null;
    return s;
  } catch {
    return null;
  }
}

async function resolveTarget(urlPath) {
  let p = resolvePath(urlPath);

  // Répertoire ou route « propre » → index.html (Astro génère /page/index.html)
  if (urlPath.endsWith("/")) {
    return (await tryFile(join(p, "index.html"))) ? join(p, "index.html") : null;
  }
  if (await tryFile(p)) return p;
  // Essai en tant que dossier avec index.html (URLs sans slash final)
  const asIndex = join(p, "index.html");
  if (await tryFile(asIndex)) return asIndex;
  // Essai avec extension .html
  const asHtml = `${p}.html`;
  if (await tryFile(asHtml)) return asHtml;
  return null;
}

const server = createServer(async (req, res) => {
  try {
    const pathname = (req.url || "/").split("?")[0];

    // Webhook Cal.com (méthode C : import de conversion hors-ligne)
    if (req.method === "POST" && pathname === "/api/cal/webhook") {
      let raw;
      try {
        raw = await readBody(req);
      } catch {
        res.writeHead(413, { "Content-Type": "text/plain" });
        res.end("payload too large");
        return;
      }
      const headers = {};
      for (const [k, v] of Object.entries(req.headers)) headers[k.toLowerCase()] = v;
      const result = await handleCalWebhook(raw, headers);
      res.writeHead(result.status, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(result.body);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end("Method Not Allowed");
      return;
    }

    const target = await resolveTarget(req.url || "/");

    if (!target) {
      // Page 404 personnalisée d'Astro
      const notFound = join(ROOT, "404.html");
      const body = (await tryFile(notFound)) ? await readFile(notFound) : "Not Found";
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(req.method === "HEAD" ? undefined : body);
      return;
    }

    const ext = extname(target).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";

    // Cache long & immutable pour les assets fingerprintés (/_astro/...)
    const immutable = target.includes(`${join("_astro")}`) || /\.[0-9a-f]{8,}\./i.test(target);
    const cacheControl = immutable
      ? "public, max-age=31536000, immutable"
      : "public, max-age=0, must-revalidate";

    const data = await readFile(target);
    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": data.length,
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
    console.error(err);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Naviel — serveur statique sur http://${HOST}:${PORT}`);
});
