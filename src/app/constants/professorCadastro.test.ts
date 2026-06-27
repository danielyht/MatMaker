import { describe, expect, it } from 'vitest';
import {
  perfilProfessorCompleto,
  resolverMateriaProfessor,
} from './professorCadastro';

describe('professorCadastro', () => {
  it('resolverMateriaProfessor usa preset ou texto livre', () => {
    expect(resolverMateriaProfessor('Matemática', '')).toBe('Matemática');
    expect(resolverMateriaProfessor('Outra', ' História ')).toBe('História');
  });

  it('perfilProfessorCompleto exige dados só para professor', () => {
    expect(perfilProfessorCompleto({ papel: 'aluno' })).toBe(true);
    expect(perfilProfessorCompleto({ papel: 'professor', instituicao: 'Escola X', materia: 'Matemática' })).toBe(true);
    expect(perfilProfessorCompleto({ papel: 'professor', instituicao: '', materia: 'Matemática' })).toBe(false);
  });
});
