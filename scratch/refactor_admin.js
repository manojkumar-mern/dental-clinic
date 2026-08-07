const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '../app/admin');

const classMap = {
  'bg-[#070b15]': 'bg-slate-50 dark:bg-[#070b15]',
  'bg-[#0a0f1d]': 'bg-white dark:bg-[#0a0f1d]',
  'text-slate-100': 'text-slate-900 dark:text-slate-100',
  'text-white': 'text-slate-900 dark:text-white',
  'text-slate-300': 'text-slate-700 dark:text-slate-300',
  'text-slate-400': 'text-slate-600 dark:text-slate-400',
  'text-slate-500': 'text-slate-500 dark:text-slate-500',
  'border-white/\\[0\\.05\\]': 'border-slate-200 dark:border-white/[0.05]',
  'border-white/\\[0\\.03\\]': 'border-slate-200 dark:border-white/[0.03]',
  'border-white/\\[0\\.04\\]': 'border-slate-200 dark:border-white/[0.04]',
  'border-white/\\[0\\.08\\]': 'border-slate-300 dark:border-white/[0.08]',
  'border-white/\\[0\\.1\\]': 'border-slate-300 dark:border-white/[0.1]',
  'bg-white/\\[0\\.01\\]': 'bg-white dark:bg-white/[0.01]',
  'bg-white/\\[0\\.02\\]': 'bg-white dark:bg-white/[0.02]',
  'bg-white/\\[0\\.03\\]': 'bg-slate-50 dark:bg-white/[0.03]',
};

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'page.jsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Step 1: Remove the Sidebar completely.
      // The sidebar is between {/* Side Navigation Bar */} and {/* Main Content Area */}
      content = content.replace(/\{\/\*\s*Side Navigation Bar\s*\*\/\}.*?\{\/\*\s*Main Content Area\s*\*\/\}/s, '');
      
      // Step 2: Remove the layout wrapper 
      // Replace <div className="min-h-screen flex flex-col md:flex-row..."> with <div className="w-full">
      content = content.replace(/<div className="min-h-screen flex flex-col md:flex-row[^"]*">/g, '<div className="w-full">');
      
      // Step 3: Remove <main className="flex-1 p-6 md:p-10 overflow-y-auto">
      content = content.replace(/<main className="flex-1[^"]*">/g, '<div className="w-full">');
      content = content.replace(/<\/main>/g, '</div>');

      // Step 4: Apply dark/light color replacements
      for (const [oldClass, newClass] of Object.entries(classMap)) {
        const regex = new RegExp(`(?<=\\s|"|')${oldClass}(?=\\s|"|')`, 'g');
        content = content.replace(regex, newClass);
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`Processed ${fullPath}`);
    }
  }
}

processDirectory(adminDir);
