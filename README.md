# API de Transações
Url Para acessar api em PRODUÇÃO: https://api-transactions-d0pm.onrender.com/

Esta é uma API simples para gerenciar transações financeiras (débito e crédito), construída com Node.js, Fastify e Knex.

## 🚀 Começando

Para rodar este projeto, você precisará ter o Node.js e um gerenciador de pacotes (npm ou yarn) instalados.

1.  Clone o repositório:
    ```bash
    git clone https://github.com/xOmilk/api-transactions.git
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Execute as migrations do banco de dados:
    ```bash
    npm run knex -- migrate:latest
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

---

## 🍪 Gerenciamento de Sessão

A API utiliza **cookies** para identificar os usuários.

Na primeira vez que um usuário cria uma transação (`POST /transactions`), um `sessionId` é gerado e enviado como um cookie na resposta. Todas as requisições subsequentes para listar, buscar ou resumir transações devem incluir este `sessionId` para identificar e retornar os dados corretos do usuário.

---

## API Endpoints

Aqui estão as rotas disponíveis na API.

### Criar uma nova transação

Cria uma nova transação de crédito ou débito. Se for a primeira requisição do usuário, um `sessionId` será criado e retornado no cookie da resposta.

-   **Método:** `POST`
-   **Endpoint:** `/transactions`
-   **Corpo da Requisição (Body):**
    ```json
    {
      "title": "Salário",
      "amount": 5000,
      "type": "credit"
    }
    ```
    -   `title` (string, obrigatório): A descrição da transação.
    -   `amount` (number, obrigatório): O valor da transação.
    -   `type` (enum, obrigatório): O tipo da transação. Valores permitidos: `"credit"` ou `"debit"`.
-   **Resposta de Sucesso:**
    -   **Código:** `201 Created`

***

### Listar todas as transações

Retorna uma lista com todas as transações do usuário identificado pelo `sessionId` no cookie.

-   **Método:** `GET`
-   **Endpoint:** `/transactions`
-   **Autenticação:** Requer o envio do `sessionId` via cookie.
-   **Resposta de Sucesso:**
    -   **Código:** `200 OK`
    -   **Corpo:**
        ```json
        {
          "transactions": [
            {
              "id": "a2b2c1d4-e5f6-7890-1234-567890abcdef",
              "title": "Salário",
              "amount": 5000,
              "created_at": "2025-10-22T20:30:00.000Z",
              "session_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876"
            }
          ]
        }
        ```

***

### Buscar uma transação específica

Retorna uma transação única com base no `id` fornecido na URL. A transação deve pertencer ao usuário identificado pelo `sessionId`.

-   **Método:** `GET`
-   **Endpoint:** `/transactions/:id`
-   **Autenticação:** Requer o envio do `sessionId` via cookie.
-   **Parâmetros da URL:**
    -   `id` (uuid, obrigatório): O ID da transação.
-   **Resposta de Sucesso:**
    -   **Código:** `200 OK`
    -   **Corpo:**
        ```json
        {
          "transaction": {
            "id": "a2b2c1d4-e5f6-7890-1234-567890abcdef",
            "title": "Salário",
            "amount": 5000,
            "created_at": "2025-10-22T20:30:00.000Z",
            "session_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876"
          }
        }
        ```

***

### Obter resumo das transações

Retorna um resumo com a soma total de todas as transações do usuário.

-   **Método:** `GET`
-   **Endpoint:** `/transactions/summary`
-   **Autenticação:** Requer o envio do `sessionId` via cookie.
-   **Resposta de Sucesso:**
    -   **Código:** `200 OK`
    -   **Corpo:**
        ```json
        {
          "summary": {
            "totalAmount": 4850.50
          }
        }
        ```




# RF

-   [V] O usuario deve poder criar uma nova transação;
-   [V] O usuario deve poder obter um resumo da sua conta;
-   [V] O usuario deve poder listar todas trasações que ja ocorreram;
-   [V] O usuario deve poder visualizar uma transacao unica;

# RN

-   [V] A transação pode ser do tipo credita que será somada ao valor total, ou debito que será subtraida;
-   [V] Deve ser possivel identificarmos o usuario entre as requisições;
-   [V] O usuario só pode visualizar transacoes o qual ele criou;
