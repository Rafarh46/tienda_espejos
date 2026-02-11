"use client"

import { useEffect, useState } from "react"
import { medusaStoreFetch } from "./medusa-client"


export function useMedusaProducts(limit = 24) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    ;(async () => {
      try {
        setLoading(true)
        const data = await medusaStoreFetch(`/store/products?limit=${limit}`)
        if (!alive) return
        setProducts(data.products ?? [])
      } catch (e: any) {
        if (!alive) return
        setError(e?.message ?? "Error cargando productos")
      } finally {
        if (!alive) return
        setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [limit])

  return { products, loading, error }
}
