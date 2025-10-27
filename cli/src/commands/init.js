import inquirer from 'inquirer';
import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mapeamento de pacotes e suas versões
const PACKAGE_MAP = {
  react: {
    tailwind: {
      packages: ['tailwindcss@^3.4.0', 'postcss@^8.4.0', 'autoprefixer@^10.4.0'],
      dev: true
    },
    shadcn: {
      // shadcn é instalado via CLI próprio
      special: 'shadcn'
    },
    'react-router': {
      packages: ['react-router-dom@^6.26.0'],
      dev: false
    },
    zustand: {
      packages: ['zustand@^4.5.0'],
      dev: false
    },
    'react-query': {
      packages: ['@tanstack/react-query@^5.51.0'],
      dev: false
    },
    axios: {
      packages: ['axios@^1.7.0'],
      dev: false
    }
  },
  mern: {
    mongoose: {
      packages: ['mongoose@^8.5.0'],
      dev: false
    },
    jwt: {
      packages: ['jsonwebtoken@^9.0.0'],
      dev: false
    },
    bcrypt: {
      packages: ['bcrypt@^5.1.0'],
      dev: false
    },
    passport: {
      packages: ['passport@^0.7.0'],
      dev: false
    },
    cors: {
      packages: ['cors@^2.8.0'],
      dev: false
    },
    dotenv: {
      packages: ['dotenv@^16.4.0'],
      dev: false
    },
    nodemon: {
      packages: ['nodemon@^3.1.0'],
      dev: true
    },
    eslint: {
      packages: ['eslint@^8.57.0'],
      dev: true
    },
    prettier: {
      packages: ['prettier@^3.3.0'],
      dev: true
    },
    jest: {
      packages: ['jest@^29.7.0'],
      dev: true
    }
  }
};

// Função auxiliar para executar comandos
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Comando falhou com código ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Função para executar create-vite sem perguntas interativas
function runCreateVite(projectName, template) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['create', 'vite@latest', projectName, '--', '--template', template], {
      stdio: ['pipe', 'inherit', 'inherit'], // stdin como pipe para responder perguntas
      shell: true
    });

    // Responder automaticamente "No" para perguntas de rolldown-vite e install
    let answered = false;
    child.stdin.on('error', () => {}); // Ignorar erros de stdin
    
    // Tentar enviar "N" após um pequeno delay caso apareça prompt
    setTimeout(() => {
      if (!answered && !child.killed) {
        try {
          child.stdin.write('N\n'); // Responder No para rolldown-vite
          child.stdin.write('N\n'); // Responder No para install now
          answered = true;
        } catch (e) {
          // Ignorar se o processo já terminou
        }
      }
    }, 2000);

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`create-vite falhou com código ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Instalar pacotes
async function installPackages(packagesList, packageManager, isDev = false) {
  if (packagesList.length === 0) return;

  const installCmd = packageManager === 'npm' ? 'install' : 'add';
  const devFlag = isDev ? (packageManager === 'npm' ? '--save-dev' : '-D') : '';
  
  const args = [installCmd];
  if (devFlag) args.push(devFlag);
  args.push(...packagesList);

  console.log(`\n⏳ Instalando ${isDev ? 'dev ' : ''}dependências: ${packagesList.join(', ')}\n`);
  
  try {
    await runCommand(packageManager, args);
    console.log(`✅ ${isDev ? 'Dev d' : 'D'}ependências instaladas com sucesso!\n`);
  } catch (error) {
    console.error(`❌ Erro ao instalar pacotes: ${error.message}`);
    throw error;
  }
}

// Configurar Tailwind
async function setupTailwind() {
  console.log('\n⏳ Configurando Tailwind CSS...\n');
  
  try {
    // Criar tailwind.config.js manualmente
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    await fs.writeFile('tailwind.config.js', tailwindConfig);
    console.log('✅ tailwind.config.js criado');

    // Criar postcss.config.js manualmente
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

    await fs.writeFile('postcss.config.js', postcssConfig);
    console.log('✅ postcss.config.js criado');

    // Tailwind não precisa de plugin no Vite, apenas PostCSS
    console.log('ℹ️  Tailwind será processado via PostCSS (configurado acima)')

    // Adicionar imports no CSS
    const cssPath = './src/index.css';
    const tailwindImports = `@tailwind base;
@tailwind components;
@tailwind utilities;

`;
    
    if (await fs.pathExists(cssPath)) {
      const existingCss = await fs.readFile(cssPath, 'utf-8');
      // Verifica se o tailwind já não foi adicionado
      if (!existingCss.includes('@tailwind')) {
        await fs.writeFile(cssPath, tailwindImports + existingCss);
        console.log('✅ Diretivas Tailwind adicionadas ao index.css');
      } else {
        console.log('ℹ️  Diretivas Tailwind já existem no index.css');
      }
    } else {
      // Se não existir, cria o arquivo
      await fs.writeFile(cssPath, tailwindImports);
      console.log('✅ index.css criado com diretivas Tailwind');
    }
    
    console.log('✅ Tailwind configurado com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro ao configurar Tailwind:', error.message);
    throw error;
  }
}

// Setup shadcn/ui
async function setupShadcn(useTypeScript) {
  console.log('\n⏳ Configurando shadcn/ui...\n');
  
  try {
    // Verificar se é TypeScript
    if (!useTypeScript) {
      console.log('⚠️  shadcn/ui requer TypeScript. Pulando instalação do shadcn.');
      console.log('ℹ️  Para usar shadcn/ui, adicione TypeScript ao seu projeto.\n');
      return;
    }

    // Configurar aliases no tsconfig
    console.log('⏳ Configurando TypeScript aliases...');
    
    const tsconfigPath = './tsconfig.json';
    if (await fs.pathExists(tsconfigPath)) {
      const tsconfig = await fs.readJson(tsconfigPath);
      
      if (!tsconfig.compilerOptions) {
        tsconfig.compilerOptions = {};
      }
      
      tsconfig.compilerOptions.baseUrl = '.';
      tsconfig.compilerOptions.paths = {
        '@/*': ['./src/*']
      };
      
      await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
      console.log('✅ Aliases configurados no tsconfig.json');
    }

    // Configurar aliases no tsconfig.app.json
    const tsconfigAppPath = './tsconfig.app.json';
    if (await fs.pathExists(tsconfigAppPath)) {
      let tsconfigAppContent = await fs.readFile(tsconfigAppPath, 'utf-8');
      
      // Adicionar baseUrl e paths antes do último }
      if (!tsconfigAppContent.includes('"baseUrl"')) {
        // Substituir a última propriedade que não tem vírgula para adicionar vírgula
        // e então adicionar as novas propriedades
        tsconfigAppContent = tsconfigAppContent.replace(
          /("noUncheckedSideEffectImports"\s*:\s*true)\n(\s*)\},/,
          '$1,\n\n    /* Path aliases */\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["./src/*"]\n    }\n  },'
        );
        
        await fs.writeFile(tsconfigAppPath, tsconfigAppContent);
        console.log('✅ Aliases configurados no tsconfig.app.json');
      }
    }

    // Configurar vite.config.ts
    const viteConfigPath = './vite.config.ts';
    if (await fs.pathExists(viteConfigPath)) {
      let viteConfig = await fs.readFile(viteConfigPath, 'utf-8');
      
      // Adicionar import do path se não existir
      if (!viteConfig.includes("import path from 'path'")) {
        viteConfig = viteConfig.replace(
          "import { defineConfig } from 'vite'",
          "import { defineConfig } from 'vite'\nimport path from 'path'"
        );
      }
      
      // Adicionar resolve.alias se não existir
      if (!viteConfig.includes('resolve:')) {
        viteConfig = viteConfig.replace(
          'plugins: [react()],',
          `plugins: [react()],\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src'),\n    },\n  },`
        );
      }
      
      await fs.writeFile(viteConfigPath, viteConfig);
      console.log('✅ Aliases configurados no vite.config.ts');
    }

    // Instalar dependências do shadcn
    console.log('\n⏳ Instalando dependências do shadcn/ui...');
    const shadcnDeps = [
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      '@radix-ui/react-slot'
    ];
    await installPackages(shadcnDeps, 'npm', false);

    // Criar diretório lib se não existir
    await fs.ensureDir('./src/lib');

    // Criar arquivo utils.ts
    const utilsContent = `import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n`;
    await fs.writeFile('./src/lib/utils.ts', utilsContent);
    console.log('✅ Arquivo utils.ts criado');

    // Criar components.json
    const componentsJson = {
      "$schema": "https://ui.shadcn.com/schema.json",
      "style": "new-york",
      "rsc": false,
      "tsx": true,
      "tailwind": {
        "config": "tailwind.config.js",
        "css": "src/index.css",
        "baseColor": "neutral",
        "cssVariables": true,
        "prefix": ""
      },
      "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils",
        "ui": "@/components/ui",
        "lib": "@/lib",
        "hooks": "@/hooks"
      }
    };
    await fs.writeJson('./components.json', componentsJson, { spaces: 2 });
    console.log('✅ components.json criado');

    console.log('\n✅ shadcn/ui configurado com sucesso!');
    console.log('ℹ️  Para adicionar componentes, use: npx shadcn@latest add <component-name>\n');
  } catch (error) {
    console.error('❌ Erro ao configurar shadcn/ui:', error.message);
    throw error;
  }
}

export default async function init(options) {
  console.log('\n🚀 Create My Stack\n');

  // Parse packages do comando
  // Aceita tanto vírgulas quanto espaços como separadores (para compatibilidade com PowerShell)
  const packagesFromCmd = options.packages 
    ? options.packages.split(/[,\s]+/).map(p => p.trim()).filter(Boolean)
    : [];
  
  // Debug: mostrar pacotes parseados
  if (packagesFromCmd.length > 0) {
    console.log(`📋 Pacotes detectados no comando: ${packagesFromCmd.join(', ')}\n`);
  }

  // Perguntas interativas
  const questions = [];
  
  // Só pergunta nome se não foi passado via flag
  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Nome do projeto:',
      default: 'my-app',
      validate: (input) => input.length > 0 || 'Nome é obrigatório'
    });
  }

  // Se não veio tipo via comando, perguntar
  if (!options.type) {
    questions.push({
      type: 'list',
      name: 'stackType',
      message: 'Tipo de stack:',
      choices: ['react', 'mern'],
      default: 'react'
    });
  }

  // Se não veio package manager via comando, perguntar
  if (!options.packageManager) {
    questions.push({
      type: 'list',
      name: 'packageManager',
      message: 'Package manager:',
      choices: ['npm', 'yarn', 'pnpm'],
      default: 'npm'
    });
  }

  const answers = await inquirer.prompt(questions);
  
  // Usar valores das flags se foram passados
  const projectName = options.name || answers.projectName || 'my-app';
  const packageManager = options.packageManager || answers.packageManager || 'npm';
  const stackType = options.type || answers.stackType;
  const selectedPackages = packagesFromCmd;

  try {
    if (stackType === 'react') {
      // Determinar se deve usar TypeScript
      const useTypeScript = selectedPackages.includes('typescript');
      const template = useTypeScript ? 'react-ts' : 'react';
      
      console.log('\n⏳ Criando projeto React com Vite...\n');
      
      // Mostrar dependências base
      const baseDeps = ['React', 'ReactDOM', 'Vite'];
      if (useTypeScript) baseDeps.push('TypeScript');
      
      // Mostrar pacotes opcionais que serão instalados
      const optionalDeps = selectedPackages
        .filter(pkg => pkg !== 'typescript')
        .map(pkg => {
          if (pkg === 'tailwind') return 'Tailwind CSS';
          if (pkg === 'shadcn') return 'shadcn/ui';
          if (pkg === 'react-router') return 'React Router';
          if (pkg === 'react-query') return 'TanStack Query';
          return pkg.charAt(0).toUpperCase() + pkg.slice(1);
        });
      
      console.log(`📦 Dependências base: ${baseDeps.join(', ')}`);
      if (optionalDeps.length > 0) {
        console.log(`📦 Pacotes adicionais: ${optionalDeps.join(', ')}`);
      }
      console.log('');
      
      await runCreateVite(projectName, template);

      console.log('\n⏳ Entrando na pasta do projeto...\n');
      process.chdir(projectName);
      
      console.log('\n⏳ Instalando dependências base...\n');
      await runCommand(packageManager, ['install']);

      // Instalar pacotes adicionais selecionados (apenas se houver pacotes opcionais)
      // Filtrar TypeScript da lista, pois já foi tratado no template
      const packagesToInstall = selectedPackages.filter(pkg => pkg !== 'typescript');
      
      console.log(`\n🔍 DEBUG: selectedPackages = [${selectedPackages.join(', ')}]`);
      console.log(`🔍 DEBUG: packagesToInstall = [${packagesToInstall.join(', ')}]`);
      console.log(`🔍 DEBUG: packagesToInstall.length = ${packagesToInstall.length}\n`);
      
      if (packagesToInstall.length > 0) {
        console.log(`\n📦 Pacotes opcionais selecionados: ${packagesToInstall.join(', ')}\n`);

        const prodPackages = [];
        const devPackages = [];
        let needsTailwind = false;
        let needsShadcn = false;

        // Primeiro detectar quais pacotes especiais são necessários
        packagesToInstall.forEach(pkg => {
          const packageInfo = PACKAGE_MAP.react[pkg];
          
          if (!packageInfo) {
            console.log(`⚠️  Pacote "${pkg}" não encontrado no mapeamento`);
            return;
          }

          if (packageInfo.special === 'shadcn') {
            needsShadcn = true;
            needsTailwind = true; // shadcn precisa do tailwind
            return;
          }

          if (pkg === 'tailwind') {
            needsTailwind = true;
            return;
          }

          // Outros pacotes normais
          if (packageInfo.dev) {
            devPackages.push(...packageInfo.packages);
          } else {
            prodPackages.push(...packageInfo.packages);
          }
        });

        // Instalar Tailwind primeiro (se necessário)
        if (needsTailwind) {
          console.log(`\n📦 Instalando Tailwind CSS...`);
          const tailwindPkgs = PACKAGE_MAP.react.tailwind.packages;
          await installPackages(tailwindPkgs, packageManager, true);
          await setupTailwind();
        }

        // Instalar pacotes de produção
        if (prodPackages.length > 0) {
          await installPackages(prodPackages, packageManager, false);
        }

        // Instalar pacotes de dev
        if (devPackages.length > 0) {
          await installPackages(devPackages, packageManager, true);
        }

        // Setup shadcn por último
        if (needsShadcn) {
          await setupShadcn(useTypeScript);
        }
      } else {
        console.log('\n✅ Nenhum pacote opcional selecionado. Apenas as dependências base foram instaladas.\n');
      }

      console.log('\n✅ Projeto criado com sucesso!\n');

      console.log('📦 Próximos passos:\n');
      console.log(`  cd ${projectName}`);
      console.log(`  ${packageManager} ${packageManager === 'npm' ? 'run ' : ''}dev\n`);

    } else {
      // MERN Stack
      const projectPath = path.join(process.cwd(), projectName);
      console.log('\n⏳ Criando estrutura MERN...\n');
      console.log('📦 Dependências obrigatórias: Node.js, Express\n');
      
      await fs.ensureDir(projectPath);
      await fs.ensureDir(path.join(projectPath, 'client'));
      await fs.ensureDir(path.join(projectPath, 'server'));
      await fs.ensureDir(path.join(projectPath, 'server', 'models'));
      await fs.ensureDir(path.join(projectPath, 'server', 'routes'));
      await fs.ensureDir(path.join(projectPath, 'server', 'controllers'));

      const packageJson = {
        name: projectName,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'nodemon server/index.js',
          start: 'node server/index.js'
        },
        dependencies: {
          express: '^4.19.0'
        }
      };

      await fs.writeJson(
        path.join(projectPath, 'package.json'),
        packageJson,
        { spaces: 2 }
      );

      const serverCode = `import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Servidor rodando na porta \${PORT}\`);
});
`;

      await fs.writeFile(
        path.join(projectPath, 'server', 'index.js'),
        serverCode
      );

      process.chdir(projectPath);
      
      console.log('\n⏳ Instalando dependências base...\n');
      await runCommand(packageManager, ['install']);

      // Instalar pacotes MERN adicionais (apenas se houver pacotes opcionais)
      if (selectedPackages.length > 0) {
        console.log(`\n📦 Pacotes opcionais selecionados: ${selectedPackages.join(', ')}\n`);

        const prodPackages = [];
        const devPackages = [];

        selectedPackages.forEach(pkg => {
          const packageInfo = PACKAGE_MAP.mern[pkg];
          
          if (!packageInfo) {
            console.log(`⚠️  Pacote "${pkg}" não encontrado, pulando...`);
            return;
          }

          if (packageInfo.dev) {
            devPackages.push(...packageInfo.packages);
          } else {
            prodPackages.push(...packageInfo.packages);
          }
        });

        if (prodPackages.length > 0) {
          await installPackages(prodPackages, packageManager, false);
        }

        if (devPackages.length > 0) {
          await installPackages(devPackages, packageManager, true);
        }
      } else {
        console.log('\n✅ Nenhum pacote opcional selecionado. Apenas as dependências base foram instaladas.\n');
      }

      console.log('\n✅ Estrutura MERN criada com sucesso!\n');

      console.log('📦 Próximos passos:\n');
      console.log(`  cd ${projectName}`);
      console.log(`  ${packageManager} ${packageManager === 'npm' ? 'run ' : ''}dev\n`);
    }

  } catch (error) {
    console.error('\n❌ Erro ao criar projeto\n');
    console.error(error);
    process.exit(1);
  }
}