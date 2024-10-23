// Recupera as listas salvas do localStorage (dentro de 'repositorio1')
const repositorio1 = JSON.parse(localStorage.getItem('repositorio1')) || {};
const listasDropdown = document.getElementById('listasDropdown');
const groupContainer = document.getElementById('groupContainer');
const searchBtn = document.querySelector('.search-btn'); // Botão de busca


function selecionarItem() {
  // Ação ao selecionar a lista
  alert("Item selecionado!");
}

function deletarItem(event) {
  event.stopPropagation(); // Impede que o clique no botão delete selecione o item
  // Ação para deletar o item
  alert("Item excluído!");
}




// Atualiza o nome da lista no botão dropdown
const dropdownBtn = document.querySelector('.dropdown-btn');
const deleteBtn = document.querySelector('.delete-btn'); // Botão de deletar ao lado do dropdown
let imagemSelecionada = null; // Variável para armazenar a imagem selecionada

// Seleciona a caixa modal e o parágrafo de descrição
const modalNotas = document.getElementById('modalNotas');
const notasDescricao = document.getElementById('notasDescricao');

// Função para abrir a caixa de notas
function abrirModalNotas(descricao) {
  notasDescricao.textContent = descricao || 'Sem descrição disponível';
  modalNotas.style.display = 'block'; // Exibe a modal
}

// Função para fechar a caixa de notas
function fecharModalNotas() {
  modalNotas.style.display = 'none'; // Oculta a modal
}

// Exibe as listas no dropdown com botão de deletar
function renderizarListas() {
  listasDropdown.innerHTML = ''; // Limpa as listas atuais

  Object.keys(repositorio1).forEach(listaNome => {
    const a = document.createElement('a');
    a.textContent = listaNome;
    a.href = "#";

    // Quando clicar na lista, exibir os itens dessa lista
    a.addEventListener('click', function(e) {
      e.preventDefault();
      mostrarItensDaLista(listaNome);
    });

    // Cria um contêiner para o nome da lista e o botão de deletar
    const listaItem = document.createElement('div');
    listaItem.className = 'lista-item';

    // Botão de deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Previne que o clique no botão também abra a lista

      const confirmar = confirm(`Deseja apagar a lista "${listaNome}"?`);
      if (confirmar) {
        delete repositorio1[listaNome]; // Remove a lista do objeto
        localStorage.setItem('repositorio1', JSON.stringify(repositorio1)); // Atualiza o localStorage
        renderizarListas(); // Atualiza o dropdown
        groupContainer.innerHTML = ''; // Limpa o conteúdo exibido
        dropdownBtn.textContent = 'Suas Listas'; // Reseta o nome no botão
      }
    });

    // Adiciona o nome da lista e o botão de deletar ao contêiner
    listaItem.appendChild(a);
    listaItem.appendChild(deleteBtn);

    // Adiciona o contêiner ao dropdown
    listasDropdown.appendChild(listaItem);
  });
}

// Exibe os itens da lista selecionada e agrupa de 3 em 3
function mostrarItensDaLista(listaNome) {
  dropdownBtn.textContent = listaNome;
  listasDropdown.style.display = 'none';

  const listaItens = repositorio1[listaNome] || [];
  groupContainer.innerHTML = ''; // Limpa os grupos atuais

  // Limpa os resultados da busca quando uma lista é selecionada
  const searchResultContainer = document.getElementById('searchResultContainer');
  if (searchResultContainer) {
    searchResultContainer.innerHTML = ''; // Limpa os resultados de busca
    searchResultContainer.style.display = 'none'; // Oculta o contêiner de resultados da busca
  }

  // Restaura a exibição do contêiner de grupos
  groupContainer.style.display = 'flex'; // Mostra o contêiner principal novamente

  // Agrupando itens de 3 em 3
  for (let i = 0; i < listaItens.length; i += 3) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'image-group';

    // Adiciona cada item ao grupo
    for (let j = i; j < i + 3 && j < listaItens.length; j++) {
      const item = listaItens[j];
      const form = document.createElement('form');
      form.className = 'image-form';

      // Adiciona a imagem
      const img = document.createElement('img');
      img.src = item.link || 'placeholder.png';
      img.alt = `Imagem ${j + 1}`;
      img.dataset.index = j; // Armazena o índice do item para identificar

      // Evento para selecionar a imagem ao clicar
      img.addEventListener('click', function() {
        selecionarImagem(img);
      });

      // Cria o contêiner de botões
      const btnGroup = document.createElement('div');
      btnGroup.className = 'btn-group';

      // Botão de Link (agora priorizando 'url' sobre 'link')
      const btnLink = document.createElement('button');
      btnLink.className = 'btn btn-link';
      btnLink.textContent = 'Link';
      btnLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (item.url) {
          window.open(item.url, '_blank'); // Abre o "URL ou link externo"
        } else {
          alert('Link externo não disponível.');
        }
      });

      // Botão de Notas (Abre a caixa de descrição)
      const btnNotes = document.createElement('button');
      btnNotes.className = 'btn btn-notes';
      btnNotes.textContent = 'Notas';
      btnNotes.addEventListener('click', function(e) {
        e.preventDefault();
        abrirModalNotas(item.description);
      });

      // Adiciona os botões ao contêiner de botões
      btnGroup.appendChild(btnLink);
      btnGroup.appendChild(btnNotes);

      // Adiciona tudo ao formulário
      form.appendChild(img);
      form.appendChild(btnGroup);
      groupDiv.appendChild(form);
    }

    groupContainer.appendChild(groupDiv);
  }
}

// Função para manipular a seleção da imagem
function selecionarImagem(img) {
  if (imagemSelecionada) {
    imagemSelecionada.classList.remove('selecionada');
  }
  imagemSelecionada = img;
  imagemSelecionada.classList.add('selecionada');
}

// Função para deletar a imagem selecionada ao clicar no botão ao lado do dropdown
deleteBtn.addEventListener('click', function() {
  if (!imagemSelecionada) {
    alert('Selecione uma imagem para deletar.');
    return;
  }

  const listaNome = dropdownBtn.textContent;
  const itemIndex = imagemSelecionada.dataset.index;

  // Remove o item do array no localStorage
  repositorio1[listaNome].splice(itemIndex, 1); // Remove o item do array
  localStorage.setItem('repositorio1', JSON.stringify(repositorio1));

  // Atualiza a interface para refletir a mudança
  mostrarItensDaLista(listaNome);
  imagemSelecionada = null; // Limpa a seleção
});

// Mostra o dropdown novamente ao clicar no botão
dropdownBtn.addEventListener('click', function() {
  listasDropdown.style.display = listasDropdown.style.display === 'block' ? 'none' : 'block';
});

// Função para buscar itens por tags
searchBtn.addEventListener('click', function() {
  let tagBusca = prompt('Digite a(s) tag(s) para buscar:').trim();

  // Se o usuário não incluir o #, adicionamos automaticamente
  if (tagBusca && tagBusca[0] !== '#') {
    tagBusca = `#${tagBusca}`;
  }

  if (!tagBusca) {
    alert('Por favor, insira uma tag válida.');
    return;
  }

  const tagsArray = tagBusca.split(' ').map(tag => tag.trim().toLowerCase());

  // Limpa o contêiner de grupos
  groupContainer.innerHTML = '';
  // Esconde o contêiner de grupos
  groupContainer.style.display = 'none';

  // Mostra o contêiner de resultados da busca
  const searchResultContainer = document.getElementById('searchResultContainer');
  searchResultContainer.style.display = 'flex';
  searchResultContainer.innerHTML = ''; // Limpa resultados anteriores

  const listaSelecionada = dropdownBtn.textContent !== 'Suas Listas'; // Verifica se uma lista foi selecionada
  const listasParaBuscar = listaSelecionada ? [dropdownBtn.textContent] : Object.keys(repositorio1); // Seleciona a lista ou todas

  listasParaBuscar.forEach(listaNome => {
    const listaItens = repositorio1[listaNome] || [];

    const itensComTag = listaItens.filter(item => {
      if (!item.tags) return false;
      return tagsArray.some(tag => item.tags.includes(tag));
    });

    if (itensComTag.length > 0) {
      // Não cria um novo grupo para as listas, mas adiciona diretamente no contêiner de resultados
      itensComTag.forEach((item, index) => {
        const form = document.createElement('div'); // Troca 'form' por 'div' para manter o novo layout
        form.className = 'search-result-form'; // Adiciona a classe para os resultados da busca

        // Adiciona a imagem
        const img = document.createElement('img');
        img.src = item.link || 'placeholder.png';
        img.alt = `Imagem ${index + 1}`;

        // Cria o contêiner de botões
        const btnGroup = document.createElement('div');
        btnGroup.className = 'search-result-btn-group'; // Usar a classe para botões do resultado da busca

        // Botão de Link (prioriza 'url' sobre 'link')
        const btnLink = document.createElement('button');
        btnLink.className = 'btn btn-link';
        btnLink.textContent = 'Link';
        btnLink.addEventListener('click', function(e) {
          e.preventDefault();
          if (item.url) {
            window.open(item.url, '_blank');
          } else {
            alert('Link externo não disponível.');
          }
        });

        // Botão de Notas (Abre a caixa de descrição)
        const btnNotes = document.createElement('button');
        btnNotes.className = 'btn btn-notes';
        btnNotes.textContent = 'Notas';
        btnNotes.addEventListener('click', function(e) {
          e.preventDefault();
          abrirModalNotas(item.description);
        });

        // Adiciona os botões ao contêiner de botões
        btnGroup.appendChild(btnLink);
        btnGroup.appendChild(btnNotes);

        // Adiciona tudo ao formulário
        form.appendChild(img);
        form.appendChild(btnGroup);
        searchResultContainer.appendChild(form); // Adiciona no contêiner de resultados
      });
    }
  });
});



// Inicializa a página renderizando as listas no dropdown
renderizarListas();