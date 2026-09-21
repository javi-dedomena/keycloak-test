import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()

  if (!session?.user) {
    return <div>No has iniciado sesión</div>
  }

  return (
      <main>
        <h1>Hola {session.user.name || session.user.email}</h1>
      </main>
  )
}