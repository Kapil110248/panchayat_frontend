import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf8') as f:
        content = f.read()

    original = content
    has_backend = 'BACKEND_URL' in content
    has_api = 'API_BASE_URL' in content

    if not has_backend and not has_api:
        return

    missing = []
    
    if has_backend:
        if not re.search(r'import\s+\{.*BACKEND_URL.*\}\s+from\s+[\'\"]@/lib/api[\'\"]', content):
            missing.append('BACKEND_URL')
    
    if has_api:
        if not re.search(r'import\s+\{.*API_BASE_URL.*\}\s+from\s+[\'\"]@/lib/api[\'\"]', content):
            missing.append('API_BASE_URL')

    if missing:
        print(f'Fixing {filepath}: {missing}')
        if 'import { api } from "@/lib/api";' in content:
            content = content.replace('import { api } from "@/lib/api";', f'import {{ api, {", ".join(missing)} }} from "@/lib/api";')
        elif 'import { api' in content:
            # simple fallback
            content = f'import {{ {", ".join(missing)} }} from "@/lib/api";\n' + content
        else:
            content = f'import {{ {", ".join(missing)} }} from "@/lib/api";\n' + content

        with open(filepath, 'w', encoding='utf8') as f:
            f.write(content)

for root, dirs, files in os.walk('app'):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            process_file(os.path.join(root, file))

for root, dirs, files in os.walk('components'):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            process_file(os.path.join(root, file))
