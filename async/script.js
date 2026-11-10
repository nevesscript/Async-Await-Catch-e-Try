
const input = document.getElementById('inputSerie');
const button = document.getElementById('btnBuscar');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultados');

// Evento de clique no botão
button.addEventListener('click', () => {
    buscarSerie();
});

// Função responsável por buscar as séries
async function buscarSerie() {

    // Captura o texto digitado pelo usuário
    const nomeSerie = input.value.trim();

    // Verifica se o campo está vazio
    if (nomeSerie === '') {
        mensagem.textContent = 'Digite o nome de uma série!';
        resultado.innerHTML = '';
        return;
    }

    // Monta a URL da API
    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(nomeSerie)}`;

    // Mostra mensagem de carregamento
    mensagem.textContent = 'Buscando séries...';

    // Limpa os resultados anteriores
    resultado.innerHTML = '';

    try {

        // Faz a requisição para a API
        const response = await fetch(url);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar séries.');
        }

        // Converte a resposta para JSON
        const dados = await response.json();

        // Verifica se encontrou alguma série
        if (dados.length === 0) {
            mensagem.textContent = 'Nenhuma série encontrada!';
            return;
        }

        // Limpa a mensagem
        mensagem.textContent = `${dados.length} resultado(s) encontrado(s).`;

        // Percorre todas as séries encontradas
        dados.forEach((item) => {

            // Acessa os dados da série
            const serie = item.show;

            // Cria um elemento div
            const card = document.createElement('div');

            // Adiciona a classe CSS
            card.classList.add('card');

            // Verifica se existe imagem
            const imagem = serie.image
                ? serie.image.medium
                : 'https://placehold.co/210x295?text=Sem+imagem';

            // Verifica se existe nota
            const nota = serie.rating.average
                ? serie.rating.average
                : 'Sem avaliação';

            // Monta o conteúdo do card
            card.innerHTML = `
                <img src="${imagem}" alt="Poster de ${serie.name}">

                <h2>${serie.name}</h2>

                <p><strong>Nota:</strong> ${nota}</p>

                <p><strong>Gêneros:</strong>
                    ${serie.genres.length > 0
                        ? serie.genres.join(', ')
                        : 'Não informado'}
                </p>
            `;

            // Adiciona o card dentro do resultado
            resultado.appendChild(card);

        });

    } catch (erro) {

        // Captura erros da requisição
        console.error(erro);
        mensagem.textContent = 'Ocorreu um erro ao buscar as séries.';

    }
}
