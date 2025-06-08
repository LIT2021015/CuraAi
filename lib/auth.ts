// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "user-credentials",
      name: "User",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Missing credentials");

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !(await compare(credentials.password, user.password))) throw new Error("Invalid credentials");

        return { ...user, role: "user" };
      },
    }),
    CredentialsProvider({
      id: "hospital-credentials",
      name: "Hospital",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Missing credentials");

        const hospital = await prisma.hospital.findUnique({ where: { email: credentials.email } });
        if (!hospital || !(await compare(credentials.password, hospital.password))) throw new Error("Invalid credentials");

        return { ...hospital, role: "hospital" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
