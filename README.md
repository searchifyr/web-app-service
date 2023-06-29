# Web-app for Searchifyr

# How to start local developer environment

## Setup Docker

### ***Deployment of services in containers***

Requirements:
- AMD64 system
- docker-engine
- docker-compose installed.

If you also want to start the frontend (or mongodb and elasticsearch) you have to use the [deployment]() repository. If you changed your directory to the one of the `deployment` repository, you can start all services (backend - latest image; frontend - latest image, mongodb and elasticsearch) by typing:

```
$ docker-compose up -d
```

To only start a specific service, f.e. you want so start the frontend in a container to test things you added locally to the backend (for this example the command would be `docker-compose up web-app-service -d`), type:

```
$ docker-compose up [service-name] -d
```
Because the frontend and backend need mongodb and elasticsearch to start, its also been started and you dont have to specifically start both of them. 

You can check if the containers are running by typing:
```
$ docker-compose ps
```

To see the console/log output of all containers type:
```
$ docker-compose logs -f
```
Or to see the console/log output for only one specific container type:
```
$ docker-compose logs [service-name] -f
```

You can access a running container by typing:
```
$ docker-compose exec [service-name] sh
```

You can stop and remove all containers at once by typing:
```
$ docker-compose down
```

When everything is running, you can check the web app by calling `localhost:8080`.

To check the `openapi specification` of the project you need to call `localhost:7080/api/v1/doc`

### Requirment to start developer-mode is [Node.js](https://nodejs.org/en/download/)

## Install all dependencies

```
npm i
```

## Start local environment

```
npm run serve
```

## Open live-project via Browser

```
http://localhost:8080/
```

# Create Docker Image 
```
docker build <path> -t <imageName>
```

# User-Instructions:

In order to get past the login-screen, an active github.com account is needed.

### Administrator-Access:

To view all features you need to log in with a predetermined admin account. You can define the admin github id in the [search-profile-service repo](https://github.com/searchifyr/search-profile-service)
Only the admin can activate other user-accounts using the "Admin Settings" tab.

### User-Access:
A user-account needs to be manually activated by an administrator. After that a user has access to all features minus the admin-settings.

### Creator-Access:
The creator of an application has to manually give other users access to set application. This is done in the application-settings-screen using the creator account. In addition to that, only a creator is able to generate API-Keys for the application.
