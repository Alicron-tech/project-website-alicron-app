// Shared-secret gate for the private preview. The password comes from SITE_PASSWORD; the cookie holds a hash of it.
export const GATE_COOKIE = 'alicron_access'
export const getPassword = () => process.env.SITE_PASSWORD ?? 'alicron-preview-2026'

export async function tokenFor(password: string): Promise<string> {
  const data = new TextEncoder().encode('alicron:' + password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 40)
}
