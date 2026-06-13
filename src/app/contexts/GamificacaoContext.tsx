import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  calcularConquistasDesbloqueadas,
  criarContextoConquistas,
  indiceLigaPorPontos,
  obterConquista,
  CONQUISTAS,
  type ConquistaDef,
  type ConquistaId,
} from '../constants/conquistas';
import { LIGAS_RANKING, obterLigaPorPontos, type LigaRanking } from '../constants/ligasRanking';
import { lerConquistasVistas, marcarConquistaVista } from '../lib/conquistasStorage';
import { ModalSubidaLiga } from '../components/ModalSubidaLiga';
import { ModalConquista } from '../components/ModalConquista';

export type EventoGamificacao =
  | { tipo: 'subida-liga'; anterior: LigaRanking; nova: LigaRanking }
  | { tipo: 'conquista'; conquista: ConquistaDef };

type GamificacaoContextValue = {
  conquistasDesbloqueadas: ConquistaDef[];
  totalConquistas: number;
  totalPossivel: number;
  idsDesbloqueados: Set<ConquistaId>;
};

const GamificacaoContext = createContext<GamificacaoContextValue | null>(null);

export function GamificacaoProvider({ children }: { children: ReactNode }) {
  const { perfil } = useAuth();
  const [fila, setFila] = useState<EventoGamificacao[]>([]);
  const [eventoAtual, setEventoAtual] = useState<EventoGamificacao | null>(null);

  const perfilInicializado = useRef(false);
  const pontosAnterior = useRef(0);
  const conquistasAnteriores = useRef<Set<ConquistaId>>(new Set());

  const ctx = perfil ? criarContextoConquistas(perfil) : null;
  const conquistasDesbloqueadas = useMemo(
    () => (ctx ? calcularConquistasDesbloqueadas(ctx) : []),
    [ctx],
  );
  const idsDesbloqueados = useMemo(
    () => new Set(conquistasDesbloqueadas.map((c) => c.id)),
    [conquistasDesbloqueadas],
  );

  const enfileirar = useCallback((eventos: EventoGamificacao[]) => {
    if (eventos.length === 0) return;
    setFila((prev) => [...prev, ...eventos]);
  }, []);

  useEffect(() => {
    if (!perfil) {
      perfilInicializado.current = false;
      pontosAnterior.current = 0;
      conquistasAnteriores.current = new Set();
      return;
    }

    const contexto = criarContextoConquistas(perfil);
    const desbloqueadas = calcularConquistasDesbloqueadas(contexto);
    const idsAtuais = new Set(desbloqueadas.map((c) => c.id));

    if (!perfilInicializado.current) {
      pontosAnterior.current = perfil.pontos;
      conquistasAnteriores.current = idsAtuais;
      perfilInicializado.current = true;
      return;
    }

    const novosEventos: EventoGamificacao[] = [];
    const vistos = lerConquistasVistas(perfil.id);

    if (perfil.pontos > pontosAnterior.current) {
      const indiceAntes = indiceLigaPorPontos(pontosAnterior.current);
      const indiceDepois = indiceLigaPorPontos(perfil.pontos);
      if (indiceDepois > indiceAntes) {
        novosEventos.push({
          tipo: 'subida-liga',
          anterior: obterLigaPorPontos(pontosAnterior.current),
          nova: LIGAS_RANKING[indiceDepois],
        });
      }
    }

    for (const id of idsAtuais) {
      if (!conquistasAnteriores.current.has(id) && !vistos.has(id)) {
        novosEventos.push({ tipo: 'conquista', conquista: obterConquista(id) });
      }
    }

    pontosAnterior.current = perfil.pontos;
    conquistasAnteriores.current = idsAtuais;

    if (novosEventos.length > 0) enfileirar(novosEventos);
  }, [perfil, enfileirar]);

  useEffect(() => {
    if (eventoAtual || fila.length === 0) return;
    setEventoAtual(fila[0]);
    setFila((prev) => prev.slice(1));
  }, [fila, eventoAtual]);

  const fecharEvento = useCallback(() => {
    if (eventoAtual?.tipo === 'conquista' && perfil) {
      marcarConquistaVista(perfil.id, eventoAtual.conquista.id);
    }
    setEventoAtual(null);
  }, [perfil, eventoAtual]);

  const valor = useMemo(
    () => ({
      conquistasDesbloqueadas,
      totalConquistas: conquistasDesbloqueadas.length,
      totalPossivel: CONQUISTAS.length,
      idsDesbloqueados,
    }),
    [conquistasDesbloqueadas, idsDesbloqueados],
  );

  return (
    <GamificacaoContext.Provider value={valor}>
      {children}

      {eventoAtual?.tipo === 'subida-liga' && (
        <ModalSubidaLiga
          anterior={eventoAtual.anterior}
          nova={eventoAtual.nova}
          onFechar={fecharEvento}
        />
      )}

      {eventoAtual?.tipo === 'conquista' && (
        <ModalConquista conquista={eventoAtual.conquista} onFechar={fecharEvento} />
      )}
    </GamificacaoContext.Provider>
  );
}

export function useGamificacao(): GamificacaoContextValue {
  const ctx = useContext(GamificacaoContext);
  const { perfil } = useAuth();

  const fallback = useMemo((): GamificacaoContextValue => {
    if (!perfil) {
      return {
        conquistasDesbloqueadas: [],
        totalConquistas: 0,
        totalPossivel: CONQUISTAS.length,
        idsDesbloqueados: new Set(),
      };
    }
    const conquistasDesbloqueadas = calcularConquistasDesbloqueadas(
      criarContextoConquistas(perfil),
    );
    return {
      conquistasDesbloqueadas,
      totalConquistas: conquistasDesbloqueadas.length,
      totalPossivel: CONQUISTAS.length,
      idsDesbloqueados: new Set(conquistasDesbloqueadas.map((c) => c.id)),
    };
  }, [perfil]);

  return ctx ?? fallback;
}
