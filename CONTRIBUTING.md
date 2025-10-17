# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **LoL Consulta**! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Código de Conduta

Este projeto segue um código de conduta. Ao participar, você concorda em manter um ambiente respeitoso e acolhedor.

## 🚀 Como Contribuir

### 1. Reportar Bugs

Encontrou um bug? Ajude-nos a melhorar!

**Antes de reportar:**

- Verifique se o bug já foi reportado nas [Issues](https://github.com/seu-usuario/consulta-lol/issues)
- Certifique-se de que está usando a versão mais recente

**Ao reportar:**

- Use um título claro e descritivo
- Descreva os passos exatos para reproduzir o problema
- Explique o comportamento esperado vs. o atual
- Inclua screenshots se possível
- Mencione seu sistema operacional e versão do navegador

### 2. Sugerir Melhorias

Tem uma ideia para melhorar o projeto?

- Abra uma issue com o prefixo `[FEATURE]`
- Descreva claramente a funcionalidade proposta
- Explique por que seria útil
- Se possível, sugira uma implementação

### 3. Contribuir com Código

#### Configuração do Ambiente

```bash
# Fork o projeto no GitHub

# Clone seu fork
git clone https://github.com/seu-usuario/consulta-lol.git
cd consulta-lol

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original-usuario/consulta-lol.git

# Instale as dependências
pnpm install

# Configure o .env
cp .env.example .env
# Adicione sua API key da Riot

# Inicie o desenvolvimento
pnpm run dev
```

#### Workflow de Desenvolvimento

1. **Crie uma branch**

```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bug
```

2. **Faça suas alterações**

   - Mantenha o código limpo e organizado
   - Siga os padrões do projeto
   - Comente código complexo
   - Teste suas alterações

3. **Commit suas mudanças**

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

**Convenção de Commits:**

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Formatação, sem mudança de código
- `refactor:` - Refatoração de código
- `test:` - Adição de testes
- `chore:` - Manutenção

4. **Push para seu fork**

```bash
git push origin feature/minha-feature
```

5. **Abra um Pull Request**
   - Vá até o GitHub e clique em "New Pull Request"
   - Descreva suas mudanças claramente
   - Referencie issues relacionadas

## 📝 Padrões de Código

### TypeScript/React

- Use TypeScript para todos os novos arquivos
- Defina tipos e interfaces apropriados
- Use functional components com hooks
- Evite `any`, prefira tipos específicos

**Exemplo:**

```typescript
interface UserData {
  id: string;
  name: string;
  level: number;
}

const UserProfile: React.FC<{ user: UserData }> = ({ user }) => {
  return <div>{user.name}</div>;
};
```

### CSS

- Use classes descritivas
- Mantenha a hierarquia BEM quando possível
- Prefira CSS modules ou styled-components
- Use variáveis CSS para cores e tamanhos

**Exemplo:**

```css
.champion-card {
  background: var(--card-bg);
}

.champion-card__title {
  color: var(--primary-gold);
}

.champion-card--active {
  border-color: var(--primary-gold);
}
```

### Estrutura de Arquivos

```
ComponentName/
├── index.tsx      # Componente principal
├── styles.css     # Estilos
└── types.ts       # Tipos (se necessário)
```

## 🧪 Testes

Antes de submeter um PR:

1. **Teste manualmente**

   - Execute a aplicação localmente
   - Teste todas as funcionalidades afetadas
   - Verifique responsividade (mobile, tablet, desktop)

2. **Verifique erros**

   - Sem erros no console
   - Sem warnings do TypeScript
   - Build sem erros: `pnpm run build`

3. **Teste em diferentes navegadores** (se possível)
   - Chrome
   - Firefox
   - Safari
   - Edge

## 📁 Áreas para Contribuir

### Fácil (Good First Issue)

- Melhorias na documentação
- Correções de typos
- Ajustes de CSS
- Adicionar comentários no código

### Médio

- Novos componentes
- Melhorias de UI/UX
- Otimizações de performance
- Adicionar testes

### Avançado

- Novas features complexas
- Integração com outras APIs
- Sistema de autenticação
- Internacionalização (i18n)

## 🎯 Prioridades Atuais

1. **Testes Unitários** - Implementar Jest e React Testing Library
2. **Documentação** - Expandir guias e tutoriais
3. **Performance** - Otimizar carregamento e cache
4. **Acessibilidade** - Melhorar a11y
5. **PWA** - Transformar em Progressive Web App

## ❓ Dúvidas?

- Abra uma [Discussion](https://github.com/seu-usuario/consulta-lol/discussions)
- Entre em contato por email: seu-email@example.com

## 🙏 Agradecimentos

Toda contribuição é valiosa! Obrigado por ajudar a melhorar o LoL Consulta.

---

**Happy Coding!** 🎮✨
