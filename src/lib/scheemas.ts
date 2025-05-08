import { z } from "zod";

export const addTournamentSchema = z.object({
  name: z.string().min(1, { message: "مطلوب" }),
  teamCount: z.number({ required_error: "مطلوب" }).min(2, {
    message: "اقل شي فريقين",
  }),
  startDate: z.date({ required_error: "مطلوب" }),
  endDate: z.date({ required_error: "مطلوب" }),
  lastRegDate: z.date({ required_error: "مطلوب" }),
  location: z.string({ required_error: "مطلوب" }),
});
