import { describe, expect, it } from 'vitest';
import { formatarCodigoTurma, rotaInicialPorPapel } from '../app/constants/turmas';
import { gerarCodigoTurma } from './turmas';

describe('formatarCodigoTurma', () => {
  it('remove caracteres inválidos e limita a 6', () => {
    expect(formatarCodigoTurma('ab-12 3xy')).toBe('AB123X');
  });

  it('converte para maiúsculas', () => {
    expect(formatarCodigoTurma('abc123')).toBe('ABC123');
  });
});

describe('rotaInicialPorPapel', () => {
  it('redireciona professor e aluno corretamente', () => {
    expect(rotaInicialPorPapel('professor')).toBe('/professor');
    expect(rotaInicialPorPapel('aluno')).toBe('/dashboard');
  });
});

describe('gerarCodigoTurma', () => {
  it('gera código com 6 caracteres alfanuméricos', () => {
    const codigo = gerarCodigoTurma();
    expect(codigo).toHaveLength(6);
    expect(codigo).toMatch(/^[A-Z2-9]{6}$/);
  });
});
