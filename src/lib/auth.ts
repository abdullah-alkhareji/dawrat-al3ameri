import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { loginSchema } from "./scheemas";
import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import bcrypt from "bcrypt";

const adapter = PrismaAdapter(prisma);

export const { auth, handlers } = NextAuth({
  adapter,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedCredentials = loginSchema.parse(credentials);

        const { email, password } = validatedCredentials;
        const user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },

  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});
