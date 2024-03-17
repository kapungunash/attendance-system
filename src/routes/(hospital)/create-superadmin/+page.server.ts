import { error, fail, isRedirect, redirect } from "@sveltejs/kit";
import type { PageServerLoad, RequestEvent } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import { zod } from 'sveltekit-superforms/adapters'
import bcrypt from "bcryptjs"
import { User } from "$lib/models/user/user";
import { ulid } from "ulid"
import { HospitalEmployee } from "$lib/models/hospital/hospital-employee";
import { initializeLucia } from "../../../lib/config/auth";

const createSuperadminSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  fullname: z.string().min(3, { message: "Minimum fullname length is 3" })
    .max(128, { message: "Maximum username length is 128" }),
  username: z.string()
    .min(3, { message: "Minimum username length is 3" })
    .max(64, { message: "Maximum username length is 32" })
  ,
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
  const form = await superValidate(e, zod(createSuperadminSchema));

  const __securitySecret = (await e.locals.db.query.Hospital.findFirst({
    columns: { __securitySecret: true },
    where: (hospital, { eq }) => eq(hospital.id, e.url.searchParams.get("hId") ?? "")
  }))?.__securitySecret

  if (__securitySecret !== e.url.searchParams.get("__securitySecret")) throw redirect(302, "/register-hospital")


  return {
    form,
  };
};

export const actions = {
  default: async (e: RequestEvent) => {
    const form = await superValidate(e, zod(createSuperadminSchema));

    console.log(e.url.searchParams.get("hId"))
    if (!form.valid) {
      form.errors._errors = [...Object.values(form.errors)[0]]
      return fail(400, {
        form,
      })
    };

    const userId = ulid();
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(form.data.password, salt)


    try {
      await e.locals.db.batch([
        e.locals.db.insert(User).values({
          createdAt: Date.now(),
          email: form.data.email,
          id: userId,
          fullname: form.data.fullname,
          username: form.data.username,
          passwordHash
        }),
        e.locals.db.insert(HospitalEmployee).values({
          addedAt: Date.now(),
          userId,
          role: "super-admin",
          hospitalId: e.url.searchParams.get("hId") ?? ""
        })
      ])


      const auth = await initializeLucia(e.locals.db)

      const session = await auth.createSession(userId, {
        createdAt: Date.now(),
        ipAddress: e.getClientAddress(),
        userAgent: e.request.headers.get('user-agent') ?? null
      });

      const sessionCookie = auth.createSessionCookie(session.id);

      e.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
      });

      throw redirect(302, e.url.searchParams.get("hId") + "/overview")
    }
    catch (e: any) {
      if (isRedirect(e)) throw e;
      if (e.message?.includes('UNIQUE constraint failed: user.email')) {
        form.errors._errors = ["Email is already in use"]
        return fail(400, {
          form,
        })
      };
      if (e.message?.includes('UNIQUE constraint failed: user.username')) {
        form.errors._errors = ["username is already in use"]
        return fail(400, {
          form,
        })
      }
      form.errors._errors = ["An internal error occured.  Please try again"]
      console.log(e)
      return fail(500, {
        form,
      })
        ;
    }
  }
};
