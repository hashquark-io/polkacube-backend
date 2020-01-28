# Polkacube server

## Development

### Prerequisites
> Polkacube projects include job, backend and frontend. This project requires to start [polkacube job project] [https://github.com/hashquark-io/polkacube-job.git](https://github.com/hashquark-io/polkacube-job.git)
> Modify config/config.default.js for configuration, such as ksm ws, mysql host/port/user/password, cors origin and so on.
> Node version 10+ is required.

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

> Use the right configure in `config` dir.

```bash
docker build -t polkacube_backend .
docker run -d -p 7001:7001 polkacube_backend npm run start
```

## List of dependencies
> JS library: polkadot/api and egg library 
> Web application: egg framework. [egg]: [https://eggjs.org](https://eggjs.org)

## List included in each folder of backend
> app.js and agent.js used to customize the initialization works at startup.
> app/router.js used to configure URL routing rules.
> app/controller/** used to parse the input from user, return the corresponding results after processing.
> app/service/** used for business logic layer.
> app/middleware/** used for middleware and customized error handling.
> app/extend/** used for extensions of the framework.
> config/config.default.js used to write configuration files.
config/plugin.js used to configure the plugins that need to be loaded.
> test/** used for unit test.


