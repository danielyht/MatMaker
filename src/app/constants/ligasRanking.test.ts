import { describe, expect, it } from 'vitest';
import { obterLigaPorPontos, progressoNaLiga } from './ligasRanking';

describe('obterLigaPorPontos', () => {
  it('retorna bronze para 0 pontos', () => {
    expect(obterLigaPorPontos(0).id).toBe('bronze');
  });

  it('retorna prata a partir de 500', () => {
    expect(obterLigaPorPontos(500).id).toBe('prata');
    expect(obterLigaPorPontos(1199).id).toBe('prata');
  });

  it('retorna ascendente no topo', () => {
    expect(obterLigaPorPontos(5000).id).toBe('ascendente');
  });
});

describe('progressoNaLiga', () => {
  it('calcula percentual até a próxima liga', () => {
    const { atual, proxima, percentual, pontosParaProxima } = progressoNaLiga(250);
    expect(atual.id).toBe('bronze');
    expect(proxima?.id).toBe('prata');
    expect(percentual).toBe(50);
    expect(pontosParaProxima).toBe(250);
  });

  it('retorna 100% na liga máxima', () => {
    const { percentual, proxima } = progressoNaLiga(5000);
    expect(proxima).toBeNull();
    expect(percentual).toBe(100);
  });
});
