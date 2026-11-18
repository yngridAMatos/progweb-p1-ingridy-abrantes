# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/`

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Proprietários | carregando | Network → throttling 3G → F5 | spinner "Carregando proprietários…" |
| Proprietários | vazio | API recém-iniciada | "Nenhum proprietário ainda…" |
| Proprietários | erro | Ctrl+C na API → F5 | "Não consegui falar com a API…" + Tentar de novo |
| Proprietários | sucesso | cadastrar "Maria Souza" | tabela com 1 linha |
| Imóveis | vazio | sem imóveis | "Nenhum imóvel ainda…" |
| Imóveis | erro de regra | diária 0 ou -1 | aviso "A diária deve ser maior que zero." |
| Imóveis | erro do backend | proprietário inexistente / CPF duplicado | aviso vermelho com a mensagem da API (400, 409 ou 422) |

## Camadas
- api: `js/api.js` · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/`
