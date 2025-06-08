// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { compare } from "bcryptjs";
// import { prisma } from "@/lib/prisma";
// import type { NextAuthOptions, User, Session } from "next-auth";
// import type { JWT } from "next-auth/jwt";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     // User login
//     CredentialsProvider({
//       id: "user-credentials", // Custom ID
//       name: "User",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing credentials");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email }
//         });

//         if (!user) {
//           throw new Error("No user found");
//         }

//         const isValid = await compare(credentials.password, user.password);
//         if (!isValid) {
//           throw new Error("Invalid password");
//         }

//         return { ...user, role: "user" }; // You can tag the role
//       }
//     }),

//     // Hospital login
//     CredentialsProvider({
//       id: "hospital-credentials", // Custom ID
//       name: "Hospital",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing credentials");
//         }

//         const hospital = await prisma.hospital.findUnique({
//           where: { email: credentials.email }
//         });

//         if (!hospital) {
//           throw new Error("No hospital found");
//         }

//         const isValid = await compare(credentials.password, hospital.password);
//         if (!isValid) {
//           throw new Error("Invalid password");
//         }

//         return { ...hospital, role: "hospital" }; // Tag the role
//       }
//     })
//   ],
//   session: {
//     strategy: "jwt"
//   },
//   callbacks: {
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role; // Add role to token
//       }
//       return token;
//     },
//     async session({ session, token }: { session: Session; token: JWT }) {
//       if (session.user) {
//         (session.user as any).id = token.id;
//         (session.user as any).role = token.role; // Expose role in session
//       }
//       return session;
//     }
//   },
//   pages: {
//     signIn: "/auth/login" 
//   }
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { compare } from "bcryptjs";
// import { prisma } from "@/lib/prisma";
// import type { NextAuthOptions, User, Session } from "next-auth";
// import type { JWT } from "next-auth/jwt";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     // User login
//     CredentialsProvider({
//       id: "user-credentials",
//       name: "User",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing credentials");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) {
//           throw new Error("No user found");
//         }

//         const isValid = await compare(credentials.password, user.password);
//         if (!isValid) {
//           throw new Error("Invalid password");
//         }

//         return { ...user, role: "user" };
//       },
//     }),

//     // Hospital login
//     CredentialsProvider({
//       id: "hospital-credentials",
//       name: "Hospital",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing credentials");
//         }

//         const hospital = await prisma.hospital.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!hospital) {
//           throw new Error("No hospital found");
//         }

//         const isValid = await compare(credentials.password, hospital.password);
//         if (!isValid) {
//           throw new Error("Invalid password");
//         }

//         return { ...hospital, role: "hospital" };
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     // Store id and role in JWT token
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         token.id = user.id; // ✅ user.id is MongoDB _id as string
//         token.role = (user as any).role;
//       }
//       return token;
//     },

//     // Add token fields to session.user
//     async session({ session, token }: { session: Session; token: JWT }) {
//       if (session.user) {
//         (session.user as any).id = token.id;
//         (session.user as any).role = token.role;
//       }
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/auth/login",
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
