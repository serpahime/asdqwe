#!/usr/bin/env node

/**
 * Money Shop Startup Script
 * Универсальный скрипт для запуска проекта на любой платформе
 * 
 * Использование:
 *   node start.js      - Обычный запуск
 *   node start.js --dev - Запуск в режиме разработки
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = __dirname;
const args = process.argv.slice(2);
let isDev = args.includes('--dev');

// ANSI цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(message) {
  log('\n' + '='.repeat(50), 'cyan');
  log(`   ${message}`, 'cyan');
  log('='.repeat(50), 'cyan');
}

function logError(message) {
  log(`❌ ОШИБКА: ${message}`, 'red');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

function logWarn(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      cwd: PROJECT_ROOT,
      shell: true,
      ...options,
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Команда завершилась с кодом ошибки ${code}`));
      } else {
        resolve();
      }
    });

    proc.on('error', reject);
  });
}

function execCommand(command) {
  try {
    return execSync(command, { 
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    }).toString().trim();
  } catch (error) {
    throw new Error(`Ошибка при выполнении команды: ${command}`);
  }
}

// Запуск локальной копии next через node (обход проблем с правами)
async function runLocalNext(args = []) {
  const nextBin = path.join(PROJECT_ROOT, 'node_modules', '.bin', 'next');
  if (fs.existsSync(nextBin)) {
    return runCommand('node', [nextBin, ...args]);
  }
  // fallback
  return runCommand('npx', ['next', ...args]);
}

// Запуск локальной копии next через node (обход проблем с правами на ./node_modules/.bin/next)
async function runLocalNext(args = []) {
  const localNext = path.join(PROJECT_ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');
  if (fs.existsSync(localNext)) {
    return runCommand('node', [localNext, ...args]);
  }
  // fallback to npx if local CLI not found
  return runCommand('npx', ['--yes', 'next', ...args]);
}

async function main() {
  try {
    logSection('Money Shop Startup Script');
    log('');

    // Проверка Node.js
    logWarn('Проверка Node.js...');
    try {
      const nodeVersion = execCommand('node --version');
      logSuccess(`Node.js найден: ${nodeVersion}`);
    } catch (error) {
      logError('Node.js не установлен или не добавлен в PATH');
      log('\nРешение:', 'yellow');
      log('- Скачайте Node.js с https://nodejs.org/', 'yellow');
      log('- Установите его', 'yellow');
      log('- Перезагрузите терминал', 'yellow');
      process.exit(1);
    }

    // Проверка package.json
    const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      logError(`package.json не найден в ${PROJECT_ROOT}`);
      process.exit(1);
    }

    logInfo(`Рабочая директория: ${PROJECT_ROOT}`);
    log('');

    // Установка зависимостей
    logWarn('Проверка зависимостей...');
    logWarn('Установка/обновление зависимостей (npm install)...');
    await runCommand('npm', ['install']);
    logSuccess('Зависимости готовы');
    log('');

    if (!isDev) {
      // Сборка проекта
      logWarn('Сборка проекта (next build)...');
      await runLocalNext(['build']);
      logSuccess('Проект собран');
      log('');

      // Запуск production сервера
      logSection('🚀 Запуск сервера (Production)');
      log('');
      logSuccess('Сервер запускается на http://0.0.0.0:3000');
      log('');
      await runLocalNext(['start', '-H', '0.0.0.0', '-p', '3000']);
    } else {
      // Запуск dev сервера
      logSection('🚀 Запуск сервера (Development)');
      log('');
      logSuccess('Сервер запускается на http://0.0.0.0:3000');
      log('');
      await runLocalNext(['dev', '-H', '0.0.0.0', '-p', '3000']);
    }

  } catch (error) {
    logError(error.message);
    process.exit(1);
  }
}

// Обработка сигналов завершения
process.on('SIGINT', () => {
  log('\n\nШкрипт остановлен пользователем', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n\nШкрипт остановлен', 'yellow');
  process.exit(0);
});

main();
