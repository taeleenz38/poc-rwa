# README


## Development Environment Setup

 1. Install Docker Desktop
 2. Run ``` docker compose build --no-cache```
 3. Then run: ``` docker compose up ```

 This will run the all components including the database, frontend and the backend.

 ### Application Ports information
 
 - Database: `5432`
 - Frontend: `3000`
 - Backend: `3001`

 ### Backend Development

#### Required Components
 - Database
 - Backend source code `./backend`

The database which was created from the docker compose can be used.

- To run the backend inside the VS Code (or an IDE), please shutdown the backend and frontend containers in the docker desktop
- Run command in the backend folder to start the dev server: 
    - ```npm run start:dev```

### Frontend Development 
There are two ways that you can run local frontend.
 1. Frontend connecting to Local backend
 2. Frontend connecting to GCP dev environment (This is not implemented as of 20th August 2024)

Please change the `.env.dev` as appropriate.

___________________________________
-----------------------------------

# Production Deployment

## Backend

Dockerfile should use to spin-up the environment in GCP. ` ./backend/Dockerfile `

`./backend/config/.env` will be used for production deployment ocnfigurations.

## Frontend

Dockerfile should use to spin-up the environment in GCP. ` ./frontend/Dockerfile `

Build argument should be passed during the docker build: `APPENV=prod` 

Example:
```bash
docker build -t frontend --build-arg APPENV=prod --no-cache --progress plain . 
```




