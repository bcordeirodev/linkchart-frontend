#!/usr/bin/env node

/**
 * Script para validar estrutura do projeto Link Charts
 * Verifica client components, estrutura de arquivos e otimizações
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const SRC_DIR = path.join(__dirname, '../src');
const CLIENT_HOOKS = ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer'];
const MAX_PAGE_LINES = 100;
const MAX_COMPONENT_LINES = 250;

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

// Função para verificar se arquivo precisa de 'use client'
function needsUseClient(content) {
  return CLIENT_HOOKS.some(hook => content.includes(hook));
}

// Função para verificar se arquivo tem 'use client'
function hasUseClient(content) {
  return content.includes("'use client'") || content.includes('"use client"');
}

// Função para contar linhas de código (excluindo comentários e linhas vazias)
function countCodeLines(content) {
  return content
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*');
    })
    .length;
}

// Função para verificar arquivo
function validateFile(filePath) {
  const issues = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(SRC_DIR, filePath);
  
  // Verificar client components
  if (needsUseClient(content) && !hasUseClient(content)) {
    issues.push({
      type: 'client-directive',
      message: `Arquivo usa hooks client mas não tem 'use client' directive`,
      file: relativePath,
      severity: 'error'
    });
  }
  
  // Verificar tamanho dos arquivos
  const lines = countCodeLines(content);
  const isPage = filePath.includes('/page.tsx') || filePath.includes('/layout.tsx');
  const isComponent = filePath.includes('/components/');
  
  if (isPage && lines > MAX_PAGE_LINES) {
    issues.push({
      type: 'file-size',
      message: `Página tem ${lines} linhas (máximo: ${MAX_PAGE_LINES})`,
      file: relativePath,
      severity: 'warning'
    });
  }
  
  if (isComponent && lines > MAX_COMPONENT_LINES) {
    issues.push({
      type: 'file-size',
      message: `Componente tem ${lines} linhas (máximo: ${MAX_COMPONENT_LINES})`,
      file: relativePath,
      severity: 'warning'
    });
  }
  
  // Verificar imports não otimizados
  const hasUnoptimizedMuiImports = content.includes('from "@mui/material"') && 
    !content.includes('from "@mui/material/');
  
  if (hasUnoptimizedMuiImports) {
    issues.push({
      type: 'import-optimization',
      message: 'Imports do Material-UI podem ser otimizados',
      file: relativePath,
      severity: 'info'
    });
  }
  
  return issues;
}

// Função para escanear diretório
function scanDirectory(dir) {
  const issues = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        issues.push(...validateFile(fullPath));
      }
    }
  }
  
  scan(dir);
  return issues;
}

// Função para verificar build
function checkBuild() {
  try {
    log('🔍 Verificando build...', 'blue');
    const buildOutput = execSync('npm run build', { 
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    // Verificar warnings no build
    const hasWarnings = buildOutput.includes('⚠') || buildOutput.includes('warning');
    
    if (hasWarnings) {
      log('⚠️  Build tem warnings', 'yellow');
      return false;
    } else {
      log('✅ Build compilou sem warnings', 'green');
      return true;
    }
  } catch (error) {
    log('❌ Erro no build:', 'red');
    log(error.message, 'red');
    return false;
  }
}

// Função principal
function main() {
  log('🚀 Validando estrutura do projeto Link Charts...', 'blue');
  log('', 'reset');
  
  // Escanear arquivos
  const issues = scanDirectory(SRC_DIR);
  
  // Agrupar issues por tipo
  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {});
  
  // Mostrar resultados
  let hasErrors = false;
  let hasWarnings = false;
  
  for (const [type, typeIssues] of Object.entries(groupedIssues)) {
    log(`\n📋 ${type.toUpperCase().replace('-', ' ')}:`, 'blue');
    
    for (const issue of typeIssues) {
      const color = issue.severity === 'error' ? 'red' : 
                   issue.severity === 'warning' ? 'yellow' : 'blue';
      
      log(`  ${issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️'} ${issue.file}: ${issue.message}`, color);
      
      if (issue.severity === 'error') hasErrors = true;
      if (issue.severity === 'warning') hasWarnings = true;
    }
  }
  
  // Verificar build
  log('\n🏗️  VERIFICAÇÃO DE BUILD:', 'blue');
  const buildSuccess = checkBuild();
  
  // Resumo final
  log('\n📊 RESUMO:', 'blue');
  log(`  Total de issues: ${issues.length}`, 'reset');
  log(`  Erros: ${issues.filter(i => i.severity === 'error').length}`, hasErrors ? 'red' : 'green');
  log(`  Warnings: ${issues.filter(i => i.severity === 'warning').length}`, hasWarnings ? 'yellow' : 'green');
  log(`  Infos: ${issues.filter(i => i.severity === 'info').length}`, 'blue');
  log(`  Build: ${buildSuccess ? 'OK' : 'FALHOU'}`, buildSuccess ? 'green' : 'red');
  
  // Recomendações
  if (issues.length > 0) {
    log('\n💡 RECOMENDAÇÕES:', 'blue');
    
    if (issues.some(i => i.type === 'client-directive')) {
      log('  - Adicionar "use client" em componentes que usam hooks', 'yellow');
    }
    
    if (issues.some(i => i.type === 'file-size')) {
      log('  - Quebrar arquivos grandes em componentes menores', 'yellow');
    }
    
    if (issues.some(i => i.type === 'import-optimization')) {
      log('  - Otimizar imports do Material-UI para reduzir bundle size', 'yellow');
    }
  }
  
  // Exit code
  if (hasErrors || !buildSuccess) {
    log('\n❌ Validação falhou', 'red');
    process.exit(1);
  } else {
    log('\n✅ Estrutura do projeto está OK!', 'green');
    process.exit(0);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateFile, scanDirectory, checkBuild };
