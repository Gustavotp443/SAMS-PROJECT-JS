# SAMS PROJECT

Sistema desenvolvido como Trabalho de Conclusão de Curso (TCC) na graduação pela FATEC SBC. Trata-se de um gerenciador ainda em desenvolvimento para oficinas mecânicas.
Composto por interface do cliente, servidor e banco de dados em nuvem. 
Construído com TypeScript, Node.js, Knex, Express, React, Material.UI e PostgreSQL, o sistema adota uma arquitetura escalável e modular,
seguindo princípios de código limpo. 
A estrutura do backend utiliza uma abordagem baseada em Repositories, Controllers e Database, semelhante ao padrão MVC, garantindo organização e manutenibilidade.
As funcionalidades incluem autenticação segura, integração via API REST e gerenciamento eficiente de dados, proporcionando uma solução robusta e eficiente para o setor automotivo.

## Tecnologias Utilizadas

### Servidor (Backend)

- **Node.js**: É um ambiente de execução JavaScript para o servidor, permitindo desenvolver aplicações backend escaláveis. É ideal para criar APIs RESTful, lidar com operações de banco de dados, e implementar autenticação, utilizando o mesmo idioma de programação tanto no cliente quanto no servidor.
  - **Express**: Framework utilizado para facilitar a criação das rotas da API.
  - **Knex**: Uma biblioteca SQL Query Builder para JavaScript, usada para construir e executar consultas ao banco de dados de maneira segura e eficiente.
  - **TypeScript**: Superset de JavaScript que adiciona tipagem estática, tornando o desenvolvimento mais seguro e previsível.
  - **Bcryptjs**: Usado para hashear e comparar senhas de forma segura, essencial para o sistema de autenticação.
  - **Cors**: Middleware que é utilizado para habilitar CORS (Cross-Origin Resource Sharing), permitindo que o frontend consuma a API sem problemas de Same-Origin Policy.
  - **Dotenv**: Usado para carregar variáveis de ambiente de um arquivo .env, facilitando a configuração do projeto em diferentes ambientes.
  - **HTTP Status Codes**: Biblioteca que fornece constantes de códigos de status HTTP, melhorando a legibilidade do código ao lidar com respostas HTTP.
  - **Jsonwebtoken**: Implementa JSON Web Tokens para a autenticação e transmissão segura de informações entre partes.
  - **Yup**: Usado para a validação de esquemas, permitindo validar os dados de entrada de forma declarativa e concisa.

### Cliente (Frontend)

- **React**: É uma biblioteca JavaScript para construir interfaces de usuário, facilitando o desenvolvimento de aplicações web dinâmicas com componentes reutilizáveis. Oferece performance eficiente através do Virtual DOM e suporta aplicações de página única (SPA) com uma experiência de usuário rica e interativa.
  - **Material-UI (@mui/material e @mui/icons-material):**: UtUma biblioteca de componentes de interface de usuário para React baseada no Material Design, oferecendo uma ampla variedade de componentes estilizados e prontos para uso.
  - **Emotion(@emotion/react e @emotion/styled)**: Uma biblioteca de estilização que permite escrever estilos CSS dentro de JavaScript, facilitando a criação de componentes estilizados com temas e variações.
  - **Axios**: Cliente HTTP baseado em Promises para fazer requisições AJAX, utilizado para comunicar-se com APIs.
  - **React Router DOM**: Utilizado para adicionar navegação entre componentes em aplicativos de página única (SPA).
  - **Unform(@unform/core e @unform/web)**: Uma biblioteca que ajuda com a gestão de formulários no React, oferecendo uma maneira fácil de criar formulários performáticos com validações.
  - **Yup**: Utilizado para esquemas de validação, funcionando muito bem em conjunto com Unform para validar dados de entrada do usuário.
  - **jwt-decode**: Utilizado para decodificar chave JWT.

## Requisitos

- Node.js versão 21.5.0
- npm versão 10.2.4 (vem instalado com o Node.js)

## Servidor
### Configuração

Antes de iniciar o servidor, você precisa instalar as dependências do projeto. No diretório de app , execute:

```bash
npm install
```

O sistema está utilizando um banco de dados em memória SQLite, para que funcione basta executar o comando, após a instalação das dependências
```bash
npm run knex:migrate
```

Caso deseje popular o banco com dados básicos execute o comando 
```bash
npm run knex:seed
```

O usuário base gerado pelo seed possui email user1@email.com e senha 12345678

POR GENTILEZA APENAS EXECUTE SEED CASO O BANCO ESTEJA VAZIO!! caso deseje limpar o banco e rodar os comandos de configuração do banco novamente execute o comando: 
```bash
npm run knex:rollback-all
```

### Variáveis de Ambiente
Configure as variaveis do projeto, crie um arquivo .env seguindo o modelo do arquivo .env.example, pode copiar os dados de example para o .env ou apenas renomeio o arquivo .env.example para .env
Configure a porta que deseja utilizar, caso não selecione por padrão a porta utilizada será 3333
- PORT=3333

Configure o ambiente que está sendo utilizado, mantenha configure para development caso deseje testar na máquina local
- NODE_ENV = development

Configure se está sendo executado na máquina local ou não, caso esteja (se estiver usando development no ambiente mantenha true)
- IS_LOCALHOST = true

Adicione uma chave para a criptográfia de senha do JWT (por padrão será secret)
- JWT_SECRET = secret

### INICIAR SERVIDOR

Para iniciar o app execute o comando
```bash
npm run watch
```

ou

```bash
npm run dev
```

watch - ficará observando alterações no projeto e atualizando o estado do servidor

dev - não irá observar alterações no servidor

## CLIENTE
### Configuração

Antes de iniciar a tela da aplicação, você precisa instalar as dependências do projeto. No diretório de app , execute:

```bash
npm install
```

### INICIAR SERVIDOR

Para iniciar o app execute o comando
```bash
npm start
```


