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

export const applicationFormSchema = z.object({
  teamNumber: z.number({ required_error: "مطلوب" }).min(1, {
    message: "مطلوب",
  }),
  name1: z.string({ required_error: "مطلوب" }).min(1, {
    message: "مطلوب",
  }),
  name2: z.string({ required_error: "مطلوب" }).min(1, {
    message: "مطلوب",
  }),
  civilId1: z
    .string()
    .min(12, { message: "الرقم المدني يجب ان يكون 12 أرقام" })
    .max(12, { message: "الرقم المدني يجب ان يكون 12 أرقام" })
    .regex(/^\d+$/, { message: "يجب ان يحتوي على ارقام فقط" }),
  civilId2: z
    .string()
    .min(12, { message: "الرقم المدني يجب ان يكون 12 أرقام" })
    .max(12, { message: "الرقم المدني يجب ان يكون 12 أرقام" })
    .regex(/^\d+$/, { message: "يجب ان يحتوي على ارقام فقط" }),
  phone1: z
    .string()
    .min(8, { message: "رقم الهاتف يجب ان يكون 8 أرقام" })
    .max(8, { message: "رقم الهاتف يجب ان يكون 8 أرقام" })
    .regex(/^\d+$/, { message: "يجب ان يحتوي على ارقام فقط" }),
  phone2: z
    .string()
    .min(8, { message: "رقم الهاتف يجب ان يكون 8 أرقام" })
    .max(8, { message: "رقم الهاتف يجب ان يكون 8 أرقام" })
    .regex(/^\d+$/, { message: "يجب ان يحتوي على ارقام فقط" }),
});
