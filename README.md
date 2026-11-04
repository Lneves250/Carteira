# Carteira

## Dashboard de controle de serviços

Painel web estático para analisar ordens de serviço das planilhas CLista (em
aberto) e ELista (encerradas). A leitura dos arquivos `.xlsx` acontece no
navegador; os dados não são enviados a um servidor.

### Arquivos do painel

- `index.html` — estrutura da página, filtros, indicadores, gráficos e diálogo
  de importação.
- `index.css` — identidade visual, componentes e adaptações para celular.
- `index.js` — leitura local das planilhas, mapeamento ATC/polo, filtros e
  cálculos dos indicadores e gráficos.

### Como usar

Abra `index.html` no navegador e selecione **Atualizar planilhas**. Escolha
uma CLista e uma ELista no formato `.xlsx`. Depois da importação, os filtros
de base, polo (ATC), mês, município, prioridade, família e status atualizam
os indicadores e gráficos em conjunto.

O mapeamento de ATCs para os sete polos está no início de `index.js`. ATCs
fora da relação aparecem como **NÃO MAPEADO**, para evitar classificações
incorretas.