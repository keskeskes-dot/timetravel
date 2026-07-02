/**
 * Limiteur de débit simple, en mémoire, par clé (typiquement une IP).
 *
 * Note : le stockage est en mémoire du process. En environnement serverless,
 * l'état n'est pas partagé entre instances — c'est suffisant pour un projet
 * pédagogique et pour amortir les pics d'abus, mais pas pour une garantie
 * stricte en production (utiliser un store type Redis/Upstash le cas échéant).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  /** Secondes avant réinitialisation (utile pour l'en-tête Retry-After). */
  retryAfter: number;
  /** Requêtes restantes dans la fenêtre courante. */
  remaining: number;
};

/**
 * Autorise `limit` requêtes par fenêtre glissante de `windowMs` millisecondes.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    pruneExpired(now);
    return { ok: true, retryAfter: 0, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
      remaining: 0,
    };
  }

  bucket.count += 1;
  return { ok: true, retryAfter: 0, remaining: limit - bucket.count };
}

/** Nettoie les entrées expirées pour éviter que la Map ne grossisse sans fin. */
function pruneExpired(now: number): void {
  if (buckets.size < 500) return;
  const expired: string[] = [];
  buckets.forEach((bucket, key) => {
    if (now >= bucket.resetAt) expired.push(key);
  });
  expired.forEach((key) => buckets.delete(key));
}

/** Extrait une IP client exploitable depuis les en-têtes de la requête. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
