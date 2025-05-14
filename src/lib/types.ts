// src/lib/types.ts

import { Match } from "@prisma/client";

export type PartialMatch = Omit<Match, "id" | "createdAt">;

