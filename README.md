# NAVAM - Corporate Service & Agency Platform

NAVAM is a comprehensive full-stack application designed to manage service requests and agency projects. It features a robust corporate messaging system and an AI-powered assistant for project analysis.

## 🚀 Key Features

### 1. 🤖 AI Assistant (Powered by Google Gemini)
- **Project Health Check**: Analyze project descriptions and status to generate comprehensive health reports.
- **Smart Insights**: Automatically categorizes analysis into **Status**, **Risks**, and **Next Steps**.
- **Visual Dashboard**: Premium UI with glassmorphic cards for easy readability.
- **Client Access**: Secure access for clients to analyze their own projects.

### 2. 📨 Corporate Messaging System
- **Professional Communication**: Email-style messaging with Subject lines and Priority levels (Low, Normal, High).
- **Threaded Inbox**: Organized conversation view for efficient management.
- **Role-Based**: Seamless communication between Admins and Clients.

### 3. 📊 Project & Request Management
- **Service Requests**: Clients can submit detailed requests for new projects.
- **Project Tracking**: Admins can manage projects, assign tasks, and track progress.
- **Client Dashboard**: Clients have a dedicated view for their projects, requests, and messages.

### 4. 🔐 Security & Roles
- **JWT Authentication**: Secure login and session management.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `ROLE_ADMIN` and `ROLE_CLIENT`.
- **Secure Backend**: Spring Security integration for API protection.

### 5. 🔌 Model Context Protocol (MCP) Integration
NAVAM implements the **Model Context Protocol (MCP)** to standardize AI interactions. This allows the AI Assistant to securely access and manipulate application data through defined tools.
- **`list_projects` Tool**: Fetches project data based on the user's role (Admin sees all, Client sees theirs).
- **`analyze_project` Tool**: Feeds project details to the Gemini AI for real-time health analysis.
- **Extensible Architecture**: The MCP implementation (`MCPController`) is designed to easily support more tools in the future.

## 🛠️ Tech Stack

### Frontend
- **React.js**: Component-based UI architecture.
- **Tailwind CSS**: Utility-first styling for a modern, responsive design.
- **Vite**: Fast build tool and development server.
- **Lucide React**: Beautiful, consistent icons.
- **Axios**: HTTP client for API communication.

### Backend
- **Java Spring Boot**: Robust, scalable backend framework.
- **Spring Security**: Authentication and authorization.
- **MongoDB**: NoSQL database for flexible data storage.
- **Google Gemini API**: Generative AI for project analysis and task generation.
- **Maven**: Dependency management.

## ⚙️ Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB (Running locally or Atlas URI)
- Google Gemini API Key

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Configure `src/main/resources/application.properties`:
    ```properties
    spring.data.mongodb.uri=mongodb://localhost:27017/navam_db
    gemini.api.key=YOUR_GEMINI_API_KEY
    navam.app.jwtSecret=YOUR_SECURE_JWT_SECRET
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

### 2. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure `.env`:
    ```env
    VITE_API_URL=http://localhost:8080/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## 📖 Usage

### Admin
- Log in to access the Admin Dashboard.
- Manage Service Requests, Create Projects, and use the AI Assistant to analyze all projects.
- Communicate with clients via the Messages tab.

### Client
- Log in to view "My Projects" and "My Requests".
- Submit new service requests.
- Use the AI Assistant to analyze your specific projects.
- Send messages to the administration team.

## 🤝 Contributing
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
