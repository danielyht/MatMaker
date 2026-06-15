import { describe, expect, it } from 'vitest';
import { obterSemanaAtualRef, rotuloSemanaAtual } from './semanaRanking';

describe('semanaRanking', () => {
  it('retorna segunda-feira da semana em YYYY-MM-DD', () => {
    const ref = obterSemanaAtualRef(new Date('2026-05-27T15:00:00'));
    expect(ref).toBe('2026-05-25');
  });

  it('ajusta domingo para a segunda anterior', () => {
    const ref = obterSemanaAtualRef(new Date('2026-05-31T12:00:00'));
    expect(ref).toBe('2026-05-25');
  });

  it('formata rótulo da semana em pt-BR', () => {
    const rotulo = rotuloSemanaAtual('2026-05-25');
    expect(rotulo).toMatch(/25/);
    expect(rotulo).toMatch(/31/);
  });
});
