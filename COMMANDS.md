# 🛠️ Comandos Úteis - LoL Consulta

## 📦 Gerenciamento de Pacotes

### Instalação

```bash
# Instalar todas as dependências
pnpm install
# ou
npm install

# Instalar pacote específico
pnpm add nome-do-pacote
pnpm add -D nome-do-pacote  # DevDependency
```

### Atualização

```bash
# Atualizar todas as dependências
pnpm update

# Verificar pacotes desatualizados
pnpm outdated

# Atualizar pacote específico
pnpm update nome-do-pacote
```

---

## 🚀 Desenvolvimento

### Iniciar Aplicação

```bash
# Iniciar proxy + React simultaneamente (RECOMENDADO)
pnpm run dev

# Apenas o proxy (porta 3001)
pnpm run proxy

# Apenas o frontend (porta 3000)
pnpm start
```

### Build

```bash
# Build para produção
pnpm run build

# Testar build localmente
npx serve -s build
```

### Testes

```bash
# Executar testes (quando implementados)
pnpm test

# Testes com coverage
pnpm test -- --coverage

# Testes em modo watch
pnpm test -- --watch
```

---

## 🔍 Análise e Debug

### Verificar Erros

```bash
# TypeScript check
npx tsc --noEmit

# ESLint
npx eslint src/

# Prettier (verificar formatação)
npx prettier --check src/
```

### Formatar Código

```bash
# Prettier (formatar)
npx prettier --write src/

# ESLint (fix)
npx eslint src/ --fix
```

---

## 🌐 API e Proxy

### Testar Proxy

```bash
# Health check
curl http://localhost:3001/health

# Buscar invocador
curl http://localhost:3001/api/account/Natan/9315

# Rotação semanal
curl http://localhost:3001/api/rotation
```

### Logs do Proxy

```bash
# Executar proxy com logs detalhados
node server/proxy.js
```

---

## 📊 Git e GitHub

### Commits

```bash
# Status
git status

# Adicionar arquivos
git add .
git add arquivo-especifico.ts

# Commit
git commit -m "feat: descrição da feature"
git commit -m "fix: correção do bug"

# Push
git push origin main
git push origin feature/minha-branch
```

### Branches

```bash
# Criar nova branch
git checkout -b feature/nova-feature

# Trocar de branch
git checkout main

# Listar branches
git branch

# Deletar branch
git branch -d nome-da-branch
```

### Atualizar Fork

```bash
# Buscar mudanças do upstream
git fetch upstream

# Merge com main
git checkout main
git merge upstream/main

# Push para seu fork
git push origin main
```

---

## 🧹 Limpeza

### Limpar Cache

```bash
# Limpar node_modules
rm -rf node_modules
pnpm install

# Limpar build
rm -rf build

# Limpar cache do pnpm
pnpm store prune

# Limpar cache do React
rm -rf node_modules/.cache
```

### Verificar Tamanho

```bash
# Tamanho do node_modules
du -sh node_modules/

# Tamanho do build
du -sh build/

# Analisar bundle size
pnpm run build
npx source-map-explorer 'build/static/js/*.js'
```

---

## 🔐 Segurança

### Verificar Vulnerabilidades

```bash
# Audit de segurança
pnpm audit

# Corrigir vulnerabilidades
pnpm audit --fix

# Verificar packages desatualizados
npm outdated
```

### Atualizar Dependências com Segurança

```bash
# Atualizar minor versions
pnpm update --latest

# Verificar breaking changes antes de atualizar
npm-check-updates
```

---

## 📱 Mobile/Responsivo

### Testar em Dispositivos

```bash
# Obter IP local
ip addr show | grep inet

# Acessar de outro dispositivo:
# http://SEU-IP:3000
```

### Chrome DevTools

```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
- iPhone 12 Pro
- iPad Air
- Galaxy S20
```

---

## 🎨 CSS/Design

### Adicionar Fonte

```css
/* Em index.css ou styles.css */
@import url("https://fonts.googleapis.com/css2?family=Nome+Da+Fonte:wght@400;700&display=swap");
```

### Variáveis CSS

```css
/* Definir */
:root {
  --primary-gold: #c89b3c;
  --spacing-lg: 20px;
}

/* Usar */
.elemento {
  color: var(--primary-gold);
  padding: var(--spacing-lg);
}
```

---

## 🚀 Deploy

### Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### Netlify

```bash
# Instalar CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy em produção
netlify deploy --prod
```

### Build Manual

```bash
# 1. Build
pnpm run build

# 2. Upload a pasta build/ para seu hosting
# - Firebase Hosting
# - GitHub Pages
# - AWS S3
# - DigitalOcean
```

---

## 📊 Performance

### Análise de Bundle

```bash
# Build com análise
pnpm run build

# Analisar
npx webpack-bundle-analyzer build/static/js/*.js
```

### Lighthouse

```bash
# Instalar
npm install -g lighthouse

# Executar
lighthouse http://localhost:3000 --view
```

---

## 🔄 Úteis para Desenvolvimento

### Variáveis de Ambiente

```bash
# Criar .env
cp .env.example .env

# Editar
nano .env
# ou
code .env
```

### Reinstalar Tudo

```bash
# Limpar e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Verificar Portas em Uso

```bash
# Linux/Mac
lsof -i :3000
lsof -i :3001

# Windows
netstat -ano | findstr :3000
```

### Matar Processo na Porta

```bash
# Linux/Mac
kill -9 $(lsof -t -i:3000)

# Windows
taskkill /PID <PID> /F
```

---

## 📝 Documentação

### Gerar Docs Automaticamente

```bash
# JSDoc
npx jsdoc src/ -d docs/

# TypeDoc
npx typedoc --out docs src/
```

### Visualizar README

```bash
# Grip (preview GitHub markdown)
pip install grip
grip README.md
```

---

## 🎯 Atalhos VS Code

```
Ctrl+P          - Quick Open (buscar arquivo)
Ctrl+Shift+P    - Command Palette
Ctrl+B          - Toggle Sidebar
Ctrl+`          - Toggle Terminal
Ctrl+D          - Selecionar próxima ocorrência
Alt+Up/Down     - Mover linha
Ctrl+/          - Comentar linha
F2              - Renomear símbolo
```

---

## 💡 Dicas

### Performance

- Use React.memo() para componentes pesados
- Implemente lazy loading: `const Component = lazy(() => import('./Component'))`
- Otimize imagens (WebP, lazy loading)
- Use useCallback e useMemo quando apropriado

### Debug

- Console.log estratégico
- React DevTools
- Redux DevTools (se usar Redux)
- Network tab para requisições

### Boas Práticas

- Commits semânticos (feat, fix, docs, etc.)
- Um componente por arquivo
- Nomes descritivos
- Comentários em código complexo

---

## 📚 Recursos Úteis

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Riot API Docs](https://developer.riotgames.com/docs/lol)
- [Data Dragon](https://riot-api-libraries.readthedocs.io/en/latest/ddragon.html)

---

**Happy Coding! 🎮**
