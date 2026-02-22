const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const CAMINHO_ARQUIVO = path.join(__dirname, '..', 'data', 'usuarios.json');

async function lerUsuarios() {
  try {
    const conteudo = await fs.readFile(CAMINHO_ARQUIVO, 'utf-8');
    return JSON.parse(conteudo);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function salvarUsuarios(usuarios) {
  await fs.mkdir(path.dirname(CAMINHO_ARQUIVO), { recursive: true });
  await fs.writeFile(CAMINHO_ARQUIVO, JSON.stringify(usuarios, null, 2), 'utf-8');
}

async function buscarUsuarioPorEmailLocal(email) {
  const usuarios = await lerUsuarios();
  return usuarios.find((usuario) => usuario.email === email) || null;
}

async function criarUsuarioLocal({ nome, email, senha, tipo }) {
  const usuarios = await lerUsuarios();

  if (usuarios.some((usuario) => usuario.email === email)) {
    const erro = new Error('E-mail já cadastrado.');
    erro.code = 11000;
    throw erro;
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const novoUsuario = {
    _id: crypto.randomUUID(),
    nome,
    email,
    senha: senhaHash,
    tipo
  };

  usuarios.push(novoUsuario);
  await salvarUsuarios(usuarios);

  return novoUsuario;
}

async function compararSenhaLocal(usuario, senha) {
  return bcrypt.compare(senha, usuario.senha);
}

module.exports = {
  buscarUsuarioPorEmailLocal,
  criarUsuarioLocal,
  compararSenhaLocal
};
