/** Segunda-feira da semana corrente (fuso local), formato YYYY-MM-DD. */
export function obterSemanaAtualRef(data = new Date()): string {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  const dia = d.getDay();
  const diff = d.getDate() - dia + (dia === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

export function rotuloSemanaAtual(ref = obterSemanaAtualRef()): string {
  const inicio = new Date(`${ref}T12:00:00`);
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + 6);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return `${fmt(inicio)} – ${fmt(fim)}`;
}
