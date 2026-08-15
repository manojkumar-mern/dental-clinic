const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const targetDir = path.resolve(__dirname, "../app");

walkDir(targetDir, (filePath) => {
  if (!filePath.endsWith(".jsx") && !filePath.endsWith(".js")) return;

  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes("http://localhost:5000/api")) {
    console.log(`Processing file: ${filePath}`);
    
    // Replace the URLs
    // Regex matches "http://localhost:5000/api/some/path" and replaces it with `${API_BASE_URL}/some/path`
    // We also handle backtick string replacement if it is `http://localhost:5000/api/some/path`
    content = content.replace(/["']http:\/\/localhost:5000\/api(.*?)["']/g, (match, pathGroup) => {
      return `\`\${API_BASE_URL}${pathGroup}\``;
    });
    
    content = content.replace(/`http:\/\/localhost:5000\/api(.*?)`/g, (match, pathGroup) => {
      return `\`\${API_BASE_URL}${pathGroup}\``;
    });

    // Check if API_BASE_URL is imported, if not add it
    if (!content.includes("API_BASE_URL")) {
      // Find the first line after "use client" or the top of the file
      if (content.includes('"use client";')) {
        content = content.replace('"use client";', '"use client";\nimport { API_BASE_URL } from "@/lib/api";');
      } else if (content.includes("'use client';")) {
        content = content.replace("'use client';", "'use client';\nimport { API_BASE_URL } from '@/lib/api';");
      } else {
        content = 'import { API_BASE_URL } from "@/lib/api";\n' + content;
      }
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated: ${filePath}`);
  }
});
