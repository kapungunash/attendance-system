import { writable } from "svelte/store";
import type { LayoutData } from "../../routes/(hospital)/HS[hospital_id]/$types";

const hospital = writable<Awaited<LayoutData>["props"]["hospital"]>();
export default hospital;