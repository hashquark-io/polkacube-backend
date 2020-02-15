# Polkacube server

## Development

### Prerequisites

Polkacube projects include job, backend and frontend. This project requires to start [polkacube job project] [https://github.com/hashquark-io/polkacube-job.git](https://github.com/hashquark-io/polkacube-job.git)
Modify .env configuration, such as substrate server, mysql host/port/user/password and so on.  
Node version 10+ is required.

### Setup

```bash
npm install
```

### Build and hot-reloads for development

```bash
npm run dev
```

### Build and start for production

```bash
npm run start
# open http://localhost:7001/
```

### Stop

```bash
npm run stop
```

## Testing

### Unit test

```bash
npm test "test/app/service/*.js"
```

### API test

```bash
npm test "test/app/controller/*.js"
```

## Docker image

### Build A Image and Run

> Modify .env configuration

```bash
docker build -t polkacube_backend .
docker run -d -p 7001:7001 polkacube_backend
```

### Using Image From Docker Hub

```bash
# Write .env file on your host
# ==========================
## DataBase config
## The '127.0.0.1' direct to container host, you must change it when you run in docker.
MYSQL_HOST=10.10.10.10
MYSQL_PORT=3306
MYSQL_DATABASE=polkacube
MYSQL_USERNAME=develop
MYSQL_PASSWORD=123456

## Substrate Node Config
## The '127.0.0.1' direct to container host, you must change it when you run in docker.
SUBSTRATE_WS_HOST=10.10.10.10
SUBSTRATE_WS_PORT=9944
# ==========================

docker run -d -p 7001:7001 -v [HOST_PATH]/.env:/src/.env hashquarkio/polkacube_backend
```

## List of dependencies

JS library: polkadot/api and egg library  
Web application: egg framework. [egg]: [https://eggjs.org](https://eggjs.org)

## List included in each folder of backend

app.js and agent.js used to customize the initialization works at startup.  
app/router.js used to configure URL routing rules.  
app/controller/** used to parse the input from user, return the corresponding results after processing.  
app/service/** used for business logic layer.  
app/middleware/** used for middleware and customized error handling.  
app/extend/** used for extensions of the framework.  
config/config.default.js used to write configuration files.  
config/plugin.js used to configure the plugins that need to be loaded.  
test/** used for unit test.  

## License

[Apache-2.0](LICENSE)

