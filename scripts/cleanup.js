#!/usr/bin/env node

/**
 * Script para limpeza de arquivos e código morto
 * Remove arquivos desnecessários e otimiza o projeto
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const PROJECT_ROOT = path.join(__dirname, '..');

// Cores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Arquivos e diretórios para limpeza
const CLEANUP_TARGETS = {
  // Arquivos temporários
  tempFiles: [
    '.next',
    'node_modules/.cache',
    '.npm',
    '*.log',
    '*.tgz',
    '.DS_Store',
    'Thumbs.db'
  ],
  
  // Arquivos de build antigos
  buildFiles: [
    'dist',
    'build',
    'out'
  ],
  
  // Arquivos de desenvolvimento
  devFiles: [
    '.vscode/settings.json.bak',
    '*.tmp',
    '*.temp',
    '.env.local.bak'
  ]
};

// Função para verificar se arquivo/diretório existe
function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

// Função para remover arquivo/diretório
function remove(target) {
  try {
    const fullPath = path.join(PROJECT_ROOT, target);
    
    if (!exists(fullPath)) {
      return false;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
    
    return true;
  } catch (error) {
    log(`❌ Erro ao remover ${target}: ${error.message}`, 'red');
    return false;
  }
}

// Função para limpar arquivos temporários
function cleanTempFiles() {
  log('🧹 Limpando arquivos temporários...', 'yellow');
  let cleaned = 0;
  
  for (const target of CLEANUP_TARGETS.tempFiles) {
    if (remove(target)) {
      log(`  ✅ Removido: ${target}`, 'green');
      cleaned++;
    }
  }
  
  return cleaned;
}

// Função para limpar arquivos de build
function cleanBuildFiles() {
  log('🏗️  Limpando arquivos de build...', 'yellow');
  let cleaned = 0;
  
  for (const target of CLEANUP_TARGETS.buildFiles) {
    if (remove(target)) {
      log(`  ✅ Removido: ${target}`, 'green');
      cleaned++;
    }
  }
  
  return cleaned;
}

// Função para limpar arquivos de desenvolvimento
function cleanDevFiles() {
  log('🔧 Limpando arquivos de desenvolvimento...', 'yellow');
  let cleaned = 0;
  
  for (const target of CLEANUP_TARGETS.devFiles) {
    if (remove(target)) {
      log(`  ✅ Removido: ${target}`, 'green');
      cleaned++;
    }
  }
  
  return cleaned;
}

// Função para otimizar package.json
function optimizePackageJson() {
  log('📦 Otimizando package.json...', 'yellow');
  
  try {
    const packagePath = path.join(PROJECT_ROOT, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Remover campos desnecessários
    const unnecessaryFields = ['_id', '_from', '_resolved', '_integrity', '_shasum'];
    let removed = 0;
    
    for (const field of unnecessaryFields) {
      if (packageJson[field]) {
        delete packageJson[field];
        removed++;
      }
    }
    
    if (removed > 0) {
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
      log(`  ✅ Removidos ${removed} campos desnecessários`, 'green');
    } else {
      log(`  ℹ️  Nenhum campo desnecessário encontrado`, 'blue');
    }
    
    return removed;
  } catch (error) {
    log(`❌ Erro ao otimizar package.json: ${error.message}`, 'red');
    return 0;
  }
}

// Função para verificar arquivos duplicados
function checkDuplicateFiles() {
  log('🔍 Verificando arquivos duplicados...', 'yellow');
  
  const duplicates = [
    // Verificar se há arquivos de configuração duplicados
    { original: 'tsconfig.json', duplicate: 'tsconfig.json.bak' },
    { original: 'next.config.mjs', duplicate: 'next.config.js' },
    { original: '.env.production', duplicate: '.env.production.bak' }
  ];
  
  let found = 0;
  
  for (const { original, duplicate } of duplicates) {
    const originalPath = path.join(PROJECT_ROOT, original);
    const duplicatePath = path.join(PROJECT_ROOT, duplicate);
    
    if (exists(originalPath) && exists(duplicatePath)) {
      log(`  ⚠️  Arquivo duplicado encontrado: ${duplicate}`, 'yellow');
      log(`     Considere remover se ${original} está atualizado`, 'yellow');
      found++;
    }
  }
  
  if (found === 0) {
    log(`  ✅ Nenhum arquivo duplicado encontrado`, 'green');
  }
  
  return found;
}

// Função para verificar dependências não utilizadas
function checkUnusedDependencies() {
  log('📋 Verificando dependências...', 'yellow');
  
  try {
    const packagePath = path.join(PROJECT_ROOT, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    
    log(`  📦 Dependências de produção: ${deps.length}`, 'blue');
    log(`  🔧 Dependências de desenvolvimento: ${devDeps.length}`, 'blue');
    log(`  💡 Para análise detalhada, execute: npm run audit`, 'blue');
    
    return deps.length + devDeps.length;
  } catch (error) {
    log(`❌ Erro ao verificar dependências: ${error.message}`, 'red');
    return 0;
  }
}

// Função principal
function main() {
  log('🚀 Iniciando limpeza do projeto...', 'blue');
  log('', 'reset');
  
  let totalCleaned = 0;
  
  // Executar limpezas
  totalCleaned += cleanTempFiles();
  totalCleaned += cleanBuildFiles();
  totalCleaned += cleanDevFiles();
  totalCleaned += optimizePackageJson();
  
  // Verificações
  checkDuplicateFiles();
  checkUnusedDependencies();
  
  log('', 'reset');
  log('📊 RESUMO DA LIMPEZA:', 'blue');
  log(`  Arquivos/diretórios removidos: ${totalCleaned}`, totalCleaned > 0 ? 'green' : 'yellow');
  
  if (totalCleaned > 0) {
    log('', 'reset');
    log('💡 RECOMENDAÇÕES:', 'blue');
    log('  1. Execute: npm run validate', 'yellow');
    log('  2. Execute: npm run build', 'yellow');
    log('  3. Teste a aplicação', 'yellow');
  } else {
    log('', 'reset');
    log('✅ Projeto já está limpo!', 'green');
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { cleanTempFiles, cleanBuildFiles, cleanDevFiles, optimizePackageJson };
