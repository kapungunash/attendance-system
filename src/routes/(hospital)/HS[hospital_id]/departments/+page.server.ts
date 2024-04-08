import type { PageServerLoad } from './$types';

export const load = (async (e) => {
  const departments = await e.locals.db.query.Department.findMany({
    where: ({ hospitalId }, { eq }) => eq(hospitalId, e.params.hospital_id)
  })
  return { departments };
}) satisfies PageServerLoad;