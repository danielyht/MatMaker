import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PodioRanking } from './PodioRanking';
import type { EntradaRanking, EntradaRankingCompleta } from '../../lib/ranking';

const topTres: EntradaRanking[] = [
  { id: '1', nome: 'Ana Silva', foto_url: null, pontos: 300 },
  { id: '2', nome: 'Bruno Costa', foto_url: null, pontos: 200 },
  { id: '3', nome: 'Carla Lima', foto_url: null, pontos: 100 },
];

const dadosCompletos: EntradaRankingCompleta[] = topTres.map((e) => ({
  ...e,
  pontos_semana: 0,
  semana_ref: '',
}));

describe('PodioRanking', () => {
  it('renderiza pódio com top 3', () => {
    render(
      <PodioRanking topTres={topTres} dadosCompletos={dadosCompletos} modo="geral" />,
    );

    expect(screen.getByText(/Pódio — top 3/i)).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Bruno')).toBeInTheDocument();
    expect(screen.getByText('Carla')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
  });

  it('destaca o usuário logado', () => {
    render(
      <PodioRanking
        topTres={topTres}
        dadosCompletos={dadosCompletos}
        modo="geral"
        meuId="2"
      />,
    );

    expect(screen.getByText('você')).toBeInTheDocument();
  });

  it('não renderiza sem jogadores', () => {
    const { container } = render(
      <PodioRanking topTres={[]} dadosCompletos={[]} modo="geral" />,
    );
    expect(container.firstChild).toBeNull();
  });
});
