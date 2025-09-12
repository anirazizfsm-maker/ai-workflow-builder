// Simple example: Adding Lethimdo to your existing Express.js website

const express = require('express');
const app = express();

// Your existing middleware
app.use(express.json());

// Your existing routes
app.get('/', (req, res) => {
  res.send(`
    <h1>My Website</h1>
    <h2>Available Integrations:</h2>
    <div id="integrations">Loading...</div>
    <script>
      fetch('/api/website/integrations')
        .then(r => r.json())
        .then(data => {
          document.getElementById('integrations').innerHTML = 
            data.integrations.map(i => 
              \`<div>\${i.name} (\${i.category}) 
               <button onclick="connect('\${i.id}')">Connect</button></div>\`
            ).join('');
        });
      
      function connect(serviceId) {
        fetch('/api/website/connect', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({serviceId, credentials: {apiKey: 'demo-key'}})
        })
        .then(r => r.json())
        .then(data => alert(data.message || 'Connected!'));
      }
    </script>
  `);
});

// Add integration endpoints to your website
app.get('/api/website/integrations', async (req, res) => {
  try {
    // Call Lethimdo API
    const response = await fetch('http://localhost:3001/api/integrations');
    const data = await response.json();
    
    res.json({
      success: true,
      integrations: data.data
    });
  } catch (error) {
    res.status(500).json({ error: 'Integration service unavailable' });
  }
});

app.post('/api/website/connect', async (req, res) => {
  try {
    const { serviceId, credentials } = req.body;
    
    // Call Lethimdo API to create connection
    const response = await fetch(`http://localhost:3001/api/integrations/${serviceId}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentials })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Website running on http://localhost:3000');
  console.log('Make sure Lethimdo API is running on http://localhost:3001');
});

// To run this:
// 1. Save as my-website.js
// 2. Make sure Lethimdo is running: node backend/simple-server.js
// 3. Run your website: node my-website.js
// 4. Visit: http://localhost:3000