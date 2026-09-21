import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Keycloak({
            clientId: process.env.AUTH_KEYCLOAK_ID,
            clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
            issuer: process.env.AUTH_KEYCLOAK_ISSUER,
        }),
    ],
    callbacks: {
        authorized: async ({ auth }) => {
            // Devuelve true si hay sesión; false redirige al login de Keycloak.
            return !!auth
        },
        async jwt({ token, profile }) {
            if (profile) {
                // Guardamos el nombre que envía Keycloak en el token.
                token.name = profile.name
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name as string
            }
            return session
        },
    },
})