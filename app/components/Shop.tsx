"use client"

import { useMemo, useState } from "react"

type Light = "Sombra" | "Luz indirecta" | "Sol directo"

type Product = {
    id: string
    name: string
    latin: string
    price: number
    light: Light
    height: string
    color: string
}

const PRODUCTS: Product[] = [
    { id: "monstera", name: "Monstera", latin: "Monstera deliciosa", price: 32, light: "Luz indirecta", height: "60 cm", color: "#2F6B4F" },
    { id: "pothos", name: "Pothos", latin: "Epipremnum aureum", price: 15, light: "Sombra", height: "35 cm", color: "#5C9A4A" },
    { id: "sansevieria", name: "Sansevieria", latin: "Dracaena trifasciata", price: 22, light: "Sombra", height: "50 cm", color: "#3E6B3A" },
    { id: "aloe", name: "Aloe vera", latin: "Aloe barbadensis", price: 12, light: "Sol directo", height: "25 cm", color: "#7FAE7A" },
    { id: "ficus", name: "Ficus lyrata", latin: "Ficus lyrata", price: 48, light: "Luz indirecta", height: "90 cm", color: "#24553F" },
    { id: "cactus", name: "Cactus columnar", latin: "Cereus peruvianus", price: 18, light: "Sol directo", height: "40 cm", color: "#4F8A5B" },
]

const FILTERS: ("Todas" | Light)[] = ["Todas", "Sombra", "Luz indirecta", "Sol directo"]

function Leaf({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
            <path d="M60 108 C60 70 60 50 60 20" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M60 30 C25 30 15 60 30 78 C55 72 62 52 60 30Z" fill={color} />
            <path d="M60 46 C95 44 108 72 92 92 C66 88 58 68 60 46Z" fill={color} opacity="0.75" />
            <path d="M60 80 C40 80 32 96 40 108 C56 106 62 94 60 80Z" fill={color} opacity="0.55" />
        </svg>
    )
}

const eur = (n: number) => `${n} €`

export default function Shop() {
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todas")
    const [cart, setCart] = useState<Record<string, number>>({})
    const [done, setDone] = useState(false)

    const visible = PRODUCTS.filter((p) => filter === "Todas" || p.light === filter)

    const lines = useMemo(
        () =>
            Object.entries(cart)
                .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
                .filter((l) => l.qty > 0),
        [cart],
    )
    const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0)
    const count = lines.reduce((sum, l) => sum + l.qty, 0)
    const shipping = total >= 60 || total === 0 ? 0 : 5

    function change(id: string, delta: number) {
        setDone(false)
        setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + delta) }))
    }

    function checkout() {
        // Aquí llamarías a tu API o a Stripe.
        setCart({})
        setDone(true)
    }

    return (
        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
                <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por luz">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            aria-pressed={filter === f}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14263A] ${
                                filter === f
                                    ? "border-[#14263A] bg-[#14263A] text-white"
                                    : "border-[#14263A]/30 bg-transparent hover:bg-white"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {visible.map((p) => (
                        <article key={p.id} className="flex flex-col overflow-hidden rounded-xl bg-white">
                            <div className="h-40 bg-[#F3F6F4] p-6">
                                <Leaf color={p.color} />
                            </div>
                            <div className="flex flex-1 flex-col p-4">
                                <h3 className="text-lg font-bold">{p.name}</h3>
                                <p className="text-sm italic text-[#14263A]/60">{p.latin}</p>
                                <p className="mt-2 text-sm">
                                    {p.light} · {p.height}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-4">
                                    <span className="text-xl font-bold">{eur(p.price)}</span>
                                    <button
                                        onClick={() => change(p.id, 1)}
                                        className="rounded-lg bg-[#F2B705] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#dca604] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14263A]"
                                    >
                                        Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <aside className="h-fit rounded-xl bg-[#14263A] p-5 text-white lg:sticky lg:top-6">
                <h2 className="text-xl font-bold">
                    Carrito{count > 0 && <span className="ml-2 text-[#F2B705]">({count})</span>}
                </h2>

                {done && (
                    <p className="mt-4 rounded-lg bg-[#2F6B4F] p-3 text-sm">
                        Pedido realizado. Recibirás un correo con el seguimiento.
                    </p>
                )}

                {lines.length === 0 && !done && (
                    <p className="mt-4 text-sm text-white/70">
                        Tu carrito está vacío. Añade una planta para empezar.
                    </p>
                )}

                <ul className="mt-4 space-y-3">
                    {lines.map(({ product, qty }) => (
                        <li key={product.id} className="flex items-center justify-between gap-3 text-sm">
                            <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-white/60">{eur(product.price * qty)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => change(product.id, -1)}
                                    aria-label={`Quitar una unidad de ${product.name}`}
                                    className="h-7 w-7 rounded-md border border-white/30 hover:bg-white/10"
                                >
                                    −
                                </button>
                                <span className="w-4 text-center">{qty}</span>
                                <button
                                    onClick={() => change(product.id, 1)}
                                    aria-label={`Añadir una unidad de ${product.name}`}
                                    className="h-7 w-7 rounded-md border border-white/30 hover:bg-white/10"
                                >
                                    +
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {lines.length > 0 && (
                    <div className="mt-5 border-t border-white/20 pt-4 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{eur(total)}</span>
                        </div>
                        <div className="mt-1 flex justify-between">
                            <span>Envío</span>
                            <span>{shipping === 0 ? "Gratis" : eur(shipping)}</span>
                        </div>
                        <div className="mt-3 flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>{eur(total + shipping)}</span>
                        </div>
                        <button
                            onClick={checkout}
                            className="mt-4 w-full rounded-lg bg-[#F2B705] py-2.5 font-semibold text-[#14263A] transition-colors hover:bg-[#dca604] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Finalizar compra
                        </button>
                    </div>
                )}
            </aside>
        </section>
    )
}