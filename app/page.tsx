import { Bricolage_Grotesque } from "next/font/google"
import { auth } from "@/auth"
import SignOutButton from "./components/SignOutButton"
import Shop from "./components/Shop"

const font = Bricolage_Grotesque({ subsets: ["latin"] })

// Datos de ejemplo: cámbialos por tu base de datos o API.
const orders = [
    { id: "H-1042", date: "14 sep", items: "Monstera, Pothos", total: 47, status: "En camino" },
    { id: "H-1017", date: "29 ago", items: "Sansevieria", total: 22, status: "Entregado" },
    { id: "H-0986", date: "03 ago", items: "Helecho de Boston, Maceta blanca", total: 35, status: "Entregado" },
]

export default async function Home() {
    const session = await auth()
    const name = session?.user?.name ?? "visitante"
    const firstName = name.split(" ")[0]

    return (
        <div className={`${font.className} min-h-screen bg-[#E6EDEE] text-[#14263A]`}>
            <header className="border-b border-[#14263A]/15 bg-[#E6EDEE]">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                    <span className="text-2xl font-extrabold tracking-tight">Herbario</span>
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm sm:inline">{name}</span>
                        <SignOutButton />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-5 py-10">
                <section className="mb-12 max-w-2xl">
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                        Hola, {firstName}. Elige plantas para tu casa.
                    </h1>
                    <p className="mt-4 text-lg text-[#14263A]/75">
                        Filtra por la luz que tienes en casa y añade al carrito. Envío gratis a partir de 60 €.
                    </p>
                </section>

                <Shop />

                <section className="mt-16">
                    <h2 className="mb-4 text-2xl font-bold tracking-tight">Tus pedidos</h2>
                    <div className="overflow-x-auto rounded-xl border border-[#14263A]/15 bg-white">
                        <table className="w-full min-w-[540px] text-left text-sm">
                            <thead className="bg-[#14263A] text-white">
                            <tr>
                                <th className="px-4 py-3 font-medium">Pedido</th>
                                <th className="px-4 py-3 font-medium">Fecha</th>
                                <th className="px-4 py-3 font-medium">Contenido</th>
                                <th className="px-4 py-3 text-right font-medium">Total</th>
                                <th className="px-4 py-3 font-medium">Estado</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="border-t border-[#14263A]/10">
                                    <td className="px-4 py-3 font-semibold">{o.id}</td>
                                    <td className="px-4 py-3">{o.date}</td>
                                    <td className="px-4 py-3">{o.items}</td>
                                    <td className="px-4 py-3 text-right">{o.total} €</td>
                                    <td className="px-4 py-3">
                                            <span
                                                className={
                                                    o.status === "En camino"
                                                        ? "rounded-full bg-[#F2B705] px-3 py-1 text-xs font-semibold"
                                                        : "rounded-full bg-[#2F6B4F] px-3 py-1 text-xs font-semibold text-white"
                                                }
                                            >
                                                {o.status}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    )
}