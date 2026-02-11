const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL!
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!

export async function medusaStoreFetch(path: string) {
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Medusa ${res.status}: ${text}`)
  }

  return res.json()
}
