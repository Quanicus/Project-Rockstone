import fs from 'fs';
import path from 'path';

const directoryToSearch = './public/styles';
const htmlFilePath = './public/base-index.html';

function getAllFiles(directory) {
  const files = [];
  const contents = fs.readdirSync(directory);

  for (const item of contents) {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(itemPath)); // Recursively search subdirectories.
    } else {
      files.push(itemPath); // Add file path to the list.
    }
  }
  return files;
}

export default function inject_css() {
  console.log('injecting');
  // Read the HTML file.
  const html = fs.readFileSync(htmlFilePath, 'utf8');

  // Find where you want to insert the <link> elements (e.g., inside the <head> element).
  const headTagIndex = html.indexOf('</head>');

  // Insert the <link> elements.
  if (headTagIndex !== -1) {
    //console.log('in the html');
    const linkElements = 
      getAllFiles(directoryToSearch)
      .map(file => `<link rel="stylesheet" type="text/css" href="${file.slice(7)}">`)
      .join('');
    //console.log(linkElements);
    const modifiedHtml = `${html.slice(0, headTagIndex)}${linkElements}${html.slice(headTagIndex)}`;
    // Write the modified HTML content back to the HTML file.
    fs.writeFileSync('./public/index.html', modifiedHtml);
  }
  console.log('injected');
}


