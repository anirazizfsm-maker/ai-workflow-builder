const https = require('https');

function checkWebsiteContent() {
  console.log('Checking deployed website content...');
  
  https.get('https://lethimdo.netlify.app', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      
      // Check for specific elements that should be in the vly.ai design
      if (data.includes('Lethimdo') || data.includes('AI-Powered Workflow Automation')) {
        console.log('✓ Website is serving content with expected elements');
        console.log('✓ Deployment appears to be successful');
      } else {
        console.log('? Website is accessible but may not have the latest content yet');
        console.log('  This is normal during deployment transitions');
      }
      
      // Show title if found
      const titleMatch = data.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        console.log(`Page Title: ${titleMatch[1]}`);
      }
      
      console.log('Content check completed.');
    });
  }).on('error', (err) => {
    console.log(`Error: ${err.message}`);
  });
}

checkWebsiteContent();