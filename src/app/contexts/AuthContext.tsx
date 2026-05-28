import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { adicionarPontos } from '../../lib/pontos';
import { registrarJogoConcluido } from '../../lib/jogosConcluidos';

export type Perfil = {
  id: string;
  nome: string;
  email: string;
  foto_url: string | null;
  pontos: number;
  jogos_completados: number;
};

type AuthContextValue = {
  session: Session | null;
  perfil: Perfil | null;
  carregando: boolean;
  /** Sessão válida com usuário identificado (JWT verificado no servidor). */
  autenticado: boolean;
  sair: () => Promise<void>;
  recarregarPerfil: () => Promise<void>;
  /** Persiste pontos no Supabase e atualiza o perfil na hora. */
  ganharPontos: (quantidade: number) => Promise<void>;
  /** Incrementa jogos_completados no perfil (uma vez por conclusão de missão). */
  marcarMissaoConcluida: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  const buscarPerfil = useCallback(async (userId: string) => {
    if (!supabase) {
      setPerfil(null);
      return;
    }
    const { data } = await supabase
      .from('perfis')
      .select('id, nome, email, foto_url, pontos, jogos_completados')
      .eq('id', userId)
      .maybeSingle();
    setPerfil(
      data
        ? {
            ...data,
            pontos: data.pontos ?? 0,
            jogos_completados: data.jogos_completados ?? 0,
          }
        : null,
    );
  }, []);

  const recarregarPerfil = useCallback(async () => {
    if (session?.user.id) await buscarPerfil(session.user.id);
  }, [session?.user.id, buscarPerfil]);

  useEffect(() => {
    if (!supabase) {
      setCarregando(false);
      return;
    }

    let ativo = true;

    async function validarSessaoInicial() {
      const { data: sessaoLocal } = await supabase.auth.getSession();

      if (!ativo) return;

      if (!sessaoLocal.session) {
        setSession(null);
        setCarregando(false);
        return;
      }

      const { data: usuarioRemoto, error } = await supabase.auth.getUser();

      if (!ativo) return;

      if (error || !usuarioRemoto.user) {
        await supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(sessaoLocal.session);
      }

      setCarregando(false);
    }

    void validarSessaoInicial();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      if (!ativo) return;
      setSession(novaSessao);
      if (!novaSessao) setPerfil(null);
    });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user.id) {
      buscarPerfil(session.user.id);
    } else {
      setPerfil(null);
    }
  }, [session?.user.id, buscarPerfil]);

  const sair = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setPerfil(null);
  }, []);

  const ganharPontos = useCallback(
    async (quantidade: number) => {
      const userId = session?.user?.id;
      if (!userId || quantidade <= 0) return;

      const { pontos, erro } = await adicionarPontos(userId, quantidade);
      if (!erro && pontos !== null) {
        setPerfil((prev) => (prev ? { ...prev, pontos } : null));
      }
    },
    [session?.user?.id],
  );

  const marcarMissaoConcluida = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    const { jogos_completados, erro } = await registrarJogoConcluido(userId);
    if (!erro && jogos_completados !== null) {
      setPerfil((prev) => (prev ? { ...prev, jogos_completados } : null));
    }
  }, [session?.user?.id]);

  const autenticado = Boolean(session?.user?.id);

  const valor = useMemo(
    () => ({
      session,
      perfil,
      carregando,
      autenticado,
      sair,
      recarregarPerfil,
      ganharPontos,
      marcarMissaoConcluida,
    }),
    [
      session,
      perfil,
      carregando,
      autenticado,
      sair,
      recarregarPerfil,
      ganharPontos,
      marcarMissaoConcluida,
    ],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
