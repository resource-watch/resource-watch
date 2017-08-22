![screen shot 2017-06-08 at 9 25 50 am](https://user-images.githubusercontent.com/545342/26916938-86333e38-4c2c-11e7-952c-012bd65700a5.png)

# Resource Watch

## Useful links

* [RW API documentation](https://resource-watch.github.io/doc-api/)
* [Basecamp](https://basecamp.com/1756858/projects/8955129)
* [PivotalTracker](https://www.pivotaltracker.com/n/projects/1374154)
* [PostMan recipes](https://www.getpostman.com/collections/5f3e83c82ad5a6066657)
* [Invision Designs/Wireframes](https://projects.invisionapp.com/d/main/default/#/projects/prototypes/11337456)

### Related repositories

* [resource-watch/graph](https://github.com/resource-watch/graph) _Knowledge graph and future recommendation system_

### DEPRECATED repositories

* [resource-watch-app](https://github.com/resource-watch/resource-watch-app/) _Old repository for the app_ 
* [resource-watch-manager](https://github.com/resource-watch/resource-watch-manager/) _Old repository for the back office_ 
* [rw-components](https://github.com/resource-watch/rw-components/) _Old repository used to store components that were used in both resource-watch-app and resource-watch-manager_ 

# Architecture

The application is built on top of [**Next.js**](https://github.com/zeit/next.js/) - _a framework for server-rendered React apps_ - and was created starting from the template created with [**nextjs-starter**](https://github.com/iaincollins/nextjs-starter) - _a starter project for Next.js with oAuth and email based authentication_ -. The code created by this starter kit was however modified and improved so that it better fitted our needs.

## Folder structure

![screen shot 2017-06-08 at 10 25 52 am](https://user-images.githubusercontent.com/545342/26919119-e2963ea2-4c34-11e7-9743-c8f22a10181e.png)

**components** React components _(.js file extension instead of .jsx due to Next.js)_

![screen shot 2017-06-08 at 10 28 26 am](https://user-images.githubusercontent.com/545342/26919216-3ed12d26-4c35-11e7-88db-933be59cc9cb.png)

Application components under **app** folder and back office ones under **admin**. The rest of folders are used to store components that could be used in any of the two.

**css** Styles _Replicating folder structure of React components_

![screen shot 2017-06-08 at 12 08 28 pm](https://user-images.githubusercontent.com/545342/26923714-3a379242-4c43-11e7-95b2-cc0d3ddc2179.png)

Top level files:

- _**index.scss**_: used to load all the styles
- _**config.scss**_: configuration and variables
- _**layouts.scss**_: general layout styles
- _**base.scss**_: base styles
- _**foundation_settings.scss**_: main styles for foundation

**pages** Folder where Next.js will look for pages that should be rendered according to the routes definition

![screen shot 2017-06-08 at 12 14 06 pm](https://user-images.githubusercontent.com/545342/26923943-fdd8662c-4c43-11e7-94d4-5075612c4221.png)

Pages that are part of the back office are located under the sub-folder _admin_, pages that are part of the public portal are located under _app_ respectively.

**services** One file per entity _(dataset, widget, layer...)_ that includes the logic necessary to perform operations over it _(CRUD)_

**static** Equivalent to **public** folder in used with other technologies. This folder is used to store the assets needed across the application.

**utils** General logic that could potentially be used anywhere in the code.


## Authentication

We discarded the approach followed by nextjs-starter and decided to use [**passport-control-tower**](https://github.com/control-tower/passport-control-tower) instead.

## Routing

We're using the package [**next-routes**](https://www.npmjs.com/package/next-routes) for routing. This package allows us to define routes with unique names in a very straightforward way and, thanks to this, we can reference them from anywhere in the code without having to specify the route itself everywhere - _which could result into errors when updating the value of a route in several places_.

The routes are defined in the file [**routes.js**](/routes.js). Here's an excerpt of the file:

``` javascript
// ----- DATASET --------
routes.add('admin_home', '/admin', 'admin/dataset');
routes.add('datasets', '/admin/datasets', 'admin/dataset');
routes.add('edit_dataset', '/admin/datasets/:id/edit', 'admin/dataset/edit');
```

The first value of the method represents the unique name of the route, the second is the route itself, while the third represents the path to the page that should be rendered (starting from the folder **_pages_**).

## Redux

RW uses [**Redux**](http://redux.js.org/) together with the [**next-redux-wrapper**](https://github.com/kirill-konshin/next-redux-wrapper). In order to wrap a React **page** with Redux we have to do the following:

Import the store and withRedux

``` javascript
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
```

Deine the functions **mapStateToProps** and **mapDispatchToProps** if necessary _(simply pass null otherwise)_

``` javascript
const mapStateToProps = state => ({
  layerActive: state.pulse.layerActive
});

const mapDispatchToProps = dispatch => ({
  toggleActiveLayer: (id, threedimensional, hemisphere) => {
    dispatch(toggleActiveLayer(id, threedimensional, hemisphere));
  },
  getLayerPoints: (id, tableName) => {
    dispatch(getLayerPoints(id, tableName));
  }
});
```

Export the class using the function **withRedux**

``` javascript
export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(LayerNavDropdown);
```

In the case you want to use Redux **outside of a page** you should use the standard **connect** instead.

## Icons management

Icons are located under the folder _**static**_.

![screen shot 2017-08-22 at 10 09 26 am](https://user-images.githubusercontent.com/545342/29555191-23a68532-8722-11e7-9ea6-e517b916635a.png)

There also exist a couple of components called: _**icons.js**_ in the following folders:

![screen shot 2017-08-22 at 10 12 31 am](https://user-images.githubusercontent.com/545342/29555316-8e066514-8722-11e7-998a-55a0ed1c61c2.png)

![screen shot 2017-08-22 at 10 12 43 am](https://user-images.githubusercontent.com/545342/29555331-94800f8a-8722-11e7-9bdb-1ebb45248552.png)

### Step-by-step process to update the set of icons

1. Go to the [icomoon website](https://icomoon.io/app/#/select).
2. Drag and drop the file **selections.json** into the page
3. Import/search+select the new set of icons you want and add them to the current set
4. Click on **Generate SVG & more** and download the zip file to a local folder
5. Extract the contents and replace the following files in the project icons folder: selections.json, SVG folder, symbol-defs.svg
6. Copy and paste the contents of the file **symbol-defs** into the files: _icons.js_ previously mentioned
3. 
