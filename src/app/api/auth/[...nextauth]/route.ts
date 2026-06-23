import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        loginId: { label: "Login ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.loginId || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { loginId: credentials.loginId },
              { email: credentials.loginId }, 
            ],
          },
        });

        if (!user || !user.password) {
          return null;
        }

        let isPasswordValid = false;

        // 1. Try Bcrypt Compare
        try {
           isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        } catch (e) {
           // Not a bcrypt hash
        }

        // 2. Fallback to Plain Comparison (and heal)
        if (!isPasswordValid && user.password === credentials.password) {
           isPasswordValid = true;
           const newHash = await bcrypt.hash(credentials.password, 10);
           await prisma.user.update({
              where: { id: user.id },
              data: { password: newHash }
           });
        }

        if (!isPasswordValid) return null;

        // 3. Admin Restriction Check
        if (user.role === "ADMIN" && user.email !== "tarendra.gadhewal2024@gmail.com") {
           console.warn("RESTRICTED: Admin login attempt by", user.email);
           return null;
        }

        return {
           id: user.id,
           name: user.name,
           email: user.email,
           role: user.role,
           status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.status = (user as any).status; // Newly added
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role;
        (session.user as any).status = token.status; // Newly added
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is absolute, just trust it.
      // This bypasses the default NextAuth check that rejects URLs that don't match NEXTAUTH_URL exactly.
      if (url.startsWith('http')) return url;
      return url.startsWith('/') ? `${baseUrl}${url}` : baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecret",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
