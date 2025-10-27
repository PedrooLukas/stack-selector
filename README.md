# 🚀 Stack Selector

**Stack Selector** é uma ferramenta completa para criar projetos React, MERN e TypeScript com stacks pré-configuradas de forma rápida e interativa.

## 📋 Visão Geral

O Stack Selector consiste em dois componentes principais:

1. **Interface Web Interativa** - Selecione visualmente as tecnologias que deseja usar
2. **CLI (stack-fast)** - Ferramenta de linha de comando publicada no npm

## ✨ Funcionalidades

### Interface Web

- 🎨 **Seleção Visual de Stacks** - Interface moderna e intuitiva para escolher tecnologias
- 🔍 **Três Tipos de Projetos**:
  - **React + Vite** - Projetos frontend modernos
  - **TypeScript** - Projetos TypeScript puros
  - **MERN Stack** - MongoDB + Express + React + Node.js
- 📦 **Pacotes Opcionais**:
  - **Styling**: Tailwind CSS, shadcn/ui
  - **Routing**: React Router
  - **State Management**: Zustand
  - **Data Fetching**: TanStack Query (React Query)
  - **HTTP Client**: Axios
- ⚡ **Geração de Comando CLI** - Copie o comando personalizado com um clique
- ⚠️ **Avisos Inteligentes** - Alertas quando nenhum pacote opcional é selecionado
- 🏷️ **Tags Visuais** - Identifique facilmente pacotes obrigatórios vs opcionais

### CLI (stack-fast)

- 🚀 **Criação Rápida de Projetos** - Configure projetos completos em minutos
- 📝 **Modo Interativo** - Perguntas guiadas para personalização
- 🎯 **Instalação Automática** - Instala e configura todas as dependências
- ⚙️ **Configuração Completa**:
  - Tailwind CSS (config, postcss, diretivas)
  - shadcn/ui (components.json, aliases, utils)
  - TypeScript (tsconfig)
  - React Router, Zustand, React Query, etc.

## 🚀 Como Usar

### 1. Usando a Interface Web

1. Acesse a interface web (rode localmente ou deploy)
2. Selecione o tipo de stack desejada (React, TypeScript ou MERN)
3. Clique nos cards das tecnologias que deseja adicionar
4. Clique em "Gerar Comando CLI"
5. Copie o comando gerado

**Exemplo de comando gerado:**
```bash
npx stack-fast@latest init --type=react --package-manager=npm --packages=tailwind,react-router,zustand
```

### 2. Executando o CLI

Execute o comando copiado da interface ou crie um comando manualmente:

```bash
npx stack-fast@latest init --type=react --package-manager=npm --packages=typescript,tailwind
```

**Flags disponíveis:**
- `--type` - Tipo de stack: `react`, `typescript` ou `mern`
- `--name` - Nome do projeto (opcional, será perguntado se omitido)
- `--package-manager` - Gerenciador: `npm`, `yarn` ou `pnpm`
- `--packages` - Pacotes separados por vírgula

**Exemplo interativo completo:**
```bash
# O CLI perguntará o nome do projeto
npx stack-fast@latest init --type=react --package-manager=npm --packages=tailwind

? Nome do projeto: meu-app-incrivel
```

### 3. Resultado

Após a execução, você terá um projeto completo com:

✅ Estrutura de pastas criada  
✅ Dependências instaladas  
✅ Configurações geradas (tailwind.config.js, postcss.config.js, etc.)  
✅ Diretivas e imports adicionados  
✅ Pronto para desenvolvimento  

```bash
cd meu-app-incrivel
npm run dev
```

## 📦 Pacotes Disponíveis

### React Stack

| Categoria | Pacote | Versão | Descrição |
|-----------|--------|--------|-----------|
| **Base** | React | ^18.3.0 | Biblioteca UI (obrigatório) |
| | ReactDOM | ^18.3.0 | DOM Renderer (obrigatório) |
| | Vite | ^5.4.0 | Build tool (obrigatório) |
| | TypeScript | ^5.5.0 | Tipagem estática |
| **Styling** | Tailwind CSS | ^3.4.0 | Framework CSS utility-first |
| | shadcn/ui | latest | Componentes React reutilizáveis |
| **Utils** | React Router | ^6.26.0 | Roteamento |
| | Zustand | ^4.5.0 | State management |
| | TanStack Query | ^5.51.0 | Data fetching e cache |
| | Axios | ^1.7.0 | HTTP client |

### TypeScript Stack

Inclui ferramentas para desenvolvimento TypeScript puro, frameworks (Next.js, Express, NestJS), type definitions, testing tools e devtools.

### MERN Stack

Configuração completa para aplicações fullstack com MongoDB, Express, React e Node.js, incluindo autenticação (JWT, bcrypt, Passport) e utilities.

## 🛠️ Estrutura do Projeto

```
stack-selector/
├── cli/                    # Pacote npm (stack-fast)
│   ├── bin/
│   │   └── cli.js         # Entry point do CLI
│   ├── src/
│   │   ├── commands/
│   │   │   └── init.js    # Comando principal de inicialização
│   │   ├── datas/
│   │   │   └── stacks.json # Dados das stacks
│   │   └── templates/      # Templates de configuração
│   └── package.json
│
├── web/                    # Interface web
│   ├── src/
│   │   ├── components/
│   │   │   ├── StackSelector.jsx    # Seletor principal
│   │   │   ├── StackCard.jsx        # Card de tecnologia
│   │   │   ├── CommandOutput.jsx    # Gerador de comando
│   │   │   └── WarningAlert.jsx     # Alertas
│   │   ├── data/
│   │   │   └── stacksData.js        # Dados das stacks
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## 🔧 Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- npm, yarn ou pnpm

### Rodando a Interface Web

```bash
cd web
npm install
npm run dev
```

### Testando o CLI Localmente

```bash
cd cli
npm link
create-my-stack init --type=react --name=teste --package-manager=npm --packages=tailwind
```

### Publicando o CLI no npm

```bash
cd cli
npm version patch  # ou minor/major
npm publish
```

## 📝 Exemplos de Uso

### Projeto React básico com Tailwind

```bash
npx stack-fast@latest init --type=react --package-manager=npm --packages=tailwind
```

### Projeto React + TypeScript + Tailwind + React Router + Zustand

```bash
npx stack-fast@latest init --type=react --package-manager=npm --packages=typescript,tailwind,react-router,zustand
```

### Projeto React + shadcn/ui (inclui Tailwind automaticamente)

```bash
npx stack-fast@latest init --type=react --package-manager=npm --packages=typescript,shadcn
```

### Projeto MERN completo

```bash
npx stack-fast@latest init --type=mern --package-manager=npm --packages=mongoose,jwt,bcrypt,cors,dotenv
```

## ⚠️ Observações Importantes

1. **Versão do CLI**: Sempre use `@latest` para garantir a versão mais recente
2. **shadcn/ui**: Requer TypeScript e instala Tailwind automaticamente
3. **Cache do npx**: Se encontrar problemas, limpe o cache: `npx clear-npx-cache`
4. **Perguntas Interativas**: O create-vite pode fazer perguntas - responda "No" para permitir instalação de pacotes adicionais

## 🐛 Troubleshooting

### Tailwind não foi instalado

**Problema**: O projeto foi criado mas o Tailwind CSS não foi instalado.

**Soluções**:
1. Certifique-se de incluir `--packages=tailwind` no comando
2. Use a versão `@latest` ou específica: `npx stack-fast@1.3.0`
3. Não responda "Yes" quando o create-vite perguntar "Install and start now?"

### Erro "version not found"

**Solução**: Limpe o cache do npm e tente novamente
```bash
npm cache clean --force
npx stack-fast@latest init ...
```

## 📜 Licença

MIT License - Sinta-se livre para usar em seus projetos!

## 👤 Autor

**pedrolukas23**

- GitHub: [@pedrolukas23](https://github.com/pedrolukas23)
- npm: [stack-fast](https://www.npmjs.com/package/stack-fast)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**
