import fs from 'fs';
import path from 'path';

const patches = {
    'AdminDashboard.jsx': ['Plus', 'XCircle', 'Brain', 'Database', 'Clock', 'FileText'],
    'CoreCSManager.jsx': ['Plus', 'Folder', 'ChevronRight'],
    'CoreCSSubject.jsx': ['ChevronRight', 'Search', 'CheckCircle2'],
    'ForgotPassword.jsx': ['Lock', 'Sparkles', 'ArrowLeft'],
    'Learning.jsx': ['BookOpen', 'MessageCircle', 'Briefcase', 'Bot', 'ChevronDown', 'Settings', 'RotateCcw', 'ChevronRight', 'CheckCircle', 'Cpu', 'FileCode', 'Check', 'X', 'History', 'HelpCircle'],
    'MockAssessment.jsx': ['Terminal'],
    'OopsGuide.jsx': ['ChevronDown'],
    'OSTutorial.jsx': ['ChevronDown', 'TerminalSquare', 'Target', 'Info', 'Sparkles'],
    'Problems.jsx': ['Tag', 'CheckCircle2', 'Book', 'HelpCircle'],
    'ProblemView.jsx': ['FileText', 'Book', 'ChevronLeft', 'Tag', 'Building2', 'Lock', 'ChevronDown', 'RotateCcw', 'Maximize2', 'CheckCircle', 'History'],
    'Profile.jsx': ['Trophy', 'HelpCircle'],
    'TutorialPlayer.jsx': ['Share2', 'Play']
};

for (const [filename, newImports] of Object.entries(patches)) {
    const fullPath = path.join('./src/pages', filename);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    // Find the lucide-react import block
    // It can be single line or multiline
    const lucideRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/;
    const match = content.match(lucideRegex);

    if (match) {
        // Parse existing imports
        const existingImportsStr = match[1];
        const existingImports = existingImportsStr.split(',').map(i => i.trim()).filter(Boolean);

        // Add new ones
        const toAdd = newImports.filter(name => !existingImports.includes(name));

        if (toAdd.length > 0) {
            const combined = [...existingImports, ...toAdd];
            const newImportStr = `import {\n    ${combined.join(', ')}\n} from 'lucide-react'`;

            content = content.replace(lucideRegex, newImportStr);
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`[+] Patched ${filename}: added ${toAdd.join(', ')}`);
        } else {
            console.log(`[-] ${filename} already has all icons.`);
        }
    } else {
        // If not found, add it
        const newImportStr = `import { ${newImports.join(', ')} } from 'lucide-react';\n`;
        content = newImportStr + content;
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`[+] Patched ${filename}: created new lucide-react import`);
    }
}
