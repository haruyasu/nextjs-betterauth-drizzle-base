import { db } from "@/lib/db"
import * as authSchema from "@/lib/db/schema"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { headers } from "next/headers"

export type ServerSessionResponse = Awaited<ReturnType<typeof auth.api.getSession>>

export type Session = ServerSessionResponse

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
    usePlural: true,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
})

export const getServerSession = async (): Promise<ServerSessionResponse> => {
  return auth.api.getSession({
    headers: await headers(),
  })
}
