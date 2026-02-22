const URL_PADRAO_API = 'http://localhost:3000';

export const API_URL = import.meta.env.VITE_API_URL || URL_PADRAO_API;

export async function lerResposta(response) {
  const texto = await response.text();

  if (!texto) {
    return {};
  }

  try {
    return JSON.parse(texto);
  } catch {
    return { message: texto };
  }
}

export function mensagemDeErroDeRede(error) {
  if (error instanceof TypeError) {
    return 'Não foi possível conectar com a API. Verifique se o backend está rodando na porta 3000.';
  }

  return error.message || 'Ocorreu um erro inesperado.';
}
