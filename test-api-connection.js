const axios = require('axios');

// Test the new API endpoint
async function testApiConnection() {
  try {
    console.log('Testing API connection to https://api.lethimdo.com...');
    
    // Test the health endpoint
    const healthResponse = await axios.get('https://api.lethimdo.com/health');
    console.log('✅ Health check successful:');
    console.log('Status:', healthResponse.data.status);
    console.log('Environment:', healthResponse.data.environment);
    console.log('Timestamp:', healthResponse.data.timestamp);
    
    // Test the base endpoint
    const baseResponse = await axios.get('https://api.lethimdo.com/');
    console.log('\n✅ Base endpoint check successful:');
    console.log('Data:', baseResponse.data);
    
    console.log('\n🎉 All API connection tests passed!');
    console.log('Your custom domain is working correctly.');
    
  } catch (error) {
    console.error('❌ API connection test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testApiConnection();