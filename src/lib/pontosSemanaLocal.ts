const PREFIXO = 'matmaker_pontos_semana_';

interface PontosSemanaLocal {
  ref: string;
  pontos: number;
}

export function lerPontosSemanaLocal(userId: string): PontosSemanaLocal {
  try {
    const raw = localStorage.getItem(`${PREFIXO}${userId}`);
    if (!raw) return { ref: '', pontos: 0 };
    const parsed = JSON.parse(raw) as PontosSemanaLocal;
    return {
      ref: parsed.ref ?? '',
      pontos: parsed.pontos ?? 0,
    };
  } catch {
    return { ref: '', pontos: 0 };
  }
}

export function salvarPontosSemanaLocal(userId: string, ref: string, pontos: number) {
  try {
    localStorage.setItem(`${PREFIXO}${userId}`, JSON.stringify({ ref, pontos }));
  } catch {
    /* ignore */
  }
}
