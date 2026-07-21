const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const hasBackendUrl = content.includes('BACKEND_URL');
    const hasApiBaseUrl = content.includes('API_BASE_URL');
    
    if (hasBackendUrl || hasApiBaseUrl) {
        let missingImports = [];
        if (hasBackendUrl && !content.includes(' BACKEND_URL') && !content.includes('{ BACKEND_URL') && !content.includes('BACKEND_URL,') && !content.includes('BACKEND_URL }') && !content.includes('{BACKEND_URL}')) {
             missingImports.push('BACKEND_URL');
        }
        if (hasApiBaseUrl && !content.includes(' API_BASE_URL') && !content.includes('{ API_BASE_URL') && !content.includes('API_BASE_URL,') && !content.includes('API_BASE_URL }') && !content.includes('{API_BASE_URL}')) {
             missingImports.push('API_BASE_URL');
        }
        
        if (missingImports.length > 0) {
            console.log('Missing in ' + filePath + ': ' + missingImports.join(', '));
            if (content.includes('import { api } from "@/lib/api";')) {
                content = content.replace('import { api } from "@/lib/api";', 'import { api, ' + missingImports.join(', ') + ' } from "@/lib/api";');
            } else if (content.includes('import { api, ') || content.includes(', api }')) {
                content = 'import { ' + missingImports.join(', ') + ' } from "@/lib/api";\n' + content;
            } else {
                content = 'import { ' + missingImports.join(', ') + ' } from "@/lib/api";\n' + content;
            }
            fs.writeFileSync(filePath, content);
        }
    }
}

const rootDir = __dirname;
processDir(path.join(rootDir, 'app'));
processDir(path.join(rootDir, 'components'));
