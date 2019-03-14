![screen shot 2017-06-08 at 9 25 50 am](https://user-images.githubusercontent.com/545342/26916938-86333e38-4c2c-11e7-952c-012bd65700a5.png)

# Resource Watch 🌍👓
Resource Watch features hundreds of data sets all in one place on the state of the planet’s resources and citizens. Users can visualize challenges facing people and the planet, from climate change to poverty, water risk to state instability, air pollution to human migration, and more.

# Installation (native) 📦
We strongly recommend to use [yarn](https://yarnpkg.com/en/) to manage your front-end packages. Follow this, running
```bash
yarn
```
in your terminal will install all dependencies. Once done, type:
```bash
yarn dev
```
and your app will be served in [http://localhost:9000/](http://localhost:9000/) (if you didn't change the default port in the `.env`).

## Production build
If you need a production-ready build, run:
```bash
yarn build
```
this will generate your build in `./dist` folder ready to run 

Happy coding!

## env
There's an `.env.sample` file you will need to duplicate and rename to `.env` in order to make the app work. Populate it properly and that's all.

## Troubleshooting 🤔
You might run into some problems installing dependencies:

### Cairo / Canvas
If the installation fails at the point where it installs `canvas`, you may want to take a look at [this](https://github.com/Automattic/node-canvas#compiling).

## Recommendations
You will need a specific [Node](https://nodejs.org/en/) version to install the dependencies. We strongly recommend having [NVM](https://github.com/creationix/nvm) to manage multiple Node versions.

# Installation (Docker) 🐳
[TO-DO]

# Architecture 📂
The application is built on top of [**Next.js**](https://github.com/zeit/next.js/) - _a framework for server-rendered React apps_. _Next_ provides a zero-setup [webpack](https://webpack.js.org/) build ready to develop along a [express](https://expressjs.com/) server to run the application and [SASS](https://sass-lang.com/) styles compilation.

## Folder structure

Resource Watch application is splitted into the next main folders:
- pages
- layout
- components
- modules
- redactions (legacy)
- selectors (legacy)
- css
- constants
- services
- utils
- public

### **./pages**
Pages are the first component to be loaded according _Next_ specification. Those ones contain the layout to be loaded. They are also in charge of fetching data for that specific page.

Pages are splitted into 3 main folders:
- _app_: contains most of pages of the site not linked to MyRW or the administration.
- _myrw_ contains pages related with MyRW (My Resource Watch) user page.
- _admin_: contains pages related with RW data administration.

_Please take this into account where a page should be placed based on this criteria._

Everytime you add a new page, you will need to tell _Next_ when it should load it. This can be done in the `./routes.js` file.

Apart of the custom pages, there are 3 unique pages defined by _Next_ will see below:

#### _app
The page of pages. All ready will inherit from this one, so take in mind this. Resource Watch's pages are connect to redux thanks to this file. Also sets some states and fetchs used in the whole app. You can find more info [here](https://github.com/zeit/next.js#custom-app).

#### _document
Contains the definition of how the app we will be rendered. You can more info [here](https://github.com/zeit/next.js#custom-document).

#### _error
Fallback page where the app leads if there has been an error or the route doesn't exit. It can be customized. You can fin more info [here](https://github.com/zeit/next.js#custom-error-handling).

### **./layouts**
Layouts are the second component to be loaded through the page. They contain all components that will be displayed in the page. Layouts do _not_ fetch data, they wait for it. Inner components could ask for data though.

Layouts should follow the same folder structure as pages. For example: if you need created your `myawesome` page in `pages/app/myawesome`, the layout for this page should be placed in `layouts/app/myawesome` and so on.

### **./components**
Every component will be contained in its own folder with its name. A basic complement will contain the component itself (`component.js`) and and entrypoint to it (`index.js`). If the component needs access to the store, we will provide it here, otherwise we will just import the component. Additional files could be `styles.scss` (containing component-scoped styles) and `constants.js` (component-scoped constants).

```
./components/sidebar/
   ./constants.js (not mandatory)
   ./component.js (mandatory)
   ./index.js (mandatory)
   ./styles.scss (not mandatory)
```

Try to make stateless component (unless it really needs it). This will make components more easier to track and reusable.

### **./modules**
Contains all redux modules used in the application. Right now, there are components with its own module inside the component folder: try to avoid this behaviour. Keeping modules per component will increase the size of the store and make it harder to handle in the long term.

Usually modules are composed by, at least, three files: `actions`, `reducers`, `initial-state` and its corresponding `index` entrypoint file. To export it, just add it in `modules/index`, you will notice we use [redux-tools](https://github.com/Vizzuality/redux-tools) to handle the modules.

_Legacy note:_ there is a folder named `./redactions` that also contains redux modules not handleded with `redux-tools`. This folder is still on use but the intention is to move everything and organise it according `redux-tools` specs.

### **./redactions**
Legacy folder containing redux modules written in a way not supported by `redux-tools`. Any new module should be placed in `./modules`.

### **./selectors**
This is a legacy folder. Still in use. [Selectors](https://github.com/reduxjs/reselect) must be used in component's scope. Using them globally will produce the loose of ability of caching. You can have more info [here](https://github.com/reduxjs/reselect#q-can-i-share-a-selector-across-multiple-component-instances).


### **css**
Contains generic application styles, grid, settings, mixins and anything style-related in a global scope. Also it contains third-app components styles if needed.

_Legacy note:_ in the `./css/components` folder you will notice a lot of styles whose scope is the component itself. From now on, components must have its own styles inside the component folder. Check `components` section to learn more about how to include component-scoped styles.


### **./constants**
Constants are variables available across the application. They can be used anywhere without exception. When you are about to add a new one here, please keep in mind the scope of this/these constants and if they are worth it to place here or inside the component is going to use them.

As constants, they must be written in uppercase and using [Snake Case](https://en.wikipedia.org/wiki/Snake_case) notation. Example: `MY_AWESOME_CONSTANT`

### **./services**
Services are in charge of connecting the application with external APIs/other services. Every service contains a set of fetchs (usually based on [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)), it's possible to extend them if needed, but take into account there can't be any app-related logic here. Every fetch should be able to be used in any context. TLDR: make services agnostic.

Services are based on [Axios](https://github.com/axios/axios) to manage `XMLHttpRequests/HTTP` requests.

Services are splitted into entities (most of them coming from [WRI API](https://resource-watch.github.io/doc-api/index-rw.html), feel free to create a new one if needed. Every fetch _must_ be documented. You can found more info about it in the `documentation` section.

_Legacy note_: you will find services as classes with custom options. The intention is to get rid of theses classes and use standalone functions able to perform the desired fetch. Also, you will find fetchs performed with `isomorphic-fetch`, replace it with `axios` whenever you can.

### **./utils**
Contains functions makes thing easier and are used across the app. Like `constants`, think about the scope of your util before implement it here, perhaps just adding it at component's level is far enough.

### **./static**
It's the `public` Next's folder. Contains assets accessible across the app, like `images`, `icons`, `favicon`, `robots`, ...

# Routing
_Next_ provides an easy way to manage our app's routes via [next-routes](https://github.com/fridays/next-routes). All app routes are served in `./routes`. A quick look at it:

``` javascript
routes.add('home', '/', 'app/home');
routes.add('splash', '/splash', 'app/splash');
routes.add('splash_detail', '/splash/:id', 'app/splash-detail');
```

The first value of the method represents the unique name of the route, the second is the route itself, while the third parameter represents the path to the page that should be rendered (starting from the **_./pages_** folder). Take into account, in some cases, and with some parameter combination, the order of route declaration matters.

# App State Management 🌅

Resource Watch uses [**Redux**](http://redux.js.org/) along to [**next-redux-wrapper**](https://github.com/kirill-konshin/next-redux-wrapper) to manage the app state. With `next` 7.0 is not necessary anymore to wrap every page to access to the store. Wrapping `_app` is enough, rest of pages will access to the store like the rest of your components.


Connection to the store must be isolated from the component itself (separating presentation from logic).

``` javascript
import { connect } from 'react-redux';

// component
import PagesShow from './component';

export default connect(
  state => ({
    user: state.user,
    id: state.routes.query.id
  }),
  null
)(PagesShow);
```
The example above shows an `index.js` separating the logic from the component layout.

# Authentication 🚫
Authentication is based on [Control Tower](https://github.com/Skydipper/control-tower) plugins and several custom [passport](http://www.passportjs.org/) middlewares.

# Deploy 🛫
You will need access to [Resource Watch Jenkins](https://jenkins.resourcewatch.org/).

Merging to `develop` branch will deploy [RW Staging](https://staging.resourcewatch.org) automatically.

To deploy [Resource Watch (production)](http://resourcewatch.org) you will need to access to Jenkins and deploy manually the `master` branch.

# Documentation 📝
Every change in the app must be documented in the `./CHANGELOG.md` file according to [keep a changelog](https://keepachangelog.com/en/1.0.0/) specs.

At code level, comments must follow [JSDocs](http://usejsdoc.org/) specs.

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
