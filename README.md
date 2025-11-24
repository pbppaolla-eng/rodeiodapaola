# 🐎 Bem-vindo ao Rodeio da Paola!
 
Olá! 👋 Que bom ter você por aqui conferindo este projeto.
 
Este não é apenas um formulário de inscrição; é uma tentativa de trazer um pouquinho da atmosfera do campo para o navegador. Criei esta landing page para gerenciar as inscrições do Rodeio em Guaíba - RS, mas com um toque especial: queria que o usuário sentisse o clima rústico e elegante logo ao entrar.
 
Tem som de trote de cavalo, tem partículas de luz e, claro, funciona direitinho para garantir o lugar da galera no evento! 🌾
 
## 🤔 O que é e como funciona?
 
Basicamente, é uma aplicação web onde o pessoal coloca **Nome**, **E-mail** e **Telefone** para se inscrever.
 
O diferencial está na experiência:
*   **Visual:** Usei uma imagem de fundo translúcida e partículas flutuantes para dar aquele ar de "fim de tarde no campo".
*   **Sonoro:** Tem um áudio ambiente bem suave de cavalos (prometo que não é alto nem irritante!).
*   **Técnico:** Tudo o que é digitado vai direto para um banco de dados **PostgreSQL** na nuvem, pronto para escalar!
 
## 🛠️ O que eu usei para construir (Tech Stack)
 
Escolhi ferramentas que gosto e que resolvem o problema de forma simples e robusta:
 
*   **Node.js + Express:** Porque montar um servidor em JS é vida! É rápido, leve e perfeito para essa aplicação.
*   **PostgreSQL (Neon/Vercel):** Inicialmente usávamos SQLite, mas migramos para Postgres para permitir o deploy na Vercel e garantir que os dados fiquem seguros na nuvem.
*   **HTML5 & CSS3 (Puro):** Sem frameworks pesados tipo React ou Angular aqui. Quis fazer "na unha" para caprichar nas animações e deixar o site super leve.
 
## 👩‍💻 Bora colocar para rodar?
 
Se você quiser testar na sua máquina, é super simples. Segue o passo a passo:
 
### 1. Baixe o projeto
 
Primeiro, clone o repositório ou baixe os arquivos:
 
```bash
git clone https://github.com/seuusuario/rodeio-da-paola.git
cd rodeio-da-paola
```
 
### 2. Instale o que precisa
 
O projeto precisa de algumas dependências do Node. Rode aí no terminal:
 
```bash
npm install
```
(Isso vai baixar o Express, o conector do Postgres `pg` e o `dotenv`).
 
### 3. Configure o Banco de Dados
 
Como estamos usando PostgreSQL, você precisa configurar as credenciais.
Crie um arquivo `.env` na raiz do projeto e adicione sua string de conexão:
 
```env
DATABASE_URL=sua_string_de_conexao_postgres_aqui
```
 
### 4. Valendo!
 
Agora é só iniciar o servidor:
 
```bash
node app.js
```
 
Se aparecer a mensagem abaixo, deu tudo certo:
> 🌾 Servidor rodando em http://localhost:3000
 
Agora é só abrir seu navegador e acessar o link! 🎉
 
## 💾 "E os dados, vão para onde?"
 
Boa pergunta! Eles vão para o seu banco **PostgreSQL**.
Assim que você rodar o projeto, o código verifica e cria a tabela `inscricoes` automaticamente se ela não existir.
 
Se você quiser espiar quem se inscreveu, pode usar qualquer cliente SQL (como DBeaver, pgAdmin) ou o painel do seu provedor (Neon/Vercel) e rodar:
 
```sql
SELECT * FROM inscricoes;
```
 
## ✨ Detalhes que eu amo nesse projeto
 
*   Tentei fugir do "formulário padrão cinza".
*   Dê uma olhada no **fade-in** quando a página carrega.
*   Passe o mouse sobre o botão de inscrição (tem um efeito pulsante).
*   Preste atenção no **modal de confirmação** que aparece quando você envia os dados. Foi feito com carinho para dar um feedback visual claro pro usuário.
 
## 🤝 Contribuições e Uso
 
Sinta-se totalmente à vontade para usar esse código, modificar, colocar a foto do seu próprio evento ou melhorar o CSS.
Se tiver alguma ideia legal de como melhorar (talvez adicionar envio de e-mail automático?), pode abrir um Pull Request ou me chamar!
 
## ❤️ Créditos
 
Feito com muita dedicação, café e código por **Paola Bica Perez**.
 
> "Onde o campo encontra o código e o vento carrega o som dos cascos."