# NEO Starter - Domain Driven Design

### Motivation
>
You have a new project in your mind, and you're excited about it. You jump right into implementation, but soon realize it takes days if not weeks to only configure the basic things like project structure, linting, authentication, validation and so on. In addition, you want to use the best architectural practices making your codebase scalable from the start.

What if there was an easy boilerplate that uses the best practices from enterprise architecture while balancing the speed of development?

Meet Neo Starter DDD.

Neo Starter DDD is a boilerplate project that provides an easier and faster way to start a TypeScript project. It's a monorepo that focuses on a proper implementation of Clean Architecture and DDD, which is achieved by [truly] isolating Domain, Application and Infrastructure layers. It also comes with some out-of-the-box features (more on this below).

There are 2 distinct purposes for this boilerplate:
1) It provides a clear way to write a framework-free business logic in domain and application layers - thus making you able to reuse the code across frameworks and platforms.
2) Allows you to jumpstart a new project using Express.js and Next.js without spending weeks on the project configuration and some basic features.

### What is Clear Architecture (CA)?

CA is a set of design principles that helps developers build software that is easily scalable, maintainable and extensible.
[Learn more about Clean Architecture here.](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### What is Domain-Driven Design (DDD)?

DDD is an approach of building your software around the real-world business structure, which is planned to operate this software. The main goal is to tackle complexity by breaking our potentially huge spagetti code into smaller "apps" or "sub-apps".
The best starting point for DDD is to [watch this video](https://www.youtube.com/watch?v=pMuiVlnGqjk). 

<img src="./assets/clean-architecture.jpg" alt="Clean architecture diagram" width="600"/>

## Monorepo Structure

The monorepo is powered by [Turborepo](https://turbo.build/repo/docs) - an easy to get started tool to manage multiple NPM workspaces.

An example of the structure of the growing project:
```
apps                  # apps folder contains projects that can be compiled and deployed
|
+-- backend-express   # a minimal express server layer. Only contains framework-specific code.
|
+-- backend-cdk       # a minimal serverless codebase. Only contains framework-specific code.
|
+-- backend-nest      # a minimal nest.js backend. Only contains framework-specific code.
|
+-- dashboard-next    # a next.js frontend for users
|
+-- admin-angular      # an angular frontend for an admin interface (for example)


packages
|
+-- application       # a framework-agnostic application layer
|
+-- domain            # a framework-agnostic domain layer
|
+-- common-entities   # common backend and frontend entities like Erros and DTOs
|
+-- eslint-config     # global Eslint root configuration
|
+-- express-tools     # express.js-specific common libraries and implementations
|
+-- persistence       # injectable database layer. Can be multiple databases at once.
|
+-- security          # injectable security services like JWT and Encryption 
|
+-- typescript-config # global TypeScript root configuration

```

## Backend Express
An Express.js API server with all the pre-configured features & tools such as:
- DDD and Clean architecture
- Dependency injection
- ORM with PostgreSQL
- Seamless swagger and OpenAPI documentation
- User management
- JWT Authentication
- Zod Validation
- Logging
- Centralized error handling
- Request-logging
- Rate limitation
- Eslint + Prettier
- Integration tests with real Postgres database
- Standardized TypeScript config

You can easily switch the implementations by providing a different package to the DI container.

### Sample Backend Express Structure

```
src
|
+-- _server                       # framework-specific code like server configuration, middleware and so on.
|
+-- container.ts                  # a DI container for connecting implementations to interfaces
|
+-- (sample_feature)              # any API feature such as `users` that composes multiple co- files
    |                 
    +-- __tests__                 # co-local feature tests
    |                 
    +-- (feature).config.ts       # feature configuration
    |                 
    +-- (feature).controller.ts   # controller and routes related to a feature
    |                 
    +-- (feature).di.ts           # feature-scoped dependency injection container
    |                 
    +-- (feature).module.ts       # a module is an initialization code for the feature. It glues everything together.
    |                 
    +-- (feature).openapi.ts      # a generated OpenAPI and Swagger documentation for this feature

```

## Sample Frontend JS Next Features

A Next.js app with features:
- Next.js 15 with App Router & Server Components
- Authentication boilerplate with Registration & Login
- Tailwind - for CSS
- Shadcn - for component library
- React Query - for server API actions
- Zustand - for state management
- React Hook Form + Zod - for forms and validation

### Sample Frontend Next JS Structure

```
app
|

+-- _assets           # assets folder can contain all the static files such as images, fonts, etc.
|
+-- _components       # components for the top-level "root / home" feature
|
+-- _config           # global configurations, exported env variables etc.
|
+-- _hooks            # shared hooks used across all features
|
+-- _services         # reusable libraries and services
|
+-- _shared           # global components shared across all features
|
+-- _state            # global state stores
|
+-- _styles           # global styles
|
+-- (sample_feature)  # an example of feature that has its own co-located files. Example: `account`
|   |                 
|   +-- _api          # co-local api hooks and helpers
|   |                 
|   +-- _components   # co-local reusable components
|   |                 
|   +-- _config       # co-local configurations and constants
|   |                 
|   +-- _hooks        # co-local reusable hooks
|   |                 
|   +-- (sub_feature) # application provider that wraps the entire application with different global providers
|        |                 
|        +-- ...      # sub_feature co-local files similar to parent structure
|        +-- ...      
|        +-- ...      
```

## Packages

A collection of monorepo packages that can be reused between apps. Also `domain` and `application` packages are where the actual business logic of our app sits (refering to the Clean Architecture). 

- `@neo/domain`: our domain aggregates are implemented here. This project has little dependency on anything else, and thus it's reusable between different frameworks and paradigms. It has zero ideas about what's going on outside of it, and this layer is activated by directly importing it and using it in the outer application layer.
- `@neo/application`: this layer invokes our domain logic and orchestrates how the data reaches our domain layer and how it's returned to the client. It uses its interface to tell the outer frameworks layer (apps essentially) what it needs in terms of the functionality and data, and those are injected.

### Other packages or features
- `@neo/eslint-config`: base `eslint` configuration for all our projects. It uses strict type-linting rules to autoformat and standardize the code.
- `@neo/typescript-config`: `tsconfig.json`s used throughout the monorepo.
- `@neo/common-entities`: Commonly used entities such as errors and response DTOs.
- `@neo/express-tools`: Reusable libraries for express server setup such as swagger & health-check routers, validation and logging.
- `@neo/persistence`: An infrastructure layer for implementing one or multiple database adapters.
- `@neo/security`: A few security services such as JWT and encryption used in authentication.


## Usage

### Environment

Each application has a `.env.example` file to help you configure the env variables.

Make sure you have the following installed in your machine:
- Postgres database

Helpful VS code extensions (optional):
  - ESLint - for auto-formatting
  - Prisma - ORM syntax highlighting
  - Tailwind CSS IntelliSense - syntax autocompletion
  - Vitest - easier tests


### Prepare the ORM and database

1) enerate the Prisma client based on the latest schema:

```
cd packages/persistence && npx prisma generate
```

2) Apply the latest database migrations:

```
cd packages/persistence && npx prisma migrate dev
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

### Build & Start

To build all apps and packages and start, run the following commands in the root directory:

```
npm run build
npm run start
```

### Clean modules

```
npm run clean
```

## Credits

This project is kick started by [Ilyas Assainov](https://www.linkedin.com/in/ilyas-assainov/). Please create an issue or PR if you want to contribute.
Get in touch with him if you need help with your project.

A few helpful repos were used to build this starter:

- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
- [express-typescript-2024](https://github.com/edwinhern/express-typescript-2024) 