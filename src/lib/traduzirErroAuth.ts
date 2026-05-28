import { AuthApiError } from '@supabase/supabase-js';

export function traduzirErroAuth(
  erro: AuthApiError,
  contexto: 'login' | 'cadastro' | 'recuperacao' = 'cadastro',
): string {
  const msg = erro.message.toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar (verifique a caixa de entrada).';
  }
  if (msg.includes('already registered') || msg.includes('already been registered')) {
    return 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.';
  }
  if (msg.includes('password') && (msg.includes('short') || msg.includes('least'))) {
    return 'A senha é fraca. Use pelo menos 6 caracteres.';
  }
  if (msg.includes('invalid') && msg.includes('email')) {
    return 'Informe um e-mail válido.';
  }
  if (msg.includes('signup') && msg.includes('disabled')) {
    return 'Cadastros estão desativados no momento. Entre em contato com o suporte.';
  }
  if (msg.includes('too many requests')) {
    return 'Muitas tentativas. Aguarde um momento e tente de novo.';
  }

  if (contexto === 'login') {
    return erro.message || 'Não foi possível entrar. Tente novamente.';
  }
  if (contexto === 'recuperacao') {
    return erro.message || 'Não foi possível concluir a recuperação. Tente novamente.';
  }
  return erro.message || 'Não foi possível criar a conta. Tente novamente.';
}
