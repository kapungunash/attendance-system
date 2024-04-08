import { z } from 'zod';
import type { PageServerLoad, RequestEvent } from './$types';
import { fail } from '@sveltejs/kit';
import { Department } from '$lib/models/department/department';

const registerHospitalSchema = z.object({
  id: z.string({ required_error: "ID is required" })
    .length(10, { message: "Department ID must have 10 characters" })
    .refine((s) => s.startsWith("DP"), { message: "Department ID should begin with 'DP'" })
  ,
  name: z
    .string({ required_error: "Department name is required" })
    .min(3, { message: "Department name must be at least 3 characters long" })
    .max(128, { message: "Department name must be less than 128 characters long" }),
  "check-in-time": z.string({ required_error: "Check in time is required" }),
  "check-out-time": z.string({ required_error: "Check out time is required" })
});


export const actions = {
  default: async (e: RequestEvent) => {
    const fd = await e.request.formData();
    const body = registerHospitalSchema.safeParse({
      id: fd.get("id"),
      name: fd.get("name"),
      "check-in-time": fd.get("check-in-time"),
      "check-out-time": fd.get("check-out-time")
    })
    if (!body.success) {
      return fail(400, {
        message: body.error.errors[0].message
      })
    }

    try {
      await e.locals.db.insert(Department).values({
        id: body.data.id,
        checkInTime: body.data['check-in-time'],
        checkOutTime: body.data['check-out-time'],
        name: body.data.name,
        createdAt: Date.now(),
        hospitalId: e.params.hospital_id
      })
    }
    catch (e: any) {
      if (e?.message?.includes('UNIQUE constraint failed: department.id')) {
        return fail(400, {
          message: "A department with that ID already exists"
        })
      };
      console.error(e)
      return fail(400, {
        message: "An unexpected error has occured.  Try again later"
      })
    }


  }
}