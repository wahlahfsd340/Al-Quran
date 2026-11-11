export class ApiError extends Error {
  constructor(code, detail) {
    super(code);
    this.code = code;
    this.detail = detail || '';
  }
}

export async function api(path, { method = 'GET', body, token, headers = {} } = {}) {
  let r;
  try {
    r = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('network');
  }
  const data = await r.json().catch(() => null);
  if (!r.ok || data === null) throw new ApiError((data && data.code) || 'generic', (data && (data.detail || data.error)) || `HTTP ${r.status}`);
  return data;
}
