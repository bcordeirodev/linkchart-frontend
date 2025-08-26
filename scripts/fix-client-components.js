#!/usr/bin/env node

/**
 * Script para corrigir automaticamente problemas de client components
 * Adiciona 'use client' onde necessário
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const SRC_DIR = path.join(__dirname, '../src');
const CLIENT_HOOKS = ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer'];

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

// Função para adicionar 'use client' no início do arquivo
function addUseClient(content) {
  // Se já tem, não adicionar
  if (hasUseClient(content)) {
    return content;
  }
  
  // Encontrar a primeira linha que não é comentário ou import
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Pular shebang se existir
  if (lines[0] && lines[0].startsWith('#!')) {
    insertIndex = 1;
  }
  
  // Pular comentários iniciais
  while (insertIndex < lines.length) {
    const line = lines[insertIndex].trim();
    if (line === '' || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      insertIndex++;
    } else {
      break;
    }
  }
  
  // Inserir 'use client' na posição correta
  lines.splice(insertIndex, 0, "'use client';", '');
  
  return lines.join('\n');
}

// Função para corrigir arquivo
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(SRC_DIR, filePath);
    
    // Verificar se precisa de correção
    if (needsUseClient(content) && !hasUseClient(content)) {
      const fixedContent = addUseClient(content);
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      log(`✅ Corrigido: ${relativePath}`, 'green');
      return true;
    }
    
    return false;
  } catch (error) {
    log(`❌ Erro ao corrigir ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

// Função para escanear e corrigir diretório
function fixDirectory(dir) {
  let fixedCount = 0;
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        // Pular arquivos que não precisam de 'use client'
        const relativePath = path.relative(SRC_DIR, fullPath);
        
        // Pular tipos, configurações e alguns utilitários
        if (
          relativePath.includes('/types/') ||
          relativePath.includes('.d.ts') ||
          relativePath.includes('config') ||
          relativePath.includes('constants') ||
          item.includes('.type.') ||
          item.includes('.config.')
        ) {
          continue;
        }
        
        if (fixFile(fullPath)) {
          fixedCount++;
        }
      }
    }
  }
  
  scan(dir);
  return fixedCount;
}

// Função principal
function main() {
  log('🔧 Corrigindo client components...', 'blue');
  log('', 'reset');
  
  const fixedCount = fixDirectory(SRC_DIR);
  
  log('', 'reset');
  log(`📊 RESUMO:`, 'blue');
  log(`  Arquivos corrigidos: ${fixedCount}`, fixedCount > 0 ? 'green' : 'yellow');
  
  if (fixedCount > 0) {
    log('', 'reset');
    log('💡 PRÓXIMOS PASSOS:', 'blue');
    log('  1. Execute: npm run validate', 'yellow');
    log('  2. Execute: npm run build', 'yellow');
    log('  3. Teste a aplicação', 'yellow');
  } else {
    log('', 'reset');
    log('✅ Nenhuma correção necessária!', 'green');
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fixFile, fixDirectory };
