import type { ConquistaId } from '../constants/conquistas';
import type { LigaId } from '../constants/ligasRanking';

const PREFIXO_CONQUISTAS = 'matmaker_conquistas_vistas_';

function chave(userId: string) {
  return `${PREFIXO_CONQUISTAS}${userId}`;
}

export function lerConquistasVistas(userId: string): Set<ConquistaId> {
  try {
    const raw = localStorage.getItem(chave(userId));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function marcarConquistaVista(userId: string, id: ConquistaId) {
  try {
    const vistos = lerConquistasVistas(userId);
    vistos.add(id);
    localStorage.setItem(chave(userId), JSON.stringify([...vistos]));
  } catch {
    /* ignore */
  }
}

export function marcarSubidaLigaVista(userId: string, ligaId: LigaId) {
  try {
    localStorage.setItem(`${chave(userId)}_liga_${ligaId}`, '1');
  } catch {
    /* ignore */
  }
}

export function subidaLigaJaVista(userId: string, ligaId: LigaId): boolean {
  try {
    return localStorage.getItem(`${chave(userId)}_liga_${ligaId}`) === '1';
  } catch {
    return false;
  }
}
