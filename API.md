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

### Invite Collaborator to Project
Invite a collaborator to a project.

  - URL: `/api/projects/invite/:id`  
  - Method: `PUT`
  - Request Headers:
  - Authorization: Bearer YOUR_JWT_TOKEN (Required for authentication)
  - URL Parameters: 
  - id (Path Parameter): The unique identifier of the project to which you want to invite a collaborator.
  ```json
  {
  "user_id": "collaborator-user-id",
  "role": "Collaborator"
  }
```
- Response:
   * 200 OK: Collaborator successfully invited to the project.
   * 400 Bad Request: Invalid input data.
   * 401 Unauthorized: User not authenticated.
   * 403 Forbidden: User is not the project owner.
   * 404 Not Found: Project not found.
   * 500 Internal Server Error: Server error.


### Archeive Project

- URL: `/api/projects/archieve/:id`
- Method: `PUT`
- Request Headers:
- Authorization: Bearer YOUR_JWT_TOKEN (Required for authentication)
- URL Parameters:
- id (Path Parameter): The unique identifier of the project to be archived.
```json
{
  "message": "Project successfully archived"
}

```

- Response:
  * 200 OK: Project successfully archived.
  * 401 Unauthorized: User not authenticated.
  * 403 Forbidden: User is not the project owner.
  * 404 Not Found: Project not found.
  * 500 Internal Server Error: Server error.



### Get All Projects
- URL: `/api/projects/all`
- Method: `GET`
- Request Headers:
- Authorization: Bearer YOUR_JWT_TOKEN (Required for authentication)
- URL Parameters:
- id (Path Parameter): The unique identifier of the project to which you want to invite a collaborator.
```json 
{
  "projects": [
    {
      "id": "123456",
      "name": "Project 1",
      "description": "This is the first project",
      "owner": "user123",
      "collaborators": [
        {
          "user_id": "user456",
          "role": "Collaborator"
        }
      ],
      "isArchieved": false,
      "createdAt": "2023-10-31T12:00:00Z",
      "updatedAt": "2023-10-31T14:30:00Z"
    },
    {
      "id": "789012",
      "name": "Project 2",
      "description": "This is the second project",
      "owner": "user789",
      "collaborators": [],
      "isArchieved": true,
      "createdAt": "2023-11-01T09:15:00Z",
      "updatedAt": "2023-11-01T09:45:00Z"
    }
  ]
}

```
- Response:
 * 200 OK: Successfully retrieved a list of projects.
 * 401 Unauthorized: User not authenticated.
* 500 Internal Server Error: Server error.