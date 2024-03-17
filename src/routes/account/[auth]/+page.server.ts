import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad, RequestEvent } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import { zod } from 'sveltekit-superforms/adapters'
import bcrypt from "bcryptjs"

const emailAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(1024, { message: "Password must be less than 1024 characters long" })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
      message:
        "Password must contain at least one number, one uppercase letter and one one lowercase letter.",
    }),
});

export const load: PageServerLoad = async (e) => {
  if (!["sign-in", "sign-up"].includes(e.params.auth)) throw error(404);
  const form = await superValidate(e, zod(emailAuthSchema));
  return {
    form,
  };
};

export const actions = {
  default: async (e: RequestEvent) => {
    const form = await superValidate(e, zod(emailAuthSchema));

    // if (!form.valid) {
    //   form.errors._errors = ["Invalid username or password"];
    //   return fail(400, {
    //     form,
    //   })
    // };

    const user = await e.locals.db.query.User.findFirst({
      where: (users, { eq }) => eq(users.email, form.data.email)
    })

    if (!user) {
      form.errors._errors = ["Invalid credentials"]
      return fail(401, { form })
    }

    if (!(await bcrypt.compare(form.data.password, user.passwordHash))) {
      form.errors._errors = ["Invalid credentials"]
      return fail(401, { form })
    }

    // e.locals.db.query.

  }
};
