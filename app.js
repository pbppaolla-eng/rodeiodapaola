// app.js — Versão adaptada para Vercel com PostgreSQL e comentários detalhados

// 1. IMPORTAÇÃO DE DEPENDÊNCIAS
// -----------------------------------------------------------------------------
// 'express': Framework web rápido e minimalista para Node.js. Gerencia rotas e requisições HTTP.
const express = require('express');

// 'body-parser': Middleware para analisar o corpo das requisições (req.body), útil para formulários.
const bodyParser = require('body-parser');

// 'pg': Biblioteca 'node-postgres' para conectar e interagir com bancos de dados PostgreSQL.
// Substitui o 'sqlite3' pois o SQLite (arquivo local) não persiste dados na Vercel (serverless).
const { Pool } = require('pg');

// Carrega variáveis de ambiente do arquivo .env para desenvolvimento local
require('dotenv').config();

// 2. CONFIGURAÇÃO DA APLICAÇÃO
// -----------------------------------------------------------------------------
const app = express();
const port = process.env.PORT || 3000; // Usa a porta definida pelo ambiente (Vercel) ou 3000 localmente.

// Configura o Express para servir arquivos estáticos (imagens, CSS, sons) da pasta 'resources'.
// Isso permite acessar arquivos como '/rodeo.jpg' diretamente pelo navegador.
app.use(express.static('resources'));

// Configura o body-parser para entender dados de formulários HTML (application/x-www-form-urlencoded).
// 'extended: true' permite objetos aninhados (embora não usado aqui, é boa prática).
app.use(bodyParser.urlencoded({ extended: true }));

// 3. CONFIGURAÇÃO DO BANCO DE DADOS (POSTGRESQL)
// -----------------------------------------------------------------------------
// Cria um 'pool' de conexões. Em vez de abrir/fechar uma conexão por requisição,
// o pool gerencia conexões reutilizáveis, o que é mais eficiente.
// A string de conexão deve estar na variável de ambiente DATABASE_URL (configurada na Vercel).
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para conexões seguras com alguns provedores de nuvem (como Neon/Vercel Postgres).
  }
});

// Função para inicializar o banco de dados (criar a tabela se não existir).
// É chamada assim que o servidor inicia.
const initDb = async () => {
  try {
    // Conecta ao banco para executar o comando.
    const client = await pool.connect();

    // Comando SQL para criar a tabela 'inscricoes'.
    // SERIAL: Cria um ID auto-incrementável (equivalente ao AUTOINCREMENT do SQLite).
    // TIMESTAMP DEFAULT CURRENT_TIMESTAMP: Salva a data/hora automaticamente.
    await client.query(`
      CREATE TABLE IF NOT EXISTS inscricoes (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('📘 Banco de dados PostgreSQL conectado e tabela verificada.');
    client.release(); // Libera a conexão de volta para o pool.
  } catch (err) {
    console.error('Erro ao conectar ou criar tabela no banco:', err);
    // Não paramos o app aqui para permitir que ele rode mesmo se o DB falhar temporariamente,
    // mas em produção isso deve ser monitorado.
  }
};

// Executa a inicialização do banco.
// Nota: Em ambientes serverless puros, isso pode rodar a cada "cold start".
initDb();

// 4. RENDERIZAÇÃO DA PÁGINA (SERVER-SIDE RENDERING)
// -----------------------------------------------------------------------------
// Função que retorna todo o HTML da página como uma string.
// Recebe uma mensagem opcional (ex: "Sucesso" ou "Erro") para exibir ao usuário.
const renderPage = (message = "") => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <!-- Meta tag para responsividade em dispositivos móveis -->
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Rodeio da Paola</title>
  <!-- Importa ícones da biblioteca FontAwesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    /* ESTILOS CSS GERAIS */
    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
      /* Fundo com gradiente sobreposto a uma imagem */
      background:
        linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.9)),
        url('/rodeo.jpg') center/cover no-repeat;
      color: #222;
      overflow: hidden; /* Evita barras de rolagem indesejadas */
      min-height: 100vh;
    }

    /* CABEÇALHO */
    header {
      background: rgba(122, 62, 26, 0.95); /* Cor marrom semitransparente */
      color: #fff;
      text-align: center;
      padding: 36px 20px;
      animation: slideFade 0.8s ease forwards; /* Animação de entrada */
      position: relative;
      z-index: 5; /* Garante que fique acima das partículas */
    }
    h1 { margin: 0 0 10px; }
    
    /* Informações do evento (local, data, hora) */
    .info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 18px;
      margin-top: 16px;
      font-size: 1rem;
    }
    .info div {
      display: flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.3s ease, color 0.3s ease;
    }
    /* Efeito ao passar o mouse nos ícones */
    .info div:hover i {
      transform: scale(1.3) rotate(-5deg);
      color: #ffd966; /* Amarelo dourado */
    }

    /* CONTEÚDO PRINCIPAL (Formulário) */
    main {
      max-width: 420px;
      margin: 40px auto;
      background: rgba(255,255,255,0.95);
      padding: 24px;
      border-radius: 10px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
      animation: slideFade 0.8s ease forwards;
      animation-delay: 0.2s; /* Entra um pouco depois do cabeçalho */
      position: relative;
      z-index: 5;
    }
    .subtitle {
      text-align: center;
      margin-bottom: 10px;
      font-weight: 500;
    }
    label {
      display: block;
      margin-top: 12px;
      font-weight: 600;
    }
    input {
      width: 100%;
      padding: 8px;
      margin-top: 4px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box; /* Garante que o padding não aumente a largura total */
    }
    
    /* Botão de envio */
    button {
      margin-top: 16px;
      width: 100%;
      padding: 10px;
      background: #7a3e1a;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      animation: pulse 2.5s infinite; /* Efeito de pulsação para chamar atenção */
      transition: background 0.3s ease;
    }
    button:hover { background: #8f4a24; }

    /* RODAPÉ */
    footer {
      text-align: center;
      padding: 20px;
      background: rgba(122,62,26,0.95);
      color: #fff;
      font-size: 0.9rem;
      z-index: 5;
      position: relative;
      animation: fadeIn 1.2s ease;
    }

    /* MODAL (Pop-up de sucesso) */
    .modal {
      display: none; /* Oculto por padrão */
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); /* Fundo escuro semitransparente */
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.4s ease;
    }
    .modal-content {
      background: #fff;
      padding: 24px;
      border-radius: 10px;
      text-align: center;
      max-width: 320px;
      width: 90%;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      animation: fadeIn 0.4s ease;
    }
    .modal-content h2 { margin-top: 0; color: #116611; }

    /* BOTÃO DE SOM FLUTUANTE */
    #sound-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(255,255,255,0.85);
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: transform 0.3s;
      z-index: 100;
    }
    #sound-toggle:hover { transform: scale(1.1); }

    /* EFEITOS VISUAIS DE FUNDO */
    .corner-glow {
      position: fixed;
      width: 250px;
      height: 250px;
      pointer-events: none;
      background: radial-gradient(circle, rgba(255,255,200,0.35), transparent 70%);
      mix-blend-mode: screen;
      z-index: 1;
    }
    .glow-top-left { top: 0; left: 0; animation: glowShift 10s infinite alternate; }
    .glow-bottom-right { bottom: 0; right: 0; animation: glowShift 12s infinite alternate; }

    .particle {
      position: absolute;
      background: radial-gradient(circle, rgba(255,255,200,0.8), rgba(255,255,200,0));
      border-radius: 50%;
      opacity: 0.6;
      animation: float 10s linear infinite;
      z-index: 0;
    }

    /* KEYFRAMES (Definição das animações) */
    @keyframes slideFade {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(122,62,26,0.5); }
      70% { box-shadow: 0 0 0 10px rgba(122,62,26,0); }
      100% { box-shadow: 0 0 0 0 rgba(122,62,26,0); }
    }
    @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
    @keyframes float {
      from { transform: translateY(0) scale(1); opacity: 0.7; }
      to { transform: translateY(-100vh) scale(1.5); opacity: 0; }
    }
    @keyframes glowShift {
      from { transform: scale(1) rotate(0deg); opacity: 0.6; }
      to { transform: scale(1.3) rotate(30deg); opacity: 0.4; }
    }
  </style>
</head>
<body>
  <!-- Elementos decorativos de fundo -->
  <div class="corner-glow glow-top-left"></div>
  <div class="corner-glow glow-bottom-right"></div>

  <header>
    <h1>Rodeio da Paola</h1>
    <div class="info">
      <div><i class="fa-solid fa-location-dot"></i> Guaíba - RS</div>
      <div><i class="fa-solid fa-calendar-days"></i> 01/12/2025</div>
      <div><i class="fa-solid fa-clock"></i> 08h - 14h</div>
    </div>
  </header>

  <main>
    <p class="subtitle">Inscreva-se gratuitamente aqui!</p>
    <!-- Formulário envia dados via POST para a rota /inscrever -->
    <form method="post" action="/inscrever">
      <label for="nome">Nome</label>
      <input type="text" id="nome" name="nome" required>

      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>

      <label for="telefone">Telefone</label>
      <input type="tel" id="telefone" name="telefone" required>

      <button type="submit">Enviar inscrição</button>
    </form>
  </main>

  <!-- Modal de sucesso -->
  <div class="modal" id="successModal">
    <div class="modal-content">
      <h2>Inscrição enviada com sucesso!</h2>
      <p>Obrigado por se inscrever. Nos vemos no evento!</p>
      <button onclick="closeModal()">Fechar</button>
    </div>
  </div>

  <footer>
    <p>© 2025 Rodeio da Paola — Todos os direitos reservados.</p>
  </footer>

  <div id="sound-toggle"><i class="fa-solid fa-volume-high"></i></div>

  <!-- JAVASCRIPT DO FRONTEND (Executado no navegador do usuário) -->
  <script>
    // Recebe a mensagem do servidor (injetada via template string)
    const message = ${JSON.stringify(message)};
    
    // Se houver mensagem de sucesso, mostra o modal
    if (message && message.includes('sucesso')) {
      document.getElementById('successModal').style.display = 'flex';
    } else if (message) {
      // Se for erro, mostra um alerta simples
      alert(message);
    }

    function closeModal() {
      document.getElementById('successModal').style.display = 'none';
    }

    // Geração de partículas flutuantes (efeito visual)
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      // Tamanho e posição aleatórios
      p.style.width = Math.random() * 20 + 10 + 'px';
      p.style.height = p.style.width;
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-10px';
      // Duração e atraso da animação aleatórios para parecer natural
      p.style.animationDuration = (8 + Math.random() * 8) + 's';
      p.style.animationDelay = Math.random() * 10 + 's';
      document.body.appendChild(p);
    }

    // Controle de Som Ambiente
    const trote = new Audio('/trote.mp3');
    trote.loop = true; // Repetir áudio
    trote.volume = 0.2; // Volume baixo
    let soundOn = false;

    const toggle = document.getElementById('sound-toggle');
    toggle.addEventListener('click', () => {
      if (!soundOn) {
        trote.play().catch(e => console.log("Autoplay bloqueado pelo navegador"));
        toggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; // Ícone de "parar"
        soundOn = true;
      } else {
        trote.pause();
        toggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>'; // Ícone de "tocar"
        soundOn = false;
      }
    });
  </script>
</body>
</html>`;

// 5. DEFINIÇÃO DAS ROTAS
// -----------------------------------------------------------------------------

// Rota GET '/': Exibe a página inicial com o formulário.
app.get("/", (req, res) => res.send(renderPage()));

// Rota POST '/inscrever': Recebe os dados do formulário.
app.post("/inscrever", async (req, res) => {
  const { nome, email, telefone } = req.body;

  // Validação básica no servidor
  if (!nome || !email || !telefone)
    return res.send(renderPage("Erro: todos os campos são obrigatórios."));

  try {
    // Conecta ao banco
    const client = await pool.connect();

    // Executa a inserção.
    // Usa parâmetros ($1, $2, $3) para prevenir SQL Injection.
    await client.query(
      "INSERT INTO inscricoes (nome, email, telefone) VALUES ($1, $2, $3)",
      [nome, email, telefone]
    );

    client.release(); // Libera conexão

    // Retorna a página com mensagem de sucesso
    res.send(renderPage("Inscrição enviada com sucesso!"));
  } catch (err) {
    console.error("Erro ao salvar inscrição:", err);
    res.send(renderPage("Erro ao salvar inscrição. Tente novamente."));
  }
});

// 6. INICIALIZAÇÃO DO SERVIDOR
// -----------------------------------------------------------------------------

// Se o arquivo for executado diretamente (node app.js), inicia o servidor na porta definida.
// Se for importado (como a Vercel faz), não inicia o listen automaticamente, apenas exporta o app.
if (require.main === module) {
  app.listen(port, () =>
    console.log(`🌾 Servidor rodando em http://localhost:${port}`)
  );
}

// Exporta o app para que a Vercel (ou testes) possa utilizá-lo.
module.exports = app;