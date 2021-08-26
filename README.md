![screen shot 2017-06-08 at 9 25 50 am](https://user-images.githubusercontent.com/545342/26916938-86333e38-4c2c-11e7-952c-012bd65700a5.png)

# Resource Watch 🌍👓

[![Test Coverage](https://api.codeclimate.com/v1/badges/a4b807bda6ce10d8e5f9/test_coverage)](https://codeclimate.com/github/resource-watch/resource-watch/test_coverage)

Resource Watch features hundreds of data sets all in one place on the state of the planet’s resources and citizens. Users can visualize challenges facing people and the planet, from climate change to poverty, water risk to state instability, air pollution to human migration, and more.

# Requirements

Native execution requires the following:

- [Nodejs v14](https://nodejs.org/en/) 
- [yarn](https://yarnpkg.com/)
- [RW API](https://api.resourcewatch.org/)
- [Redis](https://redis.io/) (optional)

There are included [Dockerfile](https://docs.docker.com/engine/reference/builder/) and [docker compose](https://docs.docker.com/compose/) configuration files that may make it easier to run the application locally. See the [Docker installation instructions](#installation-docker-) for further details.

# Installation

Be sure you are using the correct Nodejs version. We recommend using [NVM](https://github.com/nvm-sh/nvm) to handle different Node versions.

Begin by installing the necessary nodejs packages, using `yarn`:

```bash
yarn
```

You also need to specify the necessary [environment variables](#environment-variables) - check the corresponding section for more details.

To start the application in development mode, use the built-in development web server:

```bash
yarn dev # runs the development server
```

The application will be served in [http://localhost:3000/](http://localhost:3000/).

## Production build

Running the application in a production environment is a two-step process:
- Preprocessing the existing code and generating pre-renders of each page
- Launch a web server to serve said pages

This can be achieved using the following commands:

```bash
yarn build
yarn start
```

## Environment variables

Before running the project for first time, be it for development, testing or production, you need to specify the correct values for key [environment variables](https://en.wikipedia.org/wiki/Environment_variable) (env vars) used by the project.

Before deep-diving into the env var list, here are a few key concepts that you should keep in mind at all times when manipulating env vars:
- Most of the env var logic is based on [Next.js env var logic](https://nextjs.org/docs/basic-features/environment-variables) which we strongly recommend you read.
- Most of these values aim at configuring the behavior of the application itself, but they may also be used during testing to cross-check the logic (for example, NEXT_PUBLIC_WRI_API_URL is used in the tests to validate that the application makes the requests to the correct address).


| Variable name |        Description |   Default value | Caveats   |
| ------------- | ------------------ | --------------: | --------: |
| NODE_ENV      | Describes the low level environment type in which the application is executing. Must be `development`, `test` or `production` |  | Using `development` will start the application in a mode that always builds pages on-the-fly, skipping any pre-compiled resources. These pages will always reflect your latest code changes, but may take more time to render. | 
| TEST_ENV      | Used when running the application for testing purposes. Must be `FRONTEND` when doing frontend testing (with Cypress) or `BACKEND` (when testing the built-in API) |  |  | 
| PORT          | HTTP port used when starting the built-in web server. | 3000 | In some parts of the application's CI/CD pipeline this value is expected to be 3000. | 
| REDIS_URL     | URL of the Redis server used to store user sessions | | This variable is optional, and if omitted, user sessions will be stored in memory instead. It's highly recommended that you use a Redis server for session storage in production environments. |
| SECRET        | Secret key used for signing and verifying the integrity of cookies.  | | If you change this key, all old signed cookies will become invalid! Make sure the secrets in this file are kept private |
| RW_USERNAME + RW_PASSWORD | Username and password values for a basic auth access wall to the whole site. If missing, the auth wall is disabled | | This auth mechanism is meant for scenarios where you want to have the whole site available only to users with a shared username and password - a staging/demo environment, for example. It is NOT related to used-based functionality of the site (MyRW, for example). |
| LOGGER_LEVEL | Logging level used with the [Pino](https://github.com/pinojs/pino) logging library. | info |  |
| NEXT_PUBLIC_RW_ENV | Used to set some scripts/functionalities in the app (like Google Analytics, CrazyEgg, Hotjar, ...). Must be `development`,`production` or `test` |  |
| NEXT_PUBLIC_AUTH_CALLBACK | Sets the callback URL triggered when a user attempts to log in with third party services. | `http://localhost:$PORT/auth-callback` |
| NEXT_PUBLIC_APPLICATIONS | Sets the context of the data. You can find more info about it in the [WRI API documentation](https://resource-watch.github.io/doc-api/concepts.html#applications). |  |
| NEXT_PUBLIC_API_ENV | Environment the resource belongs to in the WRI API.You can find more info about it in the [WRI API documentation](https://resource-watch.github.io/doc-api/concepts.html#environments). |  |
| NEXT_PUBLIC_WRI_API_URL | URL of the WRI API |  | In most cases you'll want to use https://api.resourcewatch.org for this value. When testing, be sure to mock all your HTTP requests, and avoid relying on actual calls to external services (like this one). |
| NEXT_PUBLIC_RW_GOGGLE_API_TOKEN_SHORTENER | API Key used for google maps library |  |  |
| NEXT_PUBLIC_GOOGLE_ANALYTICS | Google Analytics tracker ID |  |  |
| NEXT_PUBLIC_ADD_SEARCH_KEY | Used to allow global search function in the site with [AddSearch](https://www.addsearch.com/) |  |  |
| NEXT_PUBLIC_BLOG_API_URL | Used to fetch posts coming from the Resource Watch blog (Wordpress) |  | In most cases you'll want to use https://blog.resourcewatch.org/wp-json/wp/v2 for this value. When testing, be sure to mock all your HTTP requests, and avoid relying on actual calls to external services (like this one). |
| NEXT_PUBLIC_BING_MAPS_API_KEY | API KEY used by Cesium. You can find more info in [its documentation](https://cesium.com/docs/cesiumjs-ref-doc/BingMapsApi.html#.defaultKey). |  |  |
| NEXT_PUBLIC_RW_MAPBOX_API_TOKEN | Mapbox token used to render and handle Mapbox instances. You can find more info in the [Mapbox documentation](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/). |  |  |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_V4_ID | Measurement ID used by Google Analytics v4. You can find more info in [Google Analytics v4 documentation](https://support.google.com/analytics/answer/9744165?hl=en&utm_id=ad#cms). This variable doesn't replace `NEXT_PUBLIC_GOOGLE_ANALYTICS` environmental variable. | | |
| NEXT_PUBLIC_FEATURE_FLAG_OCEAN_WATCH | Feature flag to enable Ocean Watch pages | `undefined`| By default, these pages will not appear so make sure you initialize the environmental variable if you are going to work on them. Set to `true` to enable it. |
| NEXT_PUBLIC_FEATURE_FLAG_GEDC_DASHBOARD | Feature flag to enable GEDC dashboard | `undefined`| By default, this dashboard will not appear so make sure you initialize the environmental variable if you are going to work on it. Set to `true` to enable it. |
| NEXTAUTH_URL | Canonical URL of the site used by [NextAuth](https://next-auth.js.org/) to handle authentication and sessions. | `http://localhost:$PORT` | |
| NEXTAUTH_JWT_SECRET | A secret to use when signing JWT tokens | | |

If you want to customize these variables for your local environment, the recommended way is creating a `.env.local` file.

## Troubleshooting 🤔
You might run into some problems installing dependencies:

### Cairo / Canvas
If the installation fails at the point where it installs `canvas`, you may want to take a look at [this](https://github.com/Automattic/node-canvas#compiling).


# Installation (Docker) 🐳

Note that if you would like to develop using both Docker and native execution, you should follow the native [installation](#installation) instructions first. If you use Docker first and subsequently want to use native execution, you may need to delete or `chown` the `node_modules` folder in order for local installation to succeed. Docker should otherwise largely ignore the contents of the `node_modules` folder, but if you delete it while the container is running, you may need to stop and restart the container.

Assuming you have Docker already installed, the following steps should result in the application running locally on port 3000:

1. Copy the appropriate `.env` file: `cp .env.development .env`
2. Build the container: `docker-compose -f docker-compose-develop.yml build`
3. Launch the application: `docker-compose -f docker-compose-develop.yml up`


# Architecture 📂
The application is built on top of [**Next.js**](https://github.com/zeit/next.js/) - _a framework for server-rendered React apps_. _Next_ provides a zero-setup [webpack](https://webpack.js.org/) build ready to develop along a [express](https://expressjs.com/) server to run the application and [SASS](https://sass-lang.com/) styles compilation.

## Folder structure

Resource Watch application is split into the next main folders:
- pages
- layout
- components
- modules
- redactions (legacy)
- selectors (legacy)
- css
- hooks
- constants
- services
- utils
- public

### **./pages**
Apart from the custom pages, there are several pages defined by _Next_ will see below:

#### _app
The page of pages. All ready will inherit from this one, so keep in mind this. Resource Watch's pages are connect to redux thanks to this file. It also sets some states and fetches used in the whole app. You can find more info [here](https://github.com/zeit/next.js#custom-app).

#### _document
Contains the definition of how the app will be rendered. You can find more info [here](https://github.com/zeit/next.js#custom-document).

#### _error
Fallback page where the app leads if there has been an error, or the route doesn't exit. It can be customized. You can find more info [here](https://github.com/zeit/next.js#custom-error-handling).

### **./layouts**
Layouts are the second component to be loaded through the page. They contain all components that will be displayed in the page. Layouts do _not_ fetch data, they wait for it. Inner components could ask for data though.

Layouts should follow the same folder structure as pages. For example: if you need created your `myawesome` page in `pages/app/myawesome`, the layout for this page should be placed in `layouts/app/myawesome` and so on.

### **./components**
Every component will be contained in its own folder with its name. A basic component will contain the component itself (`component.js`) and an entrypoint to it (`index.js`). If the component needs access to the store, we will provide it here, otherwise we will just import the component. Additional files could be `styles.scss` (containing component-scoped styles) and `constants.js` (component-scoped constants).

```
./components/sidebar/
   ./constants.js (not mandatory)
   ./component.js (mandatory)
   ./index.js (mandatory)
   ./styles.scss (not mandatory)
```

Try to make stateless component (unless it really needs it). This will make components easier to track and reuse.

### **./modules**
Contains all redux modules used in the application. Right now, there are components with its own module inside the component folder: try to avoid this behaviour. Keeping modules per component will increase the size of the store and make it harder to handle in the long term.

Usually modules are composed by, at least, three files: `actions`, `reducers`, `initial-state` and its corresponding `index` entrypoint file. To export it, just add it in `modules/index`, you will notice we use [redux-tools](https://github.com/Vizzuality/redux-tools) to handle the modules.

_Legacy note:_ there is a folder named `./redactions` that also contains redux modules not handled with `redux-tools`. This folder is still in use, but the intention is to move everything and organise it according `redux-tools` specs.

### **./redactions**
Legacy folder containing redux modules written in a way not supported by `redux-tools`. Any new module should be placed in `./modules`.

### **./selectors**
This is a legacy folder. Still in use. [Selectors](https://github.com/reduxjs/reselect) must be used in component's scope. Using them globally will produce the loose of ability of caching. You can have more info [here](https://github.com/reduxjs/reselect#q-can-i-share-a-selector-across-multiple-component-instances).


### **css**
Contains generic application styles, grid, settings, mixins and anything style-related in a global scope. It also contains third-app components styles if needed.

_Legacy note:_ in the `./css/components` folder you will notice a lot of styles whose scope is the component itself. From now on, components must have its own styles inside the component folder. Check `components` section to learn more about how to include component-scoped styles.


### **./constants**
Constants are variables available across the application. They can be used anywhere without exception. When you are about to add a new one here, please keep in mind the scope of this/these constants and if they are worth it to place here or inside the component is going to use them.

As constants, they must be written in uppercase and using [Snake Case](https://en.wikipedia.org/wiki/Snake_case) notation. Example: `MY_AWESOME_CONSTANT`

### **./hooks**
Contains [hooks](https://reactjs.org/docs/hooks-overview.html) used along the application. These hooks must be agnostic.

### **./services**
Services are in charge of connecting the application with external APIs/other services. Every service contains a set of fetches (usually based on [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)), it's possible to extend them if needed, but take into account there can't be any app-related logic here. Every fetch should be able to be used in any context. TLDR: make services agnostic.

Services are based on [Axios](https://github.com/axios/axios) to manage `XMLHttpRequests/HTTP` requests.

Services are split into entities (most of them coming from [WRI API](https://resource-watch.github.io/doc-api/index-rw.html), feel free to create a new one if needed. Every fetch _must_ be documented. You can found more info about it in the `documentation` section.

_Legacy note_: you will find services as classes with custom options. The intention is to get rid of these classes and use standalone functions able to perform the desired fetch. Also, you will find fetches performed with `isomorphic-fetch`, replace it with `axios` whenever you can.

### **./utils**
Contains functions that make thing easier and are used across the app. Like `constants`, think about the scope of your util before implementing it here, perhaps just adding it at component's level is enough.

### **./public**
Folder to serve static files. It's accessible everywhere.

# Routing
Resource Watch uses [NextJS Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes).

# App State Management 🌅

Resource Watch uses [**Redux**](http://redux.js.org/) along to [**next-redux-wrapper**](https://github.com/kirill-konshin/next-redux-wrapper) to manage the global application state. With `next` 7.0 is not necessary anymore to wrap every page to access to the store. Wrapping `_app` is enough, rest of pages will access to the store like the rest of your components.


To interact with React components, Resource Watch uses [**react-redux**](https://react-redux.js.org/). While the existing `connect` API is still around, it is recommended to move to [hooks](https://react-redux.js.org/api/hooks).

# Authentication 🚫
Authentication is based on the [RW API user management](https://resource-watch.github.io/doc-api/index-rw.html#user-management) and handled by [NextAuth](https://next-auth.js.org/) framework.

# Optimization 🔎
## Bundle Analyzer
[@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) is a tool that creates an interactive treemap visualization of the contents of all your bundles.

To run it: `yarn analyze`.

It will run the application in production build (makes a `yarn build` internally) and open a tab in your browser displaying the bundles treemap.


# Deploy 🛫
You will need access to [Resource Watch Jenkins](https://jenkins.resourcewatch.org/).

Merging to `develop` branch will deploy [RW Staging](https://staging.resourcewatch.org) automatically.

To deploy [Resource Watch (production)](http://resourcewatch.org) you will need to access to Jenkins and deploy manually the `master` branch.

# Testing

This repository contains both the frontend application for the Resource Watch website, as well as a small API to handle specific actions needed by the frontend application (authentication, server side validation, etc).

As such, testing is architectured in two parts (although some convenience commands exist to run both test suits simultaneously)

## Frontend testing

Resource Watch uses [Cypress](https://www.cypress.io/) to handle e2e tests. Tests are available in `cypress/integrations` folder.

There are two ways to run tests locally:

- `yarn test` will run Cypress in the command line. All the tests will run.
- `yarn cy:open` will open the Cypress GUI. This interface will show all tests available in the application and let you know any or all of them.

In both cases, do not forget to run your server locally before and be sure the `baseUrl` field in the `cypress.json` file matches with your server.

You can find more info about Cypress and its API in [their docs](https://docs.cypress.io/guides/overview/why-cypress.html).

Part of the frontend application relies on data provided by the backend API, which is only served if the user is authenticated. To support mocking user authentication across both applications, the frontend test suite relies on [authentication mocking](https://www.npmjs.com/package/passport-mock-strategy) which is only enabled if the `NODE_ENV` environment variable has the `test` value, and `TEST_ENV` has the `FRONTEND` value. As such, be sure to use this value when starting the test server that will be used for the frontend testing.

## Backend testing

The backend API is tested using [Mocha](https://mochajs.org/).

Unlike frontend tests, backend tests do not depend on the application being available as a separate process - the test suite will programmatically start the application server. However, as the application server handles both the backend API and the frontend asset serving (and its preprocessing), it can take some time for it to finish its startup process. As such, it's convenient (but not required) that you set `SERVER_ONLY=true` when running backend tests, so that the underlying application server skips the lengthy frontend asset preprocessing process.

As mentioned in the [Frontend testing section](#frontend-testing), some frontend tests rely on a special mocked authentication mechanism, instead of the "real" one. While not exhaustively, the API tests do cover the mocked authentication mechanism. You can run these tests by running the backend test suite with `TEST_ENV=FRONTEND`

# Documentation 📝
Every change in the app must be documented in the `./CHANGELOG.md` file according to [keep a changelog](https://keepachangelog.com/en/1.0.0/) specs.

At code level, comments must follow [JSDocs](https://jsdoc.app) specs.

# Ocean Watch 🌊
Ocean Watch dashboard is handled by a file located in `public/static/data/ocean-watch.json`. This file contains the configuration of the dashboard as follows:

``` javascript
// grid values: `50%`, `100%`
{
  // data displayed on https://staging.resourcewatch.org/
  "staging": {
	// content to add to page /dashboard/ocean-watch
	"intro": [
      [
        {
          "grid": "100%",
          "visualizationType": "indicators-set",
          "config": {
            "theme": "secondary",
            "indicators": [
              {
                "id": "marine-protected-areas",
                "title": "Marine Protected Areas",
                "icon": "marine",
                "widgets": [
                  {
                    "id": "50c3fb9c-cef3-4533-8ae7-9ad122bb7963"
                  },
                  {
                    "query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
                    "text": "Some highlight text about why this matters",
                    "format": ".2f"
                  }
                ],
                "default": true
              },
              {
                "id": "oceans-climate",
                "title": "Oceans and Climate",
                "icon": "climate",
                "widgets": [
                  {
                    "id": "c8c4a6cc-6ac8-43a0-b988-f26301314a55"
                  },
                  {
                    "query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
                    "text": "Some highlight text about why this matters",
                    "format": ".2f"
                  }
                ]
              },
              {
                "id": "blue-economy",
                "title": "The Blue Economy",
                "icon": "economy",
                "sections": [
                  {
                    "title": "section 1",
                    "widgets": [
                      {
                        "id": "fe388698-4a58-4c43-b2b1-4d169334b2e4"
                      },
                      {
                        "query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
                        "text": "Some highlight text about why this matters",
                        "format": ".2f"
                      }
                    ],
                    "default": true
                  },
                  {
                    "title": "section 2",
                    "widgets": [
                      {
                        "id": "41223a30-f4e8-4749-9b44-034443646da4"
                      },
                      {
                        "query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
                        "text": "Some highlight text about why this matters",
                        "format": ".2f"
                      }
                    ]
                  }
                ]
              },
              {
                "id": "land-sea-interface",
                "title": "The Land/Sea Interface",
                "icon": "land-sea",
                "widgets": [
                  {
                    "id": "5eec6ec5-51e5-4d39-af23-9d1cda64dc3a"
                  },
                  {
                    "query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
                    "text": "Some highlight text about why this matters",
                    "format": ".2f"
                  }
                ]
              },
              {
                "id": "ocean-dependence",
                "title": "Ocean Dependence",
                "icon": "dependence",
                "widgets": [
                  {
                    "id": "4e4501f3-3380-488c-8eca-8a9d99c90a70"
                  },
                  {
                    "query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
                    "text": "Some highlight text about why this matters",
                    "format": ".2f"
                  }
                ]
              },
              {
                "id": "biodiversity",
                "title": "Biodiversity",
                "icon": "biodiversity",
                "widgets": [
                  {
                    "id": "f5a86ecb-e5d9-470e-ba57-33b3d0912881"
                  },
                  {
                    "query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
                    "text": "Some highlight text about why this matters",
                    "format": ".2f"
                  }
                ]
              }
            ]
          }
        }
      ]
    ],
	// content to add to pages /dashboard/ocean-watch/country/{ISO}
    "country-profile": [
		// every array represents a block of content
		[
			{
			"grid": "100%",
			"visualizationType": "indicators-set",
			"config": {
				// visual theme to display. Possible value: `primary` / `secondary`
				"theme": "secondary",
				// list of indicators
				"indicators": [
				{
					"id": "marine-protected-areas",
					// name of the indicator
					"title": "Marine Protected Areas",
					// icon displayed
					"icon": "marine",
					// list of widgets to display under the indicator. The first widget is located at left side, second one at right.
					"widgets": [
					{
						"id": "b9192492-20f3-4725-8e90-8795f2176329"
					},
					{
						// query to obtain data to display
						"query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
						// optional text to display
						"text": "Some highlight text about why this matters",
						// format to apply to the result of the query
						"format": ".2f"
					}
					],
					// enable to set this indicator as the first one highlighted when the page loads
					"default": true
				},
				{
					"id": "oceans-climate",
					"title": "Oceans and Climate",
					"icon": "climate",
					"widgets": [
					{
						"id": "b9192492-20f3-4725-8e90-8795f2176329"
					},
					{
						"query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
						"text": "Some highlight text about why this matters",
						"format": ".2f"
					}
					]
				},
				{
					"id": "blue-economy",
					"title": "The Blue Economy",
					"icon": "economy",
					// sections 
					"sections": [
					{
						// title of the section
						"title": "section 1",
						// widgets to display in the section. It works like widgets under an indicator.
						"widgets": [
						{
							"id": "b9192492-20f3-4725-8e90-8795f2176329"
						},
						{
							"query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
							"text": "Some highlight text about why this matters",
							"format": ".2f"
						}
						],
						"default": true
					},
					{
						"title": "section 2",
						"widgets": [
						{
							"id": "b9192492-20f3-4725-8e90-8795f2176329"
						},
						{
							"query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
							"text": "Some highlight text about why this matters",
							"format": ".2f"
						}
						]
					}
					]
				},
				{
					"id": "land-sea-interface",
					"title": "The Land/Sea Interface",
					"icon": "land-sea",
					"widgets": [
					{
						"id": "b9192492-20f3-4725-8e90-8795f2176329"
					},
					{
						"query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
						"text": "Some highlight text about why this matters",
						"format": ".2f"
					}
					]
				},
				{
					"id": "ocean-dependence",
					"title": "Ocean Dependence",
					"icon": "dependence",
					"widgets": [
					{
						"id": "b9192492-20f3-4725-8e90-8795f2176329"
					},
					{
						"query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
						"text": "Some highlight text about why this matters",
						"format": ".2f"
					}
					]
				},
				{
					"id": "biodiversity",
					"title": "Biodiversity",
					"icon": "biodiversity",
					"widgets": [
					{
						"id": "b9192492-20f3-4725-8e90-8795f2176329"
					},
					{
						"query": "https://wri-rw.carto.com/api/v2/sql?q=WITH r as (SELECT ROW_NUMBER() OVER (ORDER BY total DESC) AS ranking, rw_country_code as country_code, rw_country_name as country_name, total/100. as x, 'percentage' as unit, year FROM ene_012_electricity_access_edit WHERE year = 2018 AND year IS NOT NULL AND total IS NOT NULL ORDER BY total DESC), v as (SELECT count(distinct(country_code)), '{{iso}}' as country_code  FROM ene_012_electricity_access_edit) SELECT * FROM r INNER JOIN v ON r.country_code = v.country_code WHERE r.country_code = '{{iso}}'",
						"text": "Some highlight text about why this matters",
						"format": ".2f"
					}
					]
				}
				]
			}
			}
		],
		[
			{
				"grid": "100%",
				// represents a pink title in the dashboard
				"title": "Ecosystems and Pressures"
			},
			{
				"grid": "50%",
				// represents a a block of text in the dashboard
				"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean finibus maximus iaculis Integer fermentum justo vitae efficitur aliquam. Nulla varius, tellus ac pharetra elementum, purus orci cursus justo, blandit tempus justo eros ultricies nisi.In semper, nulla non semper venenatis, sem lorem condimentum ligula, ac dapibus enim ex vitae massa."
			},
			{
				"grid": "50%",
				"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean finibus maximus iaculis Integer fermentum justo vitae efficitur aliquam. Nulla varius, tellus ac pharetra elementum, purus orci cursus justo, blandit tempus justo eros ultricies nisi.In semper, nulla non semper venenatis, sem lorem condimentum ligula, ac dapibus enim ex vitae massa."
			}
      	],
		[
			{
				"grid": "100%",
				"visualizationType": "mini-explore",
				"config": {
					// title of the Mini Explore. Mandatory.
					"title": "Lorem ipsum",
					// geostore of the area to display (if any). Optional: remove or set to `null` if no needed.
					"areaOfInterest": "972c24e1da2c2baacc7572ee9501abdc",
					// datasets split into different groups. Mandatory.
					"datasetGroups": [
						{
							// title of the group. Mandatory.
							"title": "Power Infrastructure",
							// datasets that form the group. Mandatory.
							"datasets": [
								"a86d906d-9862-4783-9e30-cdb68cd808b8",
								"b75d8398-34f2-447d-832d-ea570451995a",
								"4919be3a-c543-4964-a224-83ef801370de"
							],
							// default datasets to display when Mini Explore is initialized. Optional: leave as empty array (`[]`) if no needed.
							"default": [
								"a86d906d-9862-4783-9e30-cdb68cd808b8"
							]
						},
						{
							"title": "Natural hazards",
							"datasets": [
								"484f10d3-a30b-4466-8052-c48d47cfb4a1",
								"c5a62289-bdc8-4821-83f0-6f05e3d36bdc"
							],
							"default": [
								"484f10d3-a30b-4466-8052-c48d47cfb4a1"
							]
						}
					]
				}
			}
		]
    ]
  },
  // data displayed on https://preproduction.resourcewatch.org/, https://resourcewatch.org/
  "production": {
	"intro": [],
    "country-profile": []
  },
}
```

# Contributing 🎁
If you have any amazing idea for the project, please [tell us](https://github.com/resource-watch/resource-watch/issues) before develop it.

## Reporting an issue
Issues can be reported [here](https://github.com/resource-watch/resource-watch/issues).

# Useful links

* [RW API documentation](https://resource-watch.github.io/doc-api/)
* [Basecamp](https://basecamp.com/1756858/projects/8955129)
* [Pivotal Tracker](https://www.pivotaltracker.com/n/projects/1374154)
* [PostMan recipes](https://www.getpostman.com/collections/5f3e83c82ad5a6066657)
* [Invision Designs/Wireframes](https://projects.invisionapp.com/d/main/default/#/projects/prototypes/11337456)

### Related repositories

* [resource-watch/graph](https://github.com/resource-watch/graph) _Knowledge graph and future recommendation system_
