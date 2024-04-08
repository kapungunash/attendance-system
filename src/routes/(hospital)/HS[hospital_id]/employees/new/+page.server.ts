import { z } from 'zod';
import type { PageServerLoad, RequestEvent } from './$types';
import { fail } from '@sveltejs/kit';
import { User } from '$lib/models/user/user';
import { HospitalEmployee } from '$lib/models/hospital/hospital-employee';
import bcrypt from "bcryptjs"


const newEmployeeSchema = z.object({
  id: z.string({ required_error: "ID is required" })
    .length(10, { message: "Employee ID must have 10 characters" })
    .refine((s) => s.startsWith("EMP"), { message: "Employee ID should begin with 'EMP'" })
  ,
  name: z
    .string({ required_error: "Employee name is required" })
    .min(3, { message: "Employee name must be at least 3 characters long" })
    .max(128, { message: "Employee name must be less than 128 characters long" }),
  email: z.string({ required_error: "Email  is required" }).email({ message: "Enter a valid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(1024, { message: "Password must be less than 1024 characters long" })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
      message:
        "Password must contain at least one number, one uppercase letter and one one lowercase letter.",
    }),
  username: z.string()
    .min(3, { message: "Minimum username length is 3" })
    .max(64, { message: "Maximum username length is 32" })
  ,
  department: z.string()
});


export const actions = {
  default: async (e: RequestEvent) => {
    const fd = await e.request.formData();
    const body = newEmployeeSchema.safeParse({
      id: fd.get("id"),
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
      username: fd.get("username"),
      department: fd.get("department")
    })

    if (!body.success) {
      return fail(400, {
        message: body.error.errors[0].message
      })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.data.password, salt)

    try {
      await e.locals.db.batch([
        e.locals.db.insert(User).values({
          createdAt: Date.now(),
          email: body.data.email,
          id: body.data.id,
          fullname: body.data.name,
          username: body.data.username,
          passwordHash
        }),

        e.locals.db.insert(HospitalEmployee).values({
          addedAt: Date.now(),
          userId: body.data.id,
          role: "employee",
          hospitalId: e.params.hospital_id,
          department: body.data.department
        })
      ])

    }
    catch (e: any) {
      if (e?.message?.includes('UNIQUE constraint failed: user.id')) {
        return fail(400, {
          message: "A Employee with that ID already exists"
        })
      };
      if (e.message?.includes('UNIQUE constraint failed: user.email')) {
        return fail(400, {
          message: "Email is already in use",
        })
      };
      if (e.message?.includes('UNIQUE constraint failed: user.username')) {
        return fail(400, {
          message: "username is already in use"
        })
      }

      console.error(e)
      return fail(500, {
        message: "An unexpected error has occured.  Try again later"
      })
    }


  }
}