// Seleciona os elementos da tela
const tela1 = document.getElementById('tela1');
const tela3 = document.getElementById('tela3');
const addBtn = document.getElementById('addBtn');
const voltarBtn = document.getElementById('voltarBtn');
const salvarBtn = document.getElementById('salvarBtn');
const criarListaBtn = document.getElementById('criarListaBtn');
const minhasListas = document.getElementById('minhasListas');
const imagePreview = document.getElementById('imagePreview');
const imageDescription = document.getElementById('imageDescription');
const urlLink = document.getElementById('urlLink');

let listaSelecionada = null; // Variável para armazenar a lista selecionada

// Função para extrair tags do texto (começando com #)
function extrairTags(descricao) {
  const tags = descricao.match(/#[a-zA-Z0-9]+/g); // Captura todas as palavras iniciadas por #
  return tags ? tags.map(tag => tag.toLowerCase()) : []; // Converte as tags para minúsculas e retorna
}

// Remove as tags do texto da descrição
function removerTagsDoTexto(descricao) {
  return descricao.replace(/#[a-zA-Z0-9]+/g, '').trim(); // Remove as tags e espaços extras
}

// Inicializa as listas salvas
function carregarListas() {
  const repositorio1 = JSON.parse(localStorage.getItem('repositorio1')) || {};
  minhasListas.innerHTML = '<option value="">Suas Listas</option>'; // Resetando
  Object.keys(repositorio1).forEach(lista => {
    const option = document.createElement('option');
    option.value = lista;
    option.textContent = lista;
    minhasListas.appendChild(option);
  });
}

// Mostra o formulário de adição diretamente ao clicar em "Add"
addBtn.addEventListener('click', function() {
  tela1.style.display = 'none';
  tela3.style.display = 'flex';
  carregarListas(); // Carrega as listas diretamente no dropdown
});

// Função para criar uma nova lista
criarListaBtn.addEventListener('click', function() {
  const nomeLista = prompt('Digite o nome da nova lista:');
  if (nomeLista) {
    const repositorio1 = JSON.parse(localStorage.getItem('repositorio1')) || {};
    if (!repositorio1[nomeLista]) {
      repositorio1[nomeLista] = [];
      localStorage.setItem('repositorio1', JSON.stringify(repositorio1));
      carregarListas(); // Atualiza o dropdown de listas
      alert(`Lista "${nomeLista}" criada com sucesso!`);
    } else {
      alert('Essa lista já existe!');
    }
  }
});

// Seleciona a lista automaticamente quando o usuário a escolhe no dropdown
minhasListas.addEventListener('change', function() {
  if (minhasListas.value) {
    listaSelecionada = minhasListas.value;
    //alert(`Lista "${listaSelecionada}" selecionada!`);//
  }
});

// Volta para a tela principal ao clicar em "Voltar"
voltarBtn.addEventListener('click', function() {
  tela3.style.display = 'none';
  tela1.style.display = 'flex';
});

// Atualiza a pré-visualização da imagem ao clicar no local da imagem
imagePreview.addEventListener('click', function() {
  const link = prompt('Insira o link ou caminho da imagem:');
  if (link) {
    imagePreview.innerHTML = `<img src="${link}" alt="Pré-visualização" style="width: 100%; height: 100%;">`;
  } else {
    imagePreview.innerHTML = 'Imagem';
  }
});

// Salva os dados no localStorage dentro da lista selecionada
salvarBtn.addEventListener('click', function() {
  const imageElement = imagePreview.querySelector('img');
  const link = imageElement ? imageElement.src : null;
  const description = imageDescription.value;
  const url = urlLink.value;

  // Extraindo tags da descrição
  const tags = extrairTags(description);

  // Removendo as tags da descrição para salvar
  const descricaoSemTags = removerTagsDoTexto(description);

  if (!link && !descricaoSemTags && url) {
    alert('O link externo não pode ser salvo sozinho. Preencha ao menos a imagem ou descrição.');
    return;
  }

  if (link || descricaoSemTags) {
    const repositorio1 = JSON.parse(localStorage.getItem('repositorio1')) || {};
    const item = {
      id: Date.now(),
      link: link || null,
      description: descricaoSemTags || null,
      url: url || null,
      tags: tags // Armazena as tags junto com o item
    };

    if (repositorio1[listaSelecionada]) {
      repositorio1[listaSelecionada].push(item);
      localStorage.setItem('repositorio1', JSON.stringify(repositorio1));
      alert('Item salvo com sucesso!');
    } else {
      alert('Erro: Lista não encontrada.');
    }

    // Limpa os campos
    imagePreview.innerHTML = 'Imagem';
    imageDescription.value = '';
    urlLink.value = '';
  } else {
    alert('Preencha pelo menos o caminho da imagem ou a descrição!');
  }
});

// Botão "Visualizar" redireciona para a página de visualização
document.getElementById('visualizarBtn').addEventListener('click', function() {
  window.location.href = 'visualizar.html';
});