const fs = require('fs');
const path = require('path');

function processDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Keep track of the original content to see if we changed it
      const original = content;

      // 1. Remove standard className="..." or className='...'
      content = content.replace(/className=(['"])[^]*?\1/g, '');
      
      // 2. Remove template literal classNames className={`...`}
      content = content.replace(/className=\{`[^]*?`\}/g, '');
      
      // 3. Remove typical conditional classNames up to a simplistic inner brace limit
      // This matches className={ ... } but not recursively if there are deep nested braces (though there rarely are in className)
      content = content.replace(/className=\{[^{}]+\}/g, '');
      
      // Specifically for AdminDashboard.jsx tricky activeTab conditionals
      content = content.replace(/className=\{\s*`[^`]*`\s*\}/g, '');
      
      // Remove any remaining className={activeTab === ... ? '...' : '...'} type patterns
      // Here we can use a more general regex avoiding > 
      content = content.replace(/className=\{[^>]+?\}/g, (match) => {
          if (match.includes('=>') || match.includes('<')) return match; 
          return '';
      });

      // 4. Remove inline styles style={{...}}
      content = content.replace(/style=\{\{[^}]+\}\}/g, '');
      
      // 5. Clean up multiple spaces inside tags left behind by removed classNames
      content = content.replace(/\s+>/g, '>');
      content = content.replace(/<(div|span|h1|h2|h3|h4|h5|p|a|button|section|footer|header|nav|aside|main|table|tr|th|td|ul|li|input|img)\s+/g, '<$1 ');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Processed:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'components'));
processDir(path.join(__dirname, 'src', 'pages'));
console.log('Done mapping components and pages');
