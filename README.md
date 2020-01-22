# Polkacube server

> This project is based on egg framework. [egg]: [https://eggjs.org](https://eggjs.org)
> Polkacube projects include job, backend and frontend. This project require to start polkacube job project first, and modify config/config.default.js, such as ksm ws, mysql host/port/user/password, cors origin and so on.

## setup

```bash
npm install
```

### build and hot-reloads for development

```bash
npm run dev
```

### build and start for production

```bash
npm run start
# open http://localhost:7001/
```

### stop

```bash
npm run stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

## The Docker Way

> Use the right configure in `config` dir.

```bash
docker build -t polkacube_backend .
docker run -d -p 7001:7001 polkacube_backend npm run start
```
