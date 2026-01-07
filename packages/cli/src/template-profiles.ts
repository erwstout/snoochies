export const TEMPLATE_PROFILES = ['base', 'docker'] as const;

export type TemplateProfile = (typeof TEMPLATE_PROFILES)[number];

export const TEMPLATE_PROFILE_LABELS: Record<TemplateProfile, string> = {
  base: 'Node + API (no Docker)',
  docker: 'Dockerized stack (API, frontend, and Postgres)',
};
