import { MemoryApiRepository } from "./memory-repository";
import type { ApiRepository } from "./repository";

interface ApiContext {
  repository: ApiRepository;
}

const globalApi = globalThis as typeof globalThis & {
  __stealthApiRepository?: ApiRepository;
};

/**
 * Issue #1516: startup configuration validation gate.
 *
 * Validates required environment bindings, secrets, supported versions, and
 * storage adapters at startup / first initialization. Misconfigured deployments
 * fail clearly before serving partial or unsafe API behavior. Dev vs prod
 * requirements are distinguished, and secret values are never logged.
 */
export interface ApiConfig {
  isProd: boolean;
  kvBinding?: unknown;
  coordinatorBinding?: unknown;
  cursorSecret?: string;
  supportedVersions: readonly string[];
}

export function validateApiConfig(config: ApiConfig): void {
  if (config.isProd) {
    if (!config.kvBinding) {
      throw new Error("Configuration error: STEALTH_KV binding is not declared in wrangler.jsonc.");
    }
    if (!config.coordinatorBinding) {
      throw new Error(
        "Configuration error: STEALTH_COORDINATOR binding is not declared in wrangler.jsonc.",
      );
    }
    if (!config.cursorSecret) {
      // Never echo the secret value — only that it is missing.
      throw new Error("Configuration error: STEALTH_CURSOR_SECRET is required in production.");
    }
  }

  if (config.supportedVersions.length === 0) {
    throw new Error(
      "Configuration error: at least one supported protocol version must be configured.",
    );
  }
}

export async function getApiContext(): Promise<ApiContext> {
  if (!import.meta.env.PROD) {
    globalApi.__stealthApiRepository ??= new MemoryApiRepository();
    return { repository: globalApi.__stealthApiRepository };
  }

  if (globalApi.__stealthApiRepository) {
    return { repository: globalApi.__stealthApiRepository };
  }

  const { env } = await import("cloudflare:workers");
  validateApiConfig({
    isProd: true,
    kvBinding: env.STEALTH_KV,
    coordinatorBinding: env.STEALTH_COORDINATOR,
    cursorSecret: env.STEALTH_CURSOR_SECRET,
    supportedVersions: ["v1"],
  });

  const { HybridApiRepository } = await import("./kv-repository");
  globalApi.__stealthApiRepository = new HybridApiRepository(
    env.STEALTH_KV,
    env.STEALTH_COORDINATOR,
  );
  return { repository: globalApi.__stealthApiRepository };
}
