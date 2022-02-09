# Architecture
![Architecture Image](https://github.com/drageelr/sproj/blob/main/resources/architecture.png)

## NGINX - Web Server
The NGINX (Web Server) has 2 purposes:
- Serve static interface files.
- Act as a proxy server to the API Server.

## API Server
The API Server allows the Client to:
- Submit new Recon Requests.
- View data pertaining to submitted Recon Requests.

It also interacts with Dispatcher to:
- Notify of about new Recon Request.

## Dispatcher
The Dispatcher is the main business logic entity of the system. It is responsible for:
- Dispatching jobs to different Tool Controllers.
- Keeping track of on-going jobs and requests.

## Tool Controller
The Tool Controller is the entity that is connected with the Dispatcher. It is responsible for:
- Executing Tool Scripts.
- Handles the output of the Tool Scripts.

## Tool Script
The Tool Script is an executueable script. It can be either a selenium script, an api caller script or a an entry point for a complete tool.

## Docker Environment
The Docker Enviroment contains the Tool Controller and Tool Script couples. Those tools that have same dependancies are hosted in the same Docker Environment. Other tools are hosted in different Docker Environments.