# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.1.6] - 2019-08-19
### Added
- Alert preview improvements [[code]](https://github.com/resource-watch/resource-watch/pull/1089)

### Fixed
- Fix for Markdown link styles [[code]](https://github.com/resource-watch/resource-watch/pull/1083)
- Fix issue with Layer form (published checkbox was always checked) [[code]](https://github.com/resource-watch/resource-watch/pull/1087)
- Fix "Dataset not found" error when saving widgets [[code]](https://github.com/resource-watch/resource-watch/pull/1090)

## [2.1.5] - 2019-08-01
### Added
- Explore detail: markdown related improvements [[code]](https://github.com/resource-watch/resource-watch/pull/1070)

### Fixed
- Fix for: "Array error when saving widget" [[code]](https://github.com/resource-watch/resource-watch/pull/1075)
- Fix for issue: Backoffice widget creator only appears when dataset manually selected [[code]](https://github.com/resource-watch/resource-watch/pull/1077)

### Changed
- Adds origin param to reset password [[code]](https://github.com/resource-watch/resource-watch/pull/1074)
- Adds origin in reset-password token generation [[code]](https://github.com/resource-watch/resource-watch/pull/1076)
- Encapsulate CSS for markdown lists into a separate CSS class - Adds origin in reset-password token generation [[code]](https://github.com/resource-watch/resource-watch/pull/1078)
- forgotten password - moves to axios and logger [code]](https://github.com/resource-watch/resource-watch/pull/1079)

## [2.1.4] - 2019-07-25
### Added
- Prevent blog feed from loading "UNCATEGORIZED" blog posts. [[code]](https://github.com/resource-watch/resource-watch/pull/1015)
- Catalog page: pagination and other improvements. [[code]](https://github.com/resource-watch/resource-watch/pull/1017)
- MyRW: Improvements to search results messages in MyRW. [[code]](https://github.com/resource-watch/resource-watch/pull/1019)
- Improved styles and pagination in Dashboards "Add visualization" modal. [[code]](https://github.com/resource-watch/resource-watch/pull/1023)
- Improvements for MyRWDatasets and DatasetList components. [[code]](https://github.com/resource-watch/resource-watch/pull/1024)
- Re-enable the pre-populating of the dataset name when creating widget and layers. [[code]](https://github.com/resource-watch/resource-watch/pull/1030)
- Handle icons that are RW specific using Icomoon directly from the RW app. [[code]](https://github.com/resource-watch/resource-watch/pull/1039)
- Implement "remove" buttons in back office detail pages (widget + layer). [[code]](https://github.com/resource-watch/resource-watch/pull/1041)
- Share by email functionality added to all share modals. [[code]](https://github.com/resource-watch/resource-watch/pull/1042)
- Layer info pop-up "more info" button leads to `resourcewatch.org/data/explore/[slug]`. [[code]](https://github.com/resource-watch/resource-watch/pull/1047)
- GDPR banner added both to the app and the back office. [[code]](https://github.com/resource-watch/resource-watch/pull/1049)
- Surface the Last update date in Explore detail only when this field has a value. [[code]](https://github.com/resource-watch/resource-watch/pull/1054)
- Icon component-level styles. Adds optimize-css-assets-webpack-plugin / cssnano [[code]](https://github.com/resource-watch/resource-watch/pull/1056)
- Add application and environment parameters to services. [[code]](https://github.com/resource-watch/resource-watch/pull/1058)
- removes unused tasks. [[code]](https://github.com/resource-watch/resource-watch/pull/1061)
- adds auth in preproduction environment. [[code]](https://github.com/resource-watch/resource-watch/pull/1064)
- Timeline appearance improved when there are many time steps. [[code]](https://github.com/resource-watch/resource-watch/pull/1071)

### Fixed
- Fixes posts fetching. [[code]](https://github.com/resource-watch/resource-watch/pull/1004)
- Removes default meta viewport. [[code]](https://github.com/resource-watch/resource-watch/pull/1005)
- Fixes issue setting map center in widget-block. [[code]](https://github.com/resource-watch/resource-watch/pull/1012)
- Reorganizes styles to avoid override. [[code]](https://github.com/resource-watch/resource-watch/pull/1016)
- Fixes fetching widgets in MyRW. [[code]](https://github.com/resource-watch/resource-watch/pull/1018)
- MyRW fix: redundant "Explore datasets" button removed from Datasets section. [[code]](https://github.com/resource-watch/resource-watch/pull/1020)
- MyRW fix: show pagination tool only when there is more than one page. [[code]](https://github.com/resource-watch/resource-watch/pull/1021)
- Fix user collections not being loaded in Explore. [[code]](https://github.com/resource-watch/resource-watch/pull/1026)
- Fix back office navigation on save. [[code]](https://github.com/resource-watch/resource-watch/pull/1028)
- Fix issue when clicking on Remove layer in the back office. [[code]](https://github.com/resource-watch/resource-watch/pull/1029)
- Back office fix: clicking on widgets/layers breadcrumbs leads to the corresponding dataset page. [[code]](https://github.com/resource-watch/resource-watch/pull/1031)
- Fix "Suggest a story" link from button in homepage banner. [[code]](https://github.com/resource-watch/resource-watch/pull/1033)
- Fix for favorite widgets not loading in MyRW. [[code]](https://github.com/resource-watch/resource-watch/pull/1034)
- Fix error thrown on Collections page load. [[code]](https://github.com/resource-watch/resource-watch/pull/1046)
- Fix for layer creation (breadcrumbs + bug when selecting dataset). [[code]](https://github.com/resource-watch/resource-watch/pull/1048)
- Fix issues with collections, myrw datasets tabs and collections links to datasets + widgets. [[code]](https://github.com/resource-watch/resource-watch/pull/1050)
- Prevent widgets from other apps to be loaded in MyRW. [[code]](https://github.com/resource-watch/resource-watch/pull/1051)
- Fix issue with dependency. [[code]](https://github.com/resource-watch/resource-watch/pull/1062)
- Fix issue with layers and widgets having two environments associated at once. [[code]](https://github.com/resource-watch/resource-watch/pull/1068)

### Changed
- Bump fstream from 1.0.11 to 1.0.12. [[code]](https://github.com/resource-watch/resource-watch/pull/1006)
- Upgrades autoprefixer. [[code]](https://github.com/resource-watch/resource-watch/pull/1008)
- Bump js-yaml from 3.12.0 to 3.13.1. [[code]](https://github.com/resource-watch/resource-watch/pull/1009)
- Bump handlebars from 4.0.12 to 4.1.2. [[code]](https://github.com/resource-watch/resource-watch/pull/1010)
- Updates legend timeline styles. [[code]](https://github.com/resource-watch/resource-watch/pull/1014)
- vizz-wysiwyg version upgraded to 2.1.2. [[code]](https://github.com/resource-watch/resource-watch/pull/1022)
- Clean up of obsolete/unused images plus Splash page related code. [[code]](https://github.com/resource-watch/resource-watch/pull/1032)
- Refactor widget block edition. [[code]](https://github.com/resource-watch/resource-watch/pull/1036)
- Update MyRW with new design to remove elements. [[code]](https://github.com/resource-watch/resource-watch/pull/1037)
- Leaflet styles updated to 1.3.4. [[code]](https://github.com/resource-watch/resource-watch/pull/1038)
- Bump jquery from 3.3.1 to 3.4.1. [[code]](https://github.com/resource-watch/resource-watch/pull/1040)
- Bump lodash-es from 4.17.11 to 4.17.14. [[code]](https://github.com/resource-watch/resource-watch/pull/1044)
- Bump lodash.mergewith from 4.6.1 to 4.6.2. [[code]](https://github.com/resource-watch/resource-watch/pull/1045)
- Email share fields updated. [[code]](https://github.com/resource-watch/resource-watch/pull/1052)
- Back office layer+widget form updates. [[code]](https://github.com/resource-watch/resource-watch/pull/1053)
- next@9. [[code]](https://github.com/resource-watch/resource-watch/pull/1055)
- Share email icon renamed to email. [[code]](https://github.com/resource-watch/resource-watch/pull/1059)
- simplifies auth and variables involved. [[code]](https://github.com/resource-watch/resource-watch/pull/1065)
- Updates key names. [[code]](https://github.com/resource-watch/resource-watch/pull/1066)

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
