import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const originalAdapter = PrismaAdapter(prisma);

  return {
    ...originalAdapter,
    // Override the deleteSession method to use a workaround for the REPLICA IDENTITY issue
    deleteSession: async (sessionToken) => {
      try {
        // First, fetch the session to be deleted
        const session = await prisma.session.findUnique({
          where: { sessionToken },
        });

        if (!session) return null;

        // Then delete it using deleteMany instead of delete
        await prisma.session.deleteMany({
          where: { sessionToken },
        });

        return session;
      } catch (error) {
        console.error("Error deleting session:", error);
        return null;
      }
    },
  };
}
