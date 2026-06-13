export type PapelUsuario = 'aluno' | 'professor';

export interface Turma {
  id: string;
  nome: string;
  codigo: string;
  professor_id: string;
  criado_em: string;
  total_alunos?: number;
}

export interface TurmaResumo {
  id: string;
  nome: string;
}

export interface AlunoTurma {
  id: string;
  nome: string;
  foto_url: string | null;
  pontos: number;
  jogos_completados: number;
  missoes_concluidas: string[];
  entrou_em: string;
}

export function rotaInicialPorPapel(papel: PapelUsuario): string {
  return papel === 'professor' ? '/professor' : '/dashboard';
}

export function formatarCodigoTurma(codigo: string): string {
  return codigo.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
}
