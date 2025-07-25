## 1. Installation

```bash
$ yarn install
```

## 2. Prisma

```bash
# Deploy migrate
$ yarn migrate:deploy

# Generate Prisma Service
$ yarn generate

# Init data
$ yarn seed
```

## 3. Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## 4. URL

```bash
# Swagger
$ http://localhost:8080/document

```

## (Option) create new migrate when change prisma.schema

```bash
# create new migration
$ yarn migrate:create
UPDATED:
$ npx prisma migrate dev --create-only
```

## (Option) reset migrate and redeploy prisma.schema

```bash
# redeploy migration
$ yarn migrate:reset
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Generate code CLI

```bash
# Generate a CRUD
$ nest g resource {resource_name} --no-spec

# Generate a module
$ nest g mo {resource_name} --no-spec

# Generate a controller
$ nest g co {controller_name} --no-spec

# Generate a service
$ nest g s {service_name} --no-spec
```
