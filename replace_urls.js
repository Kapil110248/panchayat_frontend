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

    // 1. Replace the long ternary for backend url
    // ${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'https://panchayat-backend-0aqf.onrender.com'}
    content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \? process\.env\.NEXT_PUBLIC_API_URL\.replace\('\/api', ''\) : 'https:\/\/panchayat-backend-0aqf\.onrender\.com'\}/g, '${BACKEND_URL}');

    // process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : "https://panchayat-backend-0aqf.onrender.com"
    content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL \? process\.env\.NEXT_PUBLIC_API_URL\.replace\('\/api', ''\) : "https:\/\/panchayat-backend-0aqf\.onrender\.com"/g, 'BACKEND_URL');

    // 2. Replace process.env.NEXT_PUBLIC_API_URL || "https://panchayat-backend-0aqf.onrender.com/api"
    content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL \|\| "https:\/\/panchayat-backend-0aqf\.onrender\.com\/api"/g, 'API_BASE_URL');

    // 3. Replace direct bare https://panchayat-backend-0aqf.onrender.com string
    content = content.replace(/`https:\/\/panchayat-backend-0aqf\.onrender\.com/g, '`${BACKEND_URL}');
    content = content.replace(/'https:\/\/panchayat-backend-0aqf\.onrender\.com/g, 'BACKEND_URL + \'');
    
    if (content !== original) {
        // needs import
        let imports = [];
        if(content.includes('API_BASE_URL')) imports.push('API_BASE_URL');
        if(content.includes('BACKEND_URL')) imports.push('BACKEND_URL');
        
        if (imports.length > 0 && !content.includes('import {') && !content.includes(imports[0])) {
             // We need to add import { ... } from "@/lib/api";
             // If api is already imported, we can just add to it.
             if (content.includes('import { api } from "@/lib/api";')) {
                 content = content.replace('import { api } from "@/lib/api";', `import { api, ${imports.join(', ')} } from "@/lib/api";`);
             } else if (content.includes('import { api,') || content.includes(', api }')) {
                 // skip complex parsing, just append a new import
                 content = `import { ${imports.join(', ')} } from "@/lib/api";\n` + content;
             } else {
                 content = `import { ${imports.join(', ')} } from "@/lib/api";\n` + content;
             }
        } else if (imports.length > 0) {
             // ensure it's imported
             let missing = imports.filter(i => !content.includes(` ${i}`) && !content.includes(`{${i}`) && !content.includes(`${i} `));
             if (missing.length > 0) {
                  content = `import { ${missing.join(', ')} } from "@/lib/api";\n` + content;
             }
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

const rootDir = __dirname;
processDir(path.join(rootDir, 'app'));
processDir(path.join(rootDir, 'components'));
