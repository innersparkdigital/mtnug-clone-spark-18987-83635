// SEO-friendly specialist URLs: /specialists/esther-murungi instead of a raw UUID.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string): boolean => UUID_RE.test(value.trim());

export const slugifyName = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const specialistPath = (specialist: { id: string; name?: string | null }): string =>
  specialist.name ? `/specialists/${slugifyName(specialist.name)}` : `/specialists/${specialist.id}`;

// Matches a URL param (uuid, name-slug, or raw name) against a specialist name.
export const matchesSpecialistParam = (param: string, name: string): boolean =>
  slugifyName(decodeURIComponent(param)) === slugifyName(name);
