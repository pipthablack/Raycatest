# Project Management Microservice API

This document provides information on the API endpoints and how to interact with the Project Management Microservice.

## User Endpoints
### User Registration
Register a new user.

- URL: `/api/auth/signup`
- Method: `POST`
- Request Body:

```json
{
  "username": "your-username",
  "email": "your-email@example.com",
  "password": "your-password"
}
```
- Response:
    * 200 OK: User registration successful.
    * 400 Bad Request: Invalid input data.
    * 500 Internal Server Error: Server error.

### User Login
Log in an existing user.

- URL: `/api/auth/login`
- Method: `POST`
- Request Body:

```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```
- Response:
    * 200 OK: User login successful.
    * 401 Unauthorized: Invalid login credentials.
    * 500 Internal Server Error: Server error.

## Project Endpoints
### Create Project
Create a new project.

- URL: `/api/projects/create`
- Method: `POST`
- Request Body:
```json
{
  "name": "Project Name",
  "description": "Project Description"
}
```
- Response:
    * 201 Created: Project created successfully.
    * 400 Bad Request: Invalid input data.
    * 401 Unauthorized: User not authenticated.
    * 403 Forbidden: User does not have permission.
    * 500 Internal Server Error: Server error.

### Update Project
Update an existing project.

- URL: `/api/projects/update/:id`
- Method: `PUT`
- Request Body:
```json
{
  "name": "New Project Name",
  "description": "New Project Description"
}
```
- Response:
    * 200 OK: Project updated successfully.
    * 400 Bad Request: Invalid input data.
    * 401 Unauthorized: User not authenticated.
    * 403 Forbidden: User does not have permission.
    * 404 Not Found: Project not found.
    * 500 Internal Server Error: Server error.