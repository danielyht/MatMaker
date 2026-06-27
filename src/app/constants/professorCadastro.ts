/** Opções de matéria no cadastro de professor */
export const MATERIAS_PROFESSOR = [
  'Matemática',
  'Ciências',
  'Educação Infantil / Anos Iniciais',
  'Multidisciplinar',
  'Outra',
] as const;

export type MateriaPreset = (typeof MATERIAS_PROFESSOR)[number];

export function resolverMateriaProfessor(preset: string, outra: string): string {
  if (preset === 'Outra') return outra.trim();
  return preset.trim();
}

export function perfilProfessorCompleto(
  perfil: { papel?: string; instituicao?: string | null; materia?: string | null } | null,
): boolean {
  if (!perfil || perfil.papel !== 'professor') return true;
  return Boolean(perfil.instituicao?.trim() && perfil.materia?.trim());
}
