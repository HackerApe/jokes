import { User } from "@prisma/client"
import bcrypt from "bcryptjs"
import { createCookieSessionStorage, redirect } from "remix"
import { db } from "~/utils/db.server"

type LoginForm = {
  username: string
  password: string
}

const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET) throw new Error("SESSION_SECRET must be set")

export const login = async ({ username, password }: LoginForm) => {
  const user = await db.user.findUnique({ where: { username } })

  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isCorrectPassword) return null
  return user
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_sesion",
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
})

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession()

  session.set("userId", userId)

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) }
  })
}

export const getUserSession = async (request: Request) =>
  storage.getSession(request.headers.get("Cookie"))

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get("userId")

  if (!userId || typeof userId !== "string") return null
  return userId
}

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request)
  const userId = session.get("userId")

  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }

  return userId
}

export const logout = async (request: Request) => {
  const session = await storage.getSession(request.headers.get("Cookie"))
  return redirect("/login", {
    headers: { "Set-Cookie": await storage.destroySession(session) }
  })
}

export const getUser = async (request: Request) => {
  const userId: string | null = await getUserId(request)

  if (typeof userId !== "string") return null

  try {
    const user: User | null = await db.user.findUnique({
      where: { id: userId }
    })
    return user
  } catch (e) {
    throw logout(request)
  }
}
