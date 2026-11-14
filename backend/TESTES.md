# Testes da API — Projeto 1 (S3)

API: Loja de Bairro · entidades: Produto e Categoria · servidor: `npm run dev` em http://localhost:3000

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | GET |`http: //localhost:3000/` | - | 200 |- |
| 2 | POST |`http: //localhost:3000/clientes` | {"nome": "Ingridy Abrantes", "cpf": "458.655.464.15", "email": "ingridyabrantes@gmail.com", "telefone": "(88) 9641-5623"} | 201 |- |
| 3 | POST | `http: //localhost:3000/proprietarios` |{"nome": "João Queiroz", "cpf": "789.002.652-22", "email": "joaoabrantes1@gmail.com", "telefone": "(45) 9912-2256"} | 201 | - |
| 4 | GET | `http: //localhost:3000/proprietarios` | — | 200 | |
| 5 | POST |`http: //localhost:3000/clientes` | {"nome": "Raelma Pires", "email": "raelmappirs@gmail.com", "telefone": "(22) 9912-5486"} | 400 | cpf é obrigatório |
| 6 | GET | `http: //localhost:3000/proprietarios` | - | 404 | proprietário não encontrado |
| 7 | DELETE | `http: //localhost:3000/clientes/1` | — | 204 | |