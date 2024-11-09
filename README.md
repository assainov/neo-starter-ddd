# Neo starter

A monorepo starter for efficient TypeScript development.

## Apps and Packages

- `frontend`: a [Next.js](https://nextjs.org/) app
- `backend`: an [Express.js](https://expressjs.com/) server
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo


## Usage

### Build

To build all apps and packages, run the following command in the root directory:

```
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
npm run dev
```

### Test

To test all apps and packages:

```
npm run test
```

### Lint

To check for linting issues all apps and packages:

```
npm run lint
```
