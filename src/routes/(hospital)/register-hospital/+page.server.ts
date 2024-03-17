import { fail, isRedirect, redirect } from "@sveltejs/kit";
import type { PageServerLoad, RequestEvent } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import { zod } from 'sveltekit-superforms/adapters'
import { Hospital } from "$lib/models/hospital/hospital";
import generateRandomString from "$lib/helpers/generateRandomString";

const registerHospitalSchema = z.object({
  id: z.string()
    .length(10, { message: "Hospital ID must have a minimum of 10 characters" })
    .refine((s) => s.startsWith("H"), { message: "Hospital ID's should begin with 'H'" })
  ,
  name: z
    .string()
    .min(3, { message: "Hospital name must be at least 3 characters long" })
    .max(128, { message: "Hospital name must be less than 128 characters long" }),
  address: z.string().max(1024, { message: "Hospital address must be less than 1024 characters long" })
});

export const load: PageServerLoad = async (e) => {
  const form = await superValidate(e, zod(registerHospitalSchema));
  return {
    form,
  };
};

export const actions = {
  default: async (e: RequestEvent) => {
    const form = await superValidate(e, zod(registerHospitalSchema));

    if (!form.valid) {
      form.errors._errors = [...Object.values(form.errors)[0]]
      return fail(400, {
        form,
      })
    };

    const __securitySecret: string = generateRandomString(26)
    try {
      await e.locals.db.insert(Hospital).values({
        ...form.data
        , createdAt: Date.now(),
        __securitySecret
      })

      throw redirect(302, "/create-superadmin?__securitySecret=" + __securitySecret + "&hId=" + form.data.id)
    }
    catch (e: any) {
      if (isRedirect(e)) throw e
      form.errors._errors = ["An unexpected error has occured.  Please try again"];
      return fail(500, {
        form,
      })
    }
  }
};
