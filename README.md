# hmpps-match-learner-record-ui

[![Ministry of Justice Repository Compliance Badge](https://github-community.service.justice.gov.uk/repository-standards/api/hmpps-match-learner-record-ui/badge)](https://github-community.service.justice.gov.uk/repository-standards/hmpps-match-learner-record-ui)
[![Docker Repository on ghcr](https://img.shields.io/badge/ghcr.io-repository-2496ED.svg?logo=docker)](https://ghcr.io/ministryofjustice/hmpps-match-learner-record-ui)
[![Pipeline [test -> build -> deploy]](https://github.com/ministryofjustice/hmpps-match-learner-record-ui/actions/workflows/pipeline.yml/badge.svg?branch=main)](https://github.com/ministryofjustice/hmpps-match-learner-record-ui/actions/workflows/pipeline.yml)

UI application for matching the NOMIS identifier of a prisoner to a Unique Learner Number from DFE's Learning Records Service (LRS).

This project is based on the HMPPS Typescript project template

## Running the app
### For development

To start the main services excluding the example typescript template app:

`docker compose up --scale=app=0`

Create an environment file called `.env` based on `.env.example` in the repository root. Make sure to define any api urls variables that you wish to change from the defaults specified in `config.ts`.
Environment variables set in here will be available when running `start:dev`
```
REDIS_ENABLED=
TOKEN_VERIFICATION_ENABLED=
AUTH_CODE_CLIENT_ID=
AUTH_CODE_CLIENT_SECRET=
CLIENT_CREDS_CLIENT_ID=
CLIENT_CREDS_CLIENT_SECRET=
COMPONENT_API_URL=
HMPPS_AUTH_URL=
LEARNER_RECORDS_API_URL=
```
Install dependencies using `npm install`, ensuring you are using `node v20`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder
to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json`
and the github pipeline build config.

And then, to build the assets and start the app with esbuild:

`npm run start:dev`

### Via docker-compose

The easiest way to run the app is to use docker compose to create the service and all dependencies.

`docker compose pull`

`docker compose up`

### Dependencies

* `hmpps-auth` - Standard HMPPS Digital configuration; used for authentication and retrieves the user profile. Uses the user token.
* `prison-api` – Used to pull image data for a prisoner. `PRISON_API_URL` environment variable sets the url.
* `prisoner-search` - Used to return a list of prisoners which relate to the search term provided on the 'Find a prisoner' page. `PRISONER_SEARCH_API_URL` env variable sets the url.
* `hmpps-learner-records-api` - Used to interact with DFE's Learner Records Service (LRS). `LEARNER_RECORDS_API_URL` environment variable sets the url.
* `hmpps-audit` - HMPPS Audit Service; used to send user action events to HMPPS Audit via the AWS SQS queue specified by the environment variable `AUDIT_SQS_QUEUE_URL`
* `frontend-componenents` - Standard HMPPS Digital configuration; used to retrieve the html and css for the DPS header and footer. Uses the system token.

## Oauth2 Credentials

The project is set up to run with two sets of credentials, each one supports a different oauth2 flow.

### Auth Code flow

These are used to allow authenticated users to access the application. After the user is redirected from auth back to
the application, the app will use the returned auth code to request a JWT token for that user containing the
user's roles. The JWT token will be verified and then stored in the user's session.

These credentials are configured using the following env variables:

- AUTH_CODE_CLIENT_ID
- AUTH_CODE_CLIENT_SECRET

### Client Credentials flow

These are used by the application to request tokens to make calls to APIs. These are system accounts that will have
their own sets of roles.

Most API calls that occur as part of the request/response cycle will be on behalf of a user.
To make a call on behalf of a user, a username should be passed when requesting a system token. The username will then
become part of the JWT and can be used downstream for auditing purposes.

These tokens are cached until expiration.

These credentials are configured using the following env variables:

- CLIENT_CREDS_CLIENT_ID
- CLIENT_CREDS_CLIENT_SECRET

The system client requires the roles:
- `ROLE_LEARNER_RECORDS__LEARNER_RECORDS_MATCH_UI` - to be able to call the [hmpps-learner-records-api](https://github.com/ministryofjustice/hmpps-learner-records-api) endpoints
- `ROLE_PRISONER_SEARCH` - to be able to call the Prisoner Search API
- `VIEW_PRISONER_DATA` - to be able to call the Prisoner Search API

### HMPPS Auth

To allow authenticated users to access your application you need to point it to a running instance of `hmpps-auth`.
By default the application is configured to run against an instance running in docker that can be started
via `docker-compose`.

**NB:** It's common for developers to run against the instance of auth running in the development/T3 environment for
local development. Most APIs don't have images with cached data that you can run with docker: setting up realistic stubbed data in sync
across a variety of services is very difficult.

### User Roles

Once the UI is running users will need to authenticate with `hmpps-auth` using a valid DPS username. The DPS user needs to have the following role to be able to access the service:
- `ROLE_MATCH_LEARNER_RECORD_RW`

### REDIS

When deployed to an environment with multiple pods we run applications with an instance of REDIS/Elasticache to provide
a distributed cache of sessions.
The template app is, by default, configured not to use REDIS when running locally.

## HMPPS Audit


## Linter

* `npm run lint` runs `eslint`.
* `npm run typecheck` runs the TypeScript compiler `tsc`.

## Test
### Run unit tests

`npm run test`

### Run integration tests

For local running, start a wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with auto-restart on changes)

And then either, run tests in headless mode with:

`npm run int-test`

Or run tests with the cypress UI:

`npm run int-test-ui`

## Change log

A changelog for the service is available [here](./CHANGELOG.md)
