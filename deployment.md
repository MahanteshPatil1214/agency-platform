# Deployment Guide

This guide explains how to deploy the NAVAM application using Docker Compose.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Git](https://git-scm.com/) installed.

## Steps

1.  **Clone the Repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd NAVAM
    ```

2.  **Environment Configuration**:
    Create a `.env` file in the root directory (`e:\NAVAM\.env`) with the following secrets:
    ```env
    GEMINI_API_KEY=your_actual_gemini_api_key
    JWT_SECRET=your_secure_jwt_secret_key
    ```
    *Note: Replace the values with your actual keys.*

3.  **Build and Run**:
    Run the following command to build the images and start the services:
    ```bash
    docker-compose up --build -d
    ```

4.  **Access the Application**:
    - **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser.
    - **Backend API**: Accessible at [http://localhost:8080](http://localhost:8080).
    - **MongoDB**: Running on port `27017`.

5.  **Stopping the Application**:
    To stop the services, run:
    ```bash
    docker-compose down
    ```

## Troubleshooting

- **Port Conflicts**: If ports 3000, 8080, or 27017 are already in use, modify the `ports` mapping in `docker-compose.yml`.
- **Database Connection**: Ensure the `backend` service waits for `mongo` to be ready. Docker Compose `depends_on` starts the container, but doesn't wait for the application inside to be ready. If the backend fails to connect initially, it might restart automatically (depending on restart policy, which we haven't set, but you can add `restart: always`).

## Production Notes

- **Security**: Change the `JWT_SECRET` to a strong, random string.
- **HTTPS**: For production, configure Nginx with SSL certificates (e.g., using Let's Encrypt).
- **Database Persistence**: The `mongo-data` volume ensures data persists across restarts. Back up this volume regularly.
