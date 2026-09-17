import type { UseFetchOptions } from "#app";

export function useServerFetch<T = unknown>(url: string, opts: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig();
  return useFetch(url, {
    key: url + JSON.stringify(opts.query ?? {}),
    ...opts,
    baseURL: import.meta.client ? config.public.baseUrl : undefined,
  });
}

export function serverFetch<T = unknown>(url: string, opts: Parameters<typeof $fetch<T>>[1] = {}) {
  const config = useRuntimeConfig();
  return $fetch<T>(url, {
    ...opts,
    baseURL: import.meta.client ? config.public.baseUrl : undefined,
  });
}
