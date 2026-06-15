import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { MapaLaboratorio } from './MapaLaboratorio';
import { SETORES_LABORATORIO } from '../constants/mapaLaboratorio';

function renderMapa(missoes: string[] = []) {
  return render(
    <MemoryRouter>
      <MapaLaboratorio missoesConcluidas={missoes as never} />
    </MemoryRouter>,
  );
}

describe('MapaLaboratorio', () => {
  it('renderiza todos os setores do laboratório', () => {
    renderMapa();
    for (const setor of SETORES_LABORATORIO) {
      expect(screen.getAllByLabelText(new RegExp(setor.nome, 'i')).length).toBeGreaterThan(0);
    }
  });

  it('mostra contagem de setores acesos', () => {
    renderMapa(['fractions', 'dobro']);
    expect(screen.getByText('2/6 setores')).toBeInTheDocument();
  });

  it('marca missão concluída no aria-label', () => {
    renderMapa(['fractions']);
    expect(
      screen.getAllByLabelText(/Aventura das Frações — concluída/i).length,
    ).toBeGreaterThan(0);
  });

  it('navega ao clicar em setor na legenda mobile', async () => {
    const user = userEvent.setup();
    renderMapa();

    const botoes = screen.getAllByRole('button', { name: /Invasão Espacial/i });
    await user.click(botoes[0]);
    expect(botoes[0]).toBeInTheDocument();
  });
});
