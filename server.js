const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Проверка, что мы в правильной директории
const PROJECT_ROOT = __dirname;
const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('\n❌ ОШИБКА: package.json не найден!');
  console.error(`   Текущая директория: ${PROJECT_ROOT}`);
  console.error(`   Ожидаемый путь: ${packageJsonPath}\n`);
  console.error('💡 Решение:');
  console.error('   1. Убедитесь, что вы находитесь в корневой директории проекта');
  console.error('   2. Перейдите в директорию проекта: cd /path/to/your/project');
  console.error('   3. Затем запустите: npm run server\n');
  process.exit(1);
}

// Конфигурация
const PORT = parseInt(process.env.PORT || process.env.APP_PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Определяем корневую директорию для статических файлов
// Для Next.js production: .next/static и public
// Для статического экспорта: out или dist
const STATIC_DIRS = [
  path.join(__dirname, '.next', 'static'),
  path.join(__dirname, 'public'),
  path.join(__dirname, 'out'),
  path.join(__dirname, 'dist'),
];

// MIME типы
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

// Безопасные заголовки
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// Кеширование для статических ресурсов
const CACHE_HEADERS = {
  static: 'public, max-age=31536000, immutable',
  html: 'public, max-age=0, must-revalidate',
};

/**
 * Получить MIME тип по расширению файла
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Проверить, является ли файл статическим ресурсом
 */
function isStaticResource(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext !== '.html' && ext !== '';
}

/**
 * Найти файл в статических директориях
 */
function findFile(filePath) {
  // Сначала пробуем найти файл напрямую
  for (const dir of STATIC_DIRS) {
    if (!fs.existsSync(dir)) continue;
    
    const fullPath = path.join(dir, filePath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return fullPath;
    }
  }
  
  // Если не найден, пробуем найти в public
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    const fullPath = path.join(publicDir, filePath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return fullPath;
    }
  }
  
  return null;
}

/**
 * Найти HTML файл для маршрута
 */
function findHtmlFile(route) {
  // Убираем начальный слэш
  let cleanRoute = route.replace(/^\/+/, '');
  
  // Если маршрут пустой, ищем index.html
  if (!cleanRoute || cleanRoute === '/') {
    cleanRoute = 'index.html';
  }
  
  // Список возможных путей для поиска
  const possiblePaths = [
    // Прямой путь с .html
    cleanRoute.endsWith('.html') ? cleanRoute : `${cleanRoute}.html`,
    // Прямой путь без .html
    !cleanRoute.endsWith('.html') ? cleanRoute : cleanRoute.replace(/\.html$/, ''),
    // index.html в директории
    path.join(cleanRoute, 'index.html'),
    // Для Next.js: пробуем найти в .next/server/pages или app
    path.join('.next', 'server', 'app', cleanRoute, 'page.html'),
    path.join('.next', 'server', 'pages', cleanRoute + '.html'),
  ];
  
  // Проверяем статические директории
  for (const dir of STATIC_DIRS) {
    if (!fs.existsSync(dir)) continue;
    
    for (const possiblePath of possiblePaths) {
      const fullPath = path.join(dir, possiblePath);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        return fullPath;
      }
    }
  }
  
  // Проверяем корневую директорию out (для статического экспорта Next.js)
  const outDir = path.join(__dirname, 'out');
  if (fs.existsSync(outDir)) {
    for (const possiblePath of possiblePaths) {
      const fullPath = path.join(outDir, possiblePath);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        return fullPath;
      }
    }
    
    // Fallback на index.html для SPA
    const indexPath = path.join(outDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }
  
  // Проверяем .next/server для production build
  const nextServerDir = path.join(__dirname, '.next', 'server');
  if (fs.existsSync(nextServerDir)) {
    // Для Next.js production используем fallback на index.html из public
    const publicIndex = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(publicIndex)) {
      return publicIndex;
    }
  }
  
  return null;
}

/**
 * Обработка запроса
 */
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  
  // Убираем query string из pathname для поиска файла
  const filePath = pathname;
  
  // Логирование (опционально)
  console.log(`${req.method} ${pathname}`);
  
  // Обработка статических ресурсов (_next/static, /static, файлы с расширениями)
  if (filePath.startsWith('/_next/') || 
      filePath.startsWith('/static/') ||
      isStaticResource(filePath)) {
    
    const foundFile = findFile(filePath);
    
    if (foundFile) {
      const stats = fs.statSync(foundFile);
      const mimeType = getMimeType(foundFile);
      
      // Устанавливаем заголовки
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Content-Length': stats.size,
        'Cache-Control': CACHE_HEADERS.static,
        ...SECURITY_HEADERS,
      });
      
      // Отправляем файл
      const stream = fs.createReadStream(foundFile);
      stream.pipe(res);
      return;
    }
  }
  
  // Обработка HTML страниц
  const htmlFile = findHtmlFile(filePath);
  
  if (htmlFile) {
    const stats = fs.statSync(htmlFile);
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': Buffer.byteLength(content, 'utf8'),
      'Cache-Control': CACHE_HEADERS.html,
      ...SECURITY_HEADERS,
    });
    
    res.end(content);
    return;
  }
  
  // Если файл не найден, пробуем fallback на index.html для SPA
  const fallbackPaths = [
    path.join(__dirname, 'out', 'index.html'),
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'dist', 'index.html'),
  ];
  
  for (const fallbackPath of fallbackPaths) {
    if (fs.existsSync(fallbackPath)) {
      const content = fs.readFileSync(fallbackPath, 'utf8');
      
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
        'Cache-Control': CACHE_HEADERS.html,
        ...SECURITY_HEADERS,
      });
      
      res.end(content);
      return;
    }
  }
  
  // 404 Not Found
  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8',
    ...SECURITY_HEADERS,
  });
  
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>404 - Страница не найдена</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: #f5f5f5;
        }
        .error {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #e74c3c; margin: 0; }
        p { color: #666; margin: 1rem 0; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="error">
        <h1>404</h1>
        <p>Страница не найдена</p>
        <a href="/">Вернуться на главную</a>
      </div>
    </body>
    </html>
  `);
}

// Создаём HTTP сервер
const server = http.createServer(handleRequest);

// Обработка ошибок
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Запуск сервера
server.listen(PORT, HOST, () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let serverIP = 'localhost';
  
  // Определяем внешний IP адрес
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        serverIP = iface.address;
        break;
      }
    }
  }
  
  console.log(`\n🚀 Server is running!`);
  console.log(`\n📍 Access URLs:`);
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Network:  http://${serverIP}:${PORT}`);
  if (HOST === '0.0.0.0') {
    console.log(`   External: http://YOUR_SERVER_IP:${PORT}`);
  }
  console.log(`\n📂 Project root: ${PROJECT_ROOT}`);
  console.log(`📁 Serving static files from:`);
  const existingDirs = STATIC_DIRS.filter(dir => fs.existsSync(dir));
  if (existingDirs.length > 0) {
    existingDirs.forEach(dir => {
      console.log(`   ✓ ${dir}`);
    });
  } else {
    console.log(`   ⚠️  No static directories found. Make sure you've built the project.`);
  }
  
  console.log(`\n🌐 To use with your domain:`);
  console.log(`   1. Configure reverse proxy (nginx/apache) to forward requests to port ${PORT}`);
  console.log(`   2. Or run on port 80: PORT=80 node server.js (requires root)`);
  console.log(`   3. Make sure firewall allows port ${PORT}`);
  console.log(`\n✨ Ready for deployment!\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
