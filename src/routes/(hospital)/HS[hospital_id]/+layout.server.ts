import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (async (e) => {

  const isUserMember = await e.locals.db.query.HospitalEmployee.findFirst({
    where: (hospitalEmployee, { eq, and }) => and(eq(hospitalEmployee.userId, e.locals.user?.id ?? ""), eq(hospitalEmployee.hospitalId, "HS" + e.params.hospital_id)),
    columns: { userId: true }
  })

  if (!isUserMember) throw error(401, "User not an employee of Hospital")

  const hospital = e.locals.db.query.Hospital.findFirst({
    where: (hospital, { eq }) => eq(hospital.id, "HS" + e.params.hospital_id),
    columns: {
      __securitySecret: false,
      address: false
    },
    with: {
      employees: {
        columns: {
          hospitalId: false
        },
        with: {
          user: {
            columns: {
              avatarUrl: true,
              username: true
            }
          }
        }
      }
    }
  })

  return {
    props: {
      hospital
    }
  };
});