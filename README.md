
# Apify Runner - Generic HTTP Request Actor

A modern web application that allows users to execute generic HTTP requests through a clean, intuitive interface. Built with React frontend and Node.js backend, this application provides a powerful tool for testing APIs and making HTTP requests with full method support (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS).

## 🚀 How to Install and Run Your Application

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- An Apify API key (get one from [Apify Console](https://console.apify.com/account#/integrations))

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The application will open automatically at `http://localhost:3000`

### Access the Application
1. Open your browser and go to `http://localhost:3000`
2. You'll see the "Connect to Apify" screen
3. Enter your Apify API key and click "Connect"

## 🎯 Which Actor You Chose for Testing

For this project, I implemented a **Generic HTTP Request Actor** that allows users to make any type of HTTP request without needing to create a specific Apify actor. This approach provides maximum flexibility and demonstrates the core functionality.

### Actor Features:
- **Full HTTP Method Support**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Dynamic Input Schema**: Automatically adapts based on the selected HTTP method
- **Real-time Execution**: Immediate feedback with detailed response information
- **Error Handling**: Comprehensive error reporting and validation

### Testing Endpoints Used:
- **JSONPlaceholder API**: `https://jsonplaceholder.typicode.com/posts` for testing various HTTP methods
- **HTTPBin**: `https://httpbin.org/post` for general HTTP testing

## 🎨 Any Assumptions or Notable Design Choices You Made

### Architecture Decisions
1. **Backend Proxy Pattern**: The backend acts as a proxy to Apify's API, keeping the API key secure and not exposed to the frontend
2. **Generic HTTP Request Implementation**: Instead of using a specific Apify actor, I created a generic HTTP request handler that can make any type of HTTP request
3. **Real-time Execution**: The application makes HTTP requests directly rather than using Apify's actor system for immediate results

### UI/UX Design Choices
1. **Modern Card-based Layout**: Clean, modern interface with cards and proper spacing
2. **Progressive Disclosure**: Information is shown step-by-step to avoid overwhelming users
3. **Visual Feedback**: Loading states, success indicators, and error messages with appropriate icons
4. **Responsive Design**: Works well on both desktop and mobile devices

### Technical Implementation Choices
1. **React Hooks**: Used functional components with hooks for state management
2. **Express.js Backend**: Simple, lightweight server for API proxy functionality
3. **Axios for HTTP Requests**: Reliable HTTP client for making requests
4. **CORS Support**: Enabled cross-origin requests for development
5. **Error Handling**: Comprehensive error handling at both frontend and backend levels

### Security Considerations
1. **API Key Protection**: API keys are never exposed to the frontend
2. **Input Validation**: All user inputs are validated before processing
3. **HTTPS Enforcement**: Production-ready with HTTPS support

## 📸 Screenshots Demonstrating the Working Flow

### 1. Initial Connection Screen
![Connect to Apify](Assets/Screenshot%20(4374).png)
*The application starts with a clean connection screen where users enter their Apify API key. The interface features a modern design with a purple gradient header and intuitive form elements.*

### 2. Actor Selection Interface
![Actor Selection](Assets/Screenshot%20(4375).png)
*After connecting, users can see available actors. The interface shows "Pratham's Api Fetcher" as an available actor with a clean card-based layout.*

### 3. Generic HTTP Request Actor Interface
![HTTP Request Interface](Assets/Screenshot%20(4376).png)
*The main interface for the Generic HTTP Request Actor, featuring:*
- *URL input field pre-filled with a test endpoint*
- *HTTP Method dropdown with full method support (GET, POST, PUT, DELETE, etc.)*
- *Request body textarea for JSON or text data*
- *Content-Type specification*
- *Clear action buttons for execution*

### 4. GET Request Execution
![GET Request Success](Assets/Screenshot%20(4377).png)
*Successful execution of a GET request showing:*
- *Input Schema: URL, method (GET), and headers*
- *Execution Result: 200 OK status with detailed response headers*
- *Real-time response data from the API*

### 5. POST Request Configuration
![POST Request Setup](Assets/Screenshot%20(4378).png)
*Configuring a POST request with:*
- *URL: `https://jsonplaceholder.typicode.com/posts`*
- *Method: POST selected from dropdown*
- *Body: JSON payload `{"title": "test", "body": "test"}`*
- *Content-Type: `application/json`*

### 6. POST Request Success
![POST Request Success](Assets/Screenshot%20(4379).png)
*Successful POST request execution showing:*
- *Input Schema with POST method and payload*
- *Execution Result: 201 Created status*
- *Location header pointing to the newly created resource*

### 7. PUT Request Configuration
![PUT Request Setup](Assets/Screenshot%20(4380).png)
*Configuring a PUT request to update an existing resource:*
- *URL: `https://jsonplaceholder.typicode.com/posts/1`*
- *Method: PUT selected*
- *Body: Update payload `{"title": "updated", "body": "updated"}`*

### 8. PUT Request Success
![PUT Request Success](Assets/Screenshot%20(4381).png)
*Successful PUT request showing:*
- *Input Schema with PUT method and update payload*
- *Execution Result: 200 OK status confirming successful update*

### 9. DELETE Request Configuration
![DELETE Request Setup](Assets/Screenshot%20(4382).png)
*Configuring a DELETE request:*
- *URL: `https://jsonplaceholder.typicode.com/posts/1`*
- *Method: DELETE selected*
- *Body: Empty object `{}` (typical for DELETE requests)*

### 10. DELETE Request Success
![DELETE Request Success](Assets/Screenshot%20(4383).png)
*Successful DELETE request execution:*
- *Input Schema showing DELETE method*
- *Execution Result with empty response body (expected for DELETE)*
- *Confirmation that the DELETE method was properly processed*

## 🔧 Key Features

- **Full HTTP Method Support**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Real-time Execution**: Immediate results without waiting for Apify actor processing
- **Dynamic Input Validation**: Automatic validation based on HTTP method
- **Comprehensive Error Handling**: Detailed error messages and debugging information
- **Modern UI/UX**: Clean, responsive design with proper loading states
- **Security First**: API keys protected through backend proxy
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🛠️ Technology Stack

- **Frontend**: React.js, CSS3, HTML5
- **Backend**: Node.js, Express.js
- **HTTP Client**: Axios
- **Development**: Create React App, npm scripts
- **API Integration**: Apify REST API

## 📝 API Endpoints

- `POST /api/verify-key` - Verify Apify API key
- `POST /api/actors` - Get user's actors
- `POST /api/run-generic-actor` - Execute generic HTTP request
- `GET /api/health` - Server health check
- `POST /api/test-url` - Test URL reachability

## 🚀 Future Enhancements

- Support for custom headers
- Request/response history
- Export results to various formats
- Batch request processing
- Authentication token management
- Request templates and presets

---

**Built with ❤️ for Apify Integration Development**

