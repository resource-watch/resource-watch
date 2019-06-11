# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.1.3] - 2019-05-10
### Added
- Updates application to `next@8.1.0` [[code]](https://github.com/resource-watch/resource-watch/commit/348401322f70b3b3d88d5afdf4b190ce394ce3b0)
### Fixed
- Fixes a bug where topics weren't fetched landing to `/sign-in`. [[code]](https://github.com/resource-watch/resource-watch/pull/989)
- Fixes wrong styles in forgotten password page [[code]](https://github.com/resource-watch/resource-watch/commit/7e21220a5e5935c3a90be1b0e4f3e5a0a4afaa1d)
- Admin backoffice: fixes layers and widgets filtering  in dataset view [[code]](https://github.com/resource-watch/resource-watch/commit/b22244b4528e6f10ae83e7add4b43b6ac47443e7)
- Admin backoffice: fixes an issue loading dataset title after widget edition [[code]](https://github.com/resource-watch/resource-watch/commit/b22244b4528e6f10ae83e7add4b43b6ac47443e7)
- Admin backoffice: fixes an issue where owner column values weren't displayed properly. Also, fixes sorting by owner. [[code]](https://github.com/resource-watch/resource-watch/commit/254bc2606f359ba48b5743f68f528b15297a07a6)

### Changed
- Admin backoffice: changes pagination: now it renders dynamically instead of fetching all resources at the same time reducing waiting times. [[code]](https://github.com/resource-watch/resource-watch/pull/981) [[code]](https://github.com/resource-watch/resource-watch/pull/984) [[code]](https://github.com/resource-watch/resource-watch/pull/985)


## [2.1.2] - 2019-04-25
### Fixed
- Fixed wrong fetch preventing to display the current resource name in the admin edition [[code]](https://github.com/resource-watch/resource-watch/commit/19782d29fa7b813d502bb9ac68559ef9b608084f)

### Changed
- Updated fetch method for getting a dataset.
- Changed error handling for fetching.	


## [2.1.1] - 2019-04-17
### Fixed
- Fixed an error preventing a user save/update a layer in the admin [[code]](https://github.com/resource-watch/resource-watch/pull/969/commits/18ddf6c9bfee1e84b5d512479e26c71c3a3c9d44)
### Changed
- Updated Pulse's layers texts according Amelia's suggestions [[code]](https://github.com/resource-watch/resource-watch/commit/d31bccb107b64c2f8356ba8d7a5a2bcb69caf879)

## [2.1.0] - 2019-04-11
### Added
- Unifies sign-up modal across the application.
- Open Graph tags to display a thumbnail when a user shares/embeds a widget.
- Better page handling error when the app crashes or don't found a resource.
### Fixed
- Fixes override styling with NextJS `7.0`

### Changed
- Updated `og:image` in `/data/wigdet/${id}` with widget's thumbnail.
- Updated `widget-editor` dependency to latest version (`1.4.4`).
- Updated pages structure to be monofile and reduce compilation times.
- Added loggers to services to catch errors better.
- Updated `lodash` to fix a critical vulnerability.
- Renamed `wri-api-components` to `vizzuality-components`.

### Removed
- Removed `widgetDetail` module. Now the widget is passed as a prop.

## [2.0.3] - 2019-03-27
### Added
- Replaced the modal used for sharing a widget in myRW for the same one used in the explore page
making the sharing experience more consistent. Removed old one.
- Now `/data/widget/{id}` route is accessible for non-published widgets .

## [2.0.2] - 2019-03-26
### Fixed
- Fixed bad alignment of user icon in app header.
- Cross-browsing: header search result suffered from crippling in Firefox 66.

### Changed
- Moved from `wri-api-components` to `vizzuality-components`. `wri-api-components` will be deprecated at some point.
- Removed header items from store. There was no need to keep them there. Now they are stored in a
component-level `constants` file. This also applies for admin header.
- Styling: removed white border from embed maps (explore, map, map-swipe).


## [2.0.1] - 2019-03-18
### Fixed
- Fixed error compilation with `node-gyp` and `canvas` in Dockerfile
adding `pango-dev`, `jpeg-dev` dependencies.

## [2.0.0] - 2019-03-13
### Changed
- Updates app pages according to Next 7.0.
- Updated `README` according to recent changes.

### Add
- `./pages/_app` file. No need to connect every page to the store anymore.
- `./pages/_document`

## [1.2.0] 2017-11-14

### Fixed

### Added
- Description of the fields/columns in the editor

### Changed

## [1.1.0] - 2017-10-11

### Fixed
- Explore details tags are filtered so that generic/unuseful tags are not shown
- Legend actions buttons are not shown in the widget editor in Map mode
- Insight cards: Source used to create the cards have been unified, links are visible now (white color)
- Explore Detail: Source is not shown in the header
- Explore: Tags button is properly placed now in lists mode as well
- Planer pulse: Floods layer colors fixed
- Planet pulse drop downs have now a `z-index` that makes them be displayed on top of the layer card
- Planet pulse Carto layers are fetched based on the information in the `pulseConfig` object
- Planet pulse 3D layers get their respective markers using the info located in `pulseConfig`
- Planet pulse globe tooltips show only the fields that are specified in the object `interactionConfig`
- Bar charts properly handle `null` and negative values
- Pie and bar charts are now responsive and are properly displayed as thumbnails (newer charts only)
- Fixed invariant violation error
- Fixed map container error in back office
- Datasets always show geoInfo value, even if they are rasters (it will be always true)
- Widget map creation
- Better validations for widgetEditor
- MapControls component added
- BasemapControl component added
- ShareControl component added
- Footer updated
- Add map widgets to dashboards
- Add text widgets to dashboards
- Manually-created widgets could break the tooltip if no proper formatting would be provided
- Opacity selector for all layers
- Metadata subtitle
- WMS Metadata and Dataset form doesn't call fields endpoint
- Explore detail: download links working
- Explore detail: correct SEO tags

### Added
- Prototype of the Splash page
- Pulse: Use Cesium for both 2D and 3D layers
- Explore: favourite datasets
- Explore detail: favourite dataset
- MyRW Dataset favourites
- Explore detail tags section
- Favorite widget functionality at Embed widget page
- Styles for LayerInfoModal component
- Technical title (formal name) added to Explore Detail
- Subscribe to alerts from Planet Pulse
- Insights cards: The whole card is clickable now
- Planet pulse improvements: color used as extra dimension in more 3D layers
- Planet pulse globe tooltips have hyperlinks for url values
- New prototype of tags tooltip in Explore
- New search input for the filter tooltip in the Widget Editor
- Implementation of decision tree to get visualizations by dataset. [PDF](https://vizzuality.slack.com/files/U4C2Q99RB/F79L7J7UL/rw_-_widget_creation.pdf)
- New command to check datasets for widget editor `yarn check-datasets`
- New command to check layers `yarn check-layers`
- Vega Chart as component
- Added Vega Chart Thumbnail with theme configuration
- Added support for server rendering in Explore page (for search crawler)
- Added support for GEE layers in Map
- Pie charts display an "others" category to avoid duplicate colors
- Transifex
- Transifex blacklist
- Router onChange progress
- Dock Component
- Dashboards: The user is able to add more than one widget at a time. Depending on the number quill will add them in a row with 1, 2 or 3 columns. Never more than 3 widgets
- Added map widgets to dashboards
- Added text widgets to dashboards
- MapControls component added
- BasemapControl component added
- ShareControl component added
- Added new endpoint `profiles` to save and upload profile images in S3 service
- Added checkbox for label layers in Explore page
- Terms and privacy policy pages
- Tool admin page added to CMS.
- Added support for timeline in one layer `Standarized Precipitation Index`
- Tool page connected to BO

### Changed

- Planet pulse: extra point light added to the scene so that colors can be perceived more easily
- Tooltips of the charts are now based on the [`interaction_config` object](https://github.com/resource-watch/notebooks/blob/master/ResourceWatch/Api_definition/widget_definition.ipynb) of the `widgetConfig`
- WRI logo separate from partner carousel.
- Footer style's.
- Better validations for widgetEditor
- Unique components for Legend and Map
- Basemaps by default doesn't have labels
- Styles for search results
