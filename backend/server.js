const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/build")));


// Apify API Base URL
const APIFY_API_BASE = 'https://api.apify.com/v2';

// Helper function to make authenticated requests to Apify API
const makeApifyRequest = async (endpoint, apiKey, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url: `${APIFY_API_BASE}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Apify API Error:', error.response?.data || error.message);
    
    // Extract more detailed error information
    let errorMessage = 'Failed to communicate with Apify API';
    
    if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw {
      status: error.response?.status || 500,
      message: errorMessage,
      details: error.response?.data
    };
  }
};

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});
// Route to verify API key and get user info
app.post('/api/verify-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const userData = await makeApifyRequest('/users/me', apiKey);
    res.json({ 
      success: true, 
      user: {
        id: userData.data.id,
        username: userData.data.username,
        email: userData.data.email
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({ 
      error: error.message || 'Invalid API key' 
    });
  }
});

// Route to get user's actors
app.post('/api/actors', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const actorsData = await makeApifyRequest('/acts', apiKey);
    
    // Filter and format actors data
    const actors = actorsData.data.items.map(actor => ({
      id: actor.id,
      name: actor.name,
      title: actor.title || actor.name,
      description: actor.description,
      username: actor.username,
      isPublic: actor.isPublic,
      stats: actor.stats
    }));

    res.json({ actors });
  } catch (error) {
    res.status(error.status || 500).json({ 
      error: error.message || 'Failed to fetch actors' 
    });
  }
});

// Route to get actor's input schema
app.post('/api/actors/:actorId/schema', async (req, res) => {
  try {
    const { actorId } = req.params;
    const { apiKey } = req.body;
    
    console.log(`Fetching schema for actor: ${actorId}`);
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const actorData = await makeApifyRequest(`/acts/${actorId}`, apiKey);
    
    console.log(`Actor data received for ${actorId}:`, {
      name: actorData.data.name,
      hasInputSchema: !!actorData.data.inputSchema,
      hasExampleRunInput: !!actorData.data.exampleRunInput,
      hasDefaultRunOptions: !!actorData.data.defaultRunOptions
    });
    
    // Try to get input schema from multiple sources
    let inputSchema = {};
    
    // First try to get from input schema definition
    if (actorData.data.inputSchema) {
      const schemaProps = actorData.data.inputSchema.properties || {};
      // Convert JSON schema to simple key-value pairs with example values
      Object.keys(schemaProps).forEach(key => {
        const prop = schemaProps[key];
        if (prop.type === 'string') {
          inputSchema[key] = prop.example || prop.default || prop.prefill || '';
        } else if (prop.type === 'boolean') {
          inputSchema[key] = prop.default !== undefined ? prop.default : false;
        } else if (prop.type === 'number' || prop.type === 'integer') {
          inputSchema[key] = prop.example || prop.default || 0;
        } else if (prop.type === 'array') {
          inputSchema[key] = prop.example || prop.default || [];
        } else if (prop.type === 'object') {
          inputSchema[key] = prop.example || prop.default || {};
        } else {
          inputSchema[key] = prop.example || prop.default || prop.prefill || '';
        }
      });
    }
    
    // If still empty after processing schema, provide a basic URL-only structure
    if (Object.keys(inputSchema).length === 0) {
      inputSchema = {
        url: 'https://httpbin.org/post'
      };
    }
    
    // Always ensure URL field exists - try different common URL patterns
    if (!inputSchema.url && !inputSchema.startUrl && !inputSchema.startUrls) {
      // Use different URLs based on common patterns
      if (actorData.data.name && actorData.data.name.toLowerCase().includes('scraper')) {
        inputSchema.url = 'https://httpbin.org/post';
      } else if (actorData.data.name && actorData.data.name.toLowerCase().includes('api')) {
        inputSchema.url = 'https://httpbin.org/post';
      } else {
        inputSchema.url = 'https://httpbin.org/post';
      }
    }
    
    console.log('Input schema properties:', actorData.data.inputSchema?.properties);
    console.log('Final schema being sent:', JSON.stringify(inputSchema, null, 2));
    
    res.json({ 
      schema: inputSchema,
      inputSchemaDefinition: actorData.data.inputSchema,
      actorInfo: {
        name: actorData.data.name,
        title: actorData.data.title,
        description: actorData.data.description
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({ 
      error: error.message || 'Failed to fetch actor schema' 
    });
  }
});

// Route to run an actor
app.post('/api/actors/:actorId/run', async (req, res) => {
  try {
    const { actorId } = req.params;
    const { apiKey, input } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    // Log the input we're sending
    console.log('Sending input to actor:', JSON.stringify(input, null, 2));
    
    // Validate and clean the input before sending
    let cleanInput = input || {};
    
    // If URL is provided, ensure it's valid
    if (cleanInput.url) {
      try {
        new URL(cleanInput.url);
      } catch (e) {
        console.error('Invalid URL provided:', cleanInput.url);
        return res.status(400).json({ error: `Invalid URL provided: ${cleanInput.url}` });
      }
    }
    
    console.log('Clean input being sent:', JSON.stringify(cleanInput, null, 2));
    
    // Start the actor run
    const runData = await makeApifyRequest(
      `/acts/${actorId}/runs`, 
      apiKey, 
      'POST', 
      cleanInput
    );

    const runId = runData.data.id;
    
    // Poll for completion (with timeout)
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes timeout
    let runStatus = 'RUNNING';
    let runResult = null;

    console.log(`Starting to poll for run ${runId} status...`);

    while (attempts < maxAttempts && (runStatus === 'RUNNING' || runStatus === 'READY')) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
      
      const statusData = await makeApifyRequest(`/acts/${actorId}/runs/${runId}`, apiKey);
      runStatus = statusData.data.status;
      runResult = statusData.data;
      
      console.log(`Attempt ${attempts + 1}: Run status is ${runStatus}`);
      attempts++;
    }

    if (runStatus === 'SUCCEEDED') {
      // Get the run results
      const resultsData = await makeApifyRequest(
        `/acts/${actorId}/runs/${runId}/dataset/items`, 
        apiKey
      );
      
      res.json({
        success: true,
        runId,
        status: runStatus,
        results: resultsData,
        stats: runResult.stats
      });
    } else if (runStatus === 'FAILED') {
      // Get more detailed error information
      let errorMessage = 'Actor run failed';
      if (runResult.statusMessage) {
        errorMessage = runResult.statusMessage;
      } else if (runResult.exitCode) {
        errorMessage = `Actor failed with exit code: ${runResult.exitCode}`;
      }
      
      res.status(400).json({
        error: errorMessage,
        runId,
        status: runStatus,
        errorMessage: runResult.exitCode,
        statusMessage: runResult.statusMessage,
        fullResult: runResult
      });
    } else {
      res.status(408).json({
        error: 'Actor run timed out',
        runId,
        status: runStatus,
        message: 'The run is still in progress. You can check its status later.'
      });
    }
  } catch (error) {
    res.status(error.status || 500).json({ 
      error: error.message || 'Failed to run actor' 
    });
  }
});



// Route to run a generic HTTP request actor with dynamic input schema
app.post('/api/run-generic-actor', async (req, res) => {
  try {
    const { apiKey, url, method = 'GET', body, contentType } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate HTTP method
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    if (!validMethods.includes(method.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid HTTP method' });
    }

    // Build dynamic input schema
    const inputSchema = {
      url,
      method: method.toUpperCase(),
      payload: body || undefined,
      headers: contentType ? { 'Content-Type': contentType } : undefined,
    };

    // Remove undefined fields
    Object.keys(inputSchema).forEach(key => inputSchema[key] === undefined && delete inputSchema[key]);

    // Make HTTP request directly instead of using an actor
    try {
      const axios = require('axios');
      const headers = {};
      
      if (contentType) {
        headers['Content-Type'] = contentType;
      }
      
      const config = {
        method: method.toUpperCase(),
        url,
        headers,
        timeout: 30000,
        data: body
      };
      
      console.log('Making HTTP request with config:', JSON.stringify(config, null, 2));
      
      const response = await axios(config);
      
      res.json({
        success: true,
        inputSchema,
        status: 'SUCCEEDED',
        results: [{
          url: url,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          method: method,
          timestamp: new Date().toISOString()
        }],
        stats: {
          runTimeSecs: 0,
          requestsTotal: 1,
          requestsSuccessful: 1
        }
      });
    } catch (httpError) {
      console.error('HTTP request failed:', httpError.message);
      res.status(400).json({
        error: 'HTTP request failed',
        inputSchema,
        status: 'FAILED',
        statusMessage: httpError.message,
        details: {
          code: httpError.code,
          response: httpError.response?.data
        }
      });
    }
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || 'Failed to run generic actor',
      details: error.details,
    });
  }
});

// Debug endpoint to see raw actor data
app.post('/api/debug/actor/:actorId', async (req, res) => {
  try {
    const { actorId } = req.params;
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const actorData = await makeApifyRequest(`/acts/${actorId}`, apiKey);
    
    res.json({ 
      rawData: actorData.data,
      inputSchema: actorData.data.inputSchema,
      exampleRunInput: actorData.data.exampleRunInput,
      defaultRunOptions: actorData.data.defaultRunOptions
    });
  } catch (error) {
    res.status(error.status || 500).json({ 
      error: error.message || 'Failed to fetch actor data' 
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Test endpoint for URL validation
app.post('/api/test-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Test if the URL is reachable
    const response = await axios.get(url, { timeout: 5000 });
    
    res.json({
      success: true,
      status: response.status,
      contentType: response.headers['content-type'],
      data: typeof response.data === 'object' ? response.data : response.data.substring(0, 200)
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      status: error.response?.status
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
