# 🚀 Servidor Proxy Local para API da Riot

Este servidor proxy resolve definitivamente os problemas de CORS ao fazer requisições para a API da Riot Games.

## 📋 Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- Chave da API da Riot configurada no arquivo `.env`

## 🔧 Instalação

1. **Instalar dependências:**

```bash
npm install
```

As dependências necessárias são:

- `express` - Framework web para Node.js
- `cors` - Middleware para habilitar CORS
- `axios` - Cliente HTTP para fazer requisições
- `concurrently` - Para rodar múltiplos comandos simultaneamente

## 🎮 Como Usar

### Opção 1: Rodar tudo de uma vez (Recomendado)

```bash
npm run dev
```

Este comando inicia:

- ✅ Servidor proxy na porta 3001
- ✅ Aplicação React na porta 3000

### Opção 2: Rodar separadamente

**Terminal 1 - Iniciar o proxy:**

```bash
npm run proxy
```

**Terminal 2 - Iniciar a aplicação React:**

```bash
npm start
```

## 🔍 Verificar se está funcionando

1. Acesse http://localhost:3001/health
2. Você deve ver:

```json
{
  "status": "OK",
  "timestamp": "2025-10-15T...",
  "apiKeyConfigured": true
}
```

## 📡 Rotas Disponíveis

| Rota                              | Método | Descrição                       |
| --------------------------------- | ------ | ------------------------------- |
| `/health`                         | GET    | Health check do servidor        |
| `/api/account/:gameName/:tagLine` | GET    | Buscar conta pelo Riot ID       |
| `/api/summoner/by-puuid/:puuid`   | GET    | Buscar summoner pelo PUUID      |
| `/api/rotation`                   | GET    | Buscar rotação semanal gratuita |

## 🎯 Funcionamento Automático

A aplicação detecta automaticamente se o proxy local está disponível:

- ✅ **Proxy Local Disponível**: Usa o servidor local (mais rápido e confiável)
- ⚠️ **Proxy Local Indisponível**: Usa proxies públicos como fallback

## 🐛 Troubleshooting

### Erro: "Proxy local não está disponível"

**Solução:** Certifique-se de que o servidor proxy está rodando:

```bash
npm run proxy
```

### Erro: "API Key não configurada"

**Solução:** Verifique se o arquivo `.env` existe e contém:

```env
REACT_APP_API_KEY=sua-chave-aqui
```

### Porta 3001 já está em uso

**Solução:** Você pode mudar a porta editando o arquivo `.env`:

```env
PROXY_PORT=3002
REACT_APP_PROXY_URL=http://localhost:3002
```

## 📝 Logs

O servidor proxy exibe logs detalhados:

- 🔍 Requisições recebidas
- ✅ Sucessos
- ❌ Erros com detalhes

## 🔒 Segurança

⚠️ **IMPORTANTE**: Este proxy é apenas para desenvolvimento local!

Para produção, considere:

- Implementar rate limiting
- Adicionar autenticação
- Usar variáveis de ambiente seguras
- Deploy em serviços como Vercel, Netlify, ou Heroku

## 📦 Deploy em Produção

Para deploy, você pode usar:

### Vercel (Recomendado)

```bash
vercel
```

### Netlify Functions

Converta as rotas para Netlify Functions

### Heroku

```bash
heroku create
git push heroku main
```

## ✨ Vantagens do Proxy Local

1. ✅ **Sem limites de proxy público**
2. ✅ **Mais rápido** (sem intermediários)
3. ✅ **Mais confiável** (sem dependência de serviços externos)
4. ✅ **Melhor controle** de erros e logs
5. ✅ **Fallback automático** para proxies públicos se necessário
