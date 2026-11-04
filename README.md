# Carteira de serviço OSM

## Dashboard de controle de serviços

Dashboard servido pela Vercel para analisar ordens de serviço das planilhas
CLista (em aberto) e ELista (encerradas). As planilhas são lidas no navegador
do administrador e os registros são gravados por uma API autenticada em um
banco PostgreSQL privado.

### Arquivos do painel

- `index.html` — estrutura da página, filtros, indicadores, gráficos e diálogo
  de importação.
- `index.css` — identidade visual, componentes e adaptações para celular.
- `index.js` — leitura local das planilhas, mapeamento ATC/polo, filtros e
  cálculos dos indicadores e gráficos.
- `api/dashboard-data.js` — API privada para consultar e publicar a base.
- `api/_auth.js` — valida tokens Clerk e autoriza administradores/visitantes.
- `database/schema.sql` — criação da tabela de snapshot.

### Como usar

Usuários precisam entrar com Clerk e estar explicitamente autorizados. O botão
**Atualizar planilhas** só permite ao administrador substituir a base. A API
valida cada token no servidor.
As planilhas e os registros detalhados ficam no PostgreSQL e são enviados ao
navegador apenas após uma consulta autenticada. Não habilite cadastros públicos
no Clerk; convide apenas as pessoas autorizadas.

### Configuração na Vercel

1. Crie uma aplicação Clerk. Configure o domínio da Vercel como domínio
   autorizado e desative a inscrição pública; convide somente usuários
   autorizados.
2. Crie um PostgreSQL privado e conecte-o ao projeto Vercel.
3. Configure estas variáveis no projeto Vercel:
   - `CLERK_SECRET_KEY`: chave secreta do Clerk (somente no servidor).
   - `CLERK_ADMIN_USER_ID`: ID Clerk `user_...` autorizado a importar.
   - `CLERK_VIEWER_USER_IDS`: IDs `user_...` autorizados a consultar, separados
     por vírgula; pode ficar vazio para permitir somente o administrador.
   - `POSTGRES_URL`: URL de conexão privada do PostgreSQL.
4. Em `auth-config.js`, substitua `YOUR_CLERK_PUBLISHABLE_KEY` pela chave
   publicável Clerk e `YOUR_CLERK_USER_ID` pelo mesmo ID definido em
   `CLERK_ADMIN_USER_ID`. O cliente Clerk é carregado da instância configurada
   em `index.html` e `index.js`. Nunca coloque a chave secreta no arquivo público.
5. Execute o conteúdo de `database/schema.sql` uma vez no editor SQL do banco.
6. Instale dependências (`npm install`) e publique/reimplante o projeto na
   Vercel. A API usa `/api/dashboard-data`.

O endpoint exige autenticação para GET e POST, não permite consultas anônimas,
limita o tamanho da carga e usa parâmetros SQL. Mantenha a lista de usuários
autorizados curta e remova acessos quando deixarem de ser necessários. A API
retorna todos os registros a cada usuário autorizado: não convide pessoas que
não podem ver os dados de clientes. O PostgreSQL e as variáveis não devem ser
compartilhados ou inseridos no repositório.

O mapeamento de ATCs para os sete polos está no início de `index.js`. ATCs
fora da relação aparecem como **NÃO MAPEADO**, para evitar classificações
incorretas.