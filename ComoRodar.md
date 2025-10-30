# O Projeto

Este é um jogo de luta simples criado com HTML5 canvas e JavaScript. Possui três modos de jogo:
* `Básico` - com um jogador ativo e um inativo.
* `Multijogador` - com dois jogadores ativos em um computador.
* `Rede` - com dois jogadores ativos, jogando pela rede.

Cada modo pode ser facilmente escolhido selecionando um `gameType` ao especificar as opções do jogo.

Para o jogo em rede você precisa instalar o servidor:

    git clone 
    cd mk.js/server
    npm install
    node server.js

O servidor será iniciado na porta `55555`. Abra seu navegador e vá para `http://localhost:55555`. Ambos os jogadores devem inserir o mesmo nome de jogo para jogar juntos.

# Configuração

Nesta seção descreverei brevemente como você pode configurar o mk.js.

* `arena` - objeto que contém diferentes propriedades para a arena.
    * `arena` - tipo da arena. As diferentes arenas estão listadas em: `mk.arenas.types`
    * `container` - contêiner pai do canvas que é a arena atual.
* `fighters` - array de dois objetos que são os dois jogadores.
    * `name` - nome do jogador. É uma string insensível a maiúsculas/minúsculas sem caracteres especiais e espaços em branco.
* `callbacks` - callbacks que serão invocados quando alguns eventos acontecerem.
    * `attack` - callback que será invocado em ataques bem-sucedidos
    * `game-end` - callback que será invocado no fim do jogo
    * `player-connected` - callback que será invocado no jogo em `rede` quando o segundo jogador se conectar.
* `game-type` - especifica o controlador de jogo que será usado. Valores possíveis são: `network`, `basic` e `multiplayer`.
* `gameName` - usado no jogo em `rede`.
* `isHost` - usado no jogo em `rede`, informa ao controlador de jogo se o usuário atual criou o jogo.
* `reset` - um método que reinicia o jogo. Ele limpa algumas referências e chama os métodos de reset dos componentes de nível inferior. Chamá-lo levará à remoção do canvas do jogo.

# Licença

Este software é distribuído sob os termos da licença MIT.
