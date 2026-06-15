import { describe, expect, it } from 'vitest';
import {
  faixaPontosLiga,
  prepararListaRanking,
  tituloModoRanking,
  usuarioNaLiga,
  type EntradaRankingCompleta,
} from './ranking';

const base: EntradaRankingCompleta[] = [
  {
    id: '1',
    nome: 'Ana',
    foto_url: null,
    pontos: 1500,
    pontos_semana: 80,
    semana_ref: '2026-05-25',
  },
  {
    id: '2',
    nome: 'Bruno',
    foto_url: null,
    pontos: 600,
    pontos_semana: 120,
    semana_ref: '2026-05-25',
  },
  {
    id: '3',
    nome: 'Carla',
    foto_url: null,
    pontos: 100,
    pontos_semana: 0,
    semana_ref: '2026-05-25',
  },
];

describe('prepararListaRanking', () => {
  it('ordena ranking geral por pontos decrescente', () => {
    const lista = prepararListaRanking(base, 'geral');
    expect(lista.map((e) => e.nome)).toEqual(['Ana', 'Bruno', 'Carla']);
    expect(lista[0].pontos).toBe(1500);
  });

  it('filtra por liga bronze', () => {
    const lista = prepararListaRanking(base, 'liga', { ligaId: 'bronze' });
    expect(lista).toHaveLength(1);
    expect(lista[0].nome).toBe('Carla');
  });

  it('filtra ranking semanal com pontos da semana', () => {
    const lista = prepararListaRanking(base, 'semanal', { semanaRef: '2026-05-25' });
    expect(lista.map((e) => e.nome)).toEqual(['Bruno', 'Ana']);
    expect(lista[0].pontos).toBe(120);
  });
});

describe('faixaPontosLiga e usuarioNaLiga', () => {
  it('define faixa da liga prata', () => {
    expect(faixaPontosLiga('prata')).toEqual({ min: 500, max: 1199 });
  });

  it('identifica usuário na liga ouro', () => {
    expect(usuarioNaLiga(1300, 'ouro')).toBe(true);
    expect(usuarioNaLiga(400, 'ouro')).toBe(false);
  });
});

describe('tituloModoRanking', () => {
  it('retorna títulos por modo', () => {
    expect(tituloModoRanking('geral')).toBe('Classificação geral');
    expect(tituloModoRanking('liga', 'prata')).toBe('Liga Prata');
    expect(tituloModoRanking('semanal')).toBe('Ranking semanal');
  });
});
