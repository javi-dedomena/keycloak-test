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
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized: async ({ auth }) => !!auth,
        async jwt({ token, profile, account }) {
            if (account?.id_token) {
                token.idToken = account.id_token
            }
            if (profile) {
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
    events: {
        async signOut(message) {
            if ("token" in message && message.token?.idToken) {
                const issuer = process.env.AUTH_KEYCLOAK_ISSUER
                const params = new URLSearchParams({
                    id_token_hint: message.token.idToken as string,
                })
                await fetch(`${issuer}/protocol/openid-connect/logout?${params}`)
            }
        },
    },
})