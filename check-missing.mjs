import fs from 'fs';
import path from 'path';

function findFiles(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findFiles(fullPath, filesList);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            filesList.push(fullPath);
        }
    }
    return filesList;
}

const allFiles = findFiles('./src');
let foundErrors = false;

for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');

    // Find lucide-react imports
    const lucideImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
    const importedIcons = new Set();

    if (lucideImportMatch) {
        lucideImportMatch[1].split(',').forEach(i => importedIcons.add(i.trim()));
    }

    // Find all JSX tags
    const jsxTagRegex = /<([A-Z][a-zA-Z0-9]*)/g;
    let match;
    while ((match = jsxTagRegex.exec(content)) !== null) {
        const tag = match[1];
        // If it looks like a lucide icon (we can guess by checking if it's imported anywhere, or just check standard React components)
        // Actually, just check if it's imported at all from ANYWHERE
        const isImported = content.includes(`import ${tag}`) ||
            content.includes(`{ ${tag} }`) ||
            content.includes(`{${tag}}`) ||
            content.includes(`{ ${tag},`) ||
            content.includes(`, ${tag} }`) ||
            content.includes(`{${tag},`) ||
            content.includes(`,${tag}}`) ||
            content.includes(`, ${tag},`) ||
            content.includes(`const ${tag}`) ||
            content.includes(`class ${tag}`) ||
            content.includes(`function ${tag}`) ||
            tag === 'Fragment' ||
            tag === 'ReactMarkdown' ||
            content.match(new RegExp(`import\\s+.*?\\b${tag}\\b.*?\\s+from`));

        if (!isImported && tag !== 'QA') { // Ignoring local components like QA
            // But wait, the standard heuristic: if it's used as <Tag> it must be imported or declared.
            // Let's print out potential missing ones.
            console.log(`[!] ${file}: <${tag}> seems to have no import or declaration.`);
            foundErrors = true;
        }
    }
}

if (!foundErrors) console.log("No obvious missing imports found.");
