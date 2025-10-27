#!/usr/bin/env node

import { program } from 'commander';
import init from '../src/commands/init.js';

program
  .name('create-my-stack')
  .description('CLI para criar projetos com stacks pré-configuradas')
  .version('1.0.0');

program
  .command('init')
  .description('Inicializar novo projeto')
  .option('-t, --type <type>', 'Tipo de stack (react ou mern)')
  .option('-n, --name <name>', 'Nome do projeto')
  .option('-p, --packages <packages>', 'Pacotes separados por vírgula')
  .option('-m, --package-manager <manager>', 'Package manager (npm, yarn, pnpm)')
  .action(init);

program.parse();