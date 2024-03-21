export const enviromnent = {
  /**
   * Define a quantidade de linhas a ser carregada
   */
  LINE_LIMITS: 5,

  /**
   * Define o texto de pesquisa dos inputs
   */
  INPUT_SEARCH: "Pesquisar...",

  /**
   * Define o texto das linhas vazias
   */
  EMPTY_LIST: "Nenhum registro encontrado.",

  /**
   * Define a URL BASE do projeto
   */
  URL_BASE:
    process.env.NODE_ENV === "production"
      ? process.env.SERVER_URL
      : "http://localhost:3333"
};
