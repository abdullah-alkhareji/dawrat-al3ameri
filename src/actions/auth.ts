"use server";

import { executeAction } from "@/lib/executeAction";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/scheemas";
import { z } from "zod";
import bcrypt from "bcrypt";

export const register = async (values: z.infer<typeof registerSchema>) => {
  return await executeAction({
    actionFn: async () => {
      const validatedCredentials = registerSchema.parse(values);

      const existingUser = await prisma.user.findFirst({
        where: { email: validatedCredentials.email.toLowerCase() },
      });

      if (existingUser) {
        throw new Error("الايمل مسجل من قبل");
      }

      const hashedPassword = await bcrypt.hash(
        validatedCredentials.password,
        10
      );

      await prisma.user.create({
        data: {
          email: validatedCredentials.email.toLowerCase(),
          password: hashedPassword,
          name: validatedCredentials.name,
        },
      });
    },
  });
};
