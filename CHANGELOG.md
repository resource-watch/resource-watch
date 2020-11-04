# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.16.7] - TBD
### Added
- Explore: added active state for prominent buttons in new area form.
- Embed maps: display user areas. [#175394222](https://www.pivotaltracker.com/story/show/175394222)
- widget-editor: WRI's colour scheme.

### Changed
- Updated styles for primary buttons when they are disabled according to UI Kit.
- Explore: disallows to create an area if the respective fields are not populated correctly.
- Explore: unified button styles of top bar buttons.
- Explore: unified prominent button styles from datasets and areas.
- Explore map and area cards now use different styles for areas.
- unified methods to process files when a user uploads an area.
- moved `favicon` to `public` root.
- changed from `static` to `public` the folder where the server serves statics.
- `next@9.1.7`
- widget-editor: better separation of utils and constants.

### Fixed
- Explore: glitch in country selector inside new are form.

### Removed
- Explore: top bars of sidebar are now clickable.
- deprecated widget schemas and utils replaced by `widget-editor`
- `canvas` and `vega` dependencies.

## [2.16.0] - 10-21-2020
### Added
- possibility of drawing custom areas in Explore map. [#175261981](https://www.pivotaltracker.com/story/show/175261981)
- added pagination for areas in MyRW. [#175261981](https://www.pivotaltracker.com/story/show/175261981)
- user areas of interest can now be displayed in Explore map. Also, edition is available. [#175261981](https://www.pivotaltracker.com/story/show/175261981)
- sitemap generation.
- new fetching for fields from `carto` datasets. Instead of using WRI's API `/fields` endpoint, points directly to Carto SQL API as it admits query modifications. [#171632711](https://www.pivotaltracker.com/story/show/171632711)
- better error handling for widget cards fetching layers.
- extra validation step to ensure `widgetConfig` attribute of widgets is present and valid. [#174911795](https://www.pivotaltracker.com/story/show/174911795)

### Changed
- login in Explore page won't redirect to MyRW anymore, the user will remain in the Explore page. [#175261981](https://www.pivotaltracker.com/story/show/175261981)
- unified design of area cards in explore and MyRW. [#175261981](https://www.pivotaltracker.com/story/show/175261981)
- widget-editor@2.4.1
- maintenance: moved `webpack` from `dependencies` to `devDependencies`.
- widget-editor: updated RW-adapter to accept app's params (like API url).
- maintenance: updated `eslint` and its plugins. [#174977793](https://www.pivotaltracker.com/story/show/174977793)

### Fixed
- intermittent area edition bug where the area to edit wasn't loaded properly. [#175261981](https://www.pivotaltracker.com/story/show/175261981)
- widget-editor: fixed a WE crash when the user changes the visualization type in a map-only widget. [#175165737](https://www.pivotaltracker.com/story/show/175165737)
- admin: in layer edition, the interactivity wasn't being applied on first load until the user modifies it for first time. Now it does.
- widget-editor: fixed error updating fields. [#174996497](https://www.pivotaltracker.com/story/show/174996497)
- widget-editor: override of default disabled features. [#174930015](https://www.pivotaltracker.com/story/show/174930015)

### Removed
- maintenance: removed unused `next-progressbar` and `webpackbar` dev dependencies.
- maintenance: removed unused `colors` dev dependency.
- widget-editor: removed deprecated assets. [#174952659](https://www.pivotaltracker.com/story/show/174952659)

## [2.2.1] - 2020-02-03
### Fixed
- Fix issue with dashboard detail updating only partially. [[code]](https://github.com/resource-watch/resource-watch/pull/1229)

## [2.2.0] - 2020-02-03
### Added
- Added is featured option to admin/dashboards new/edit page. [[code]](https://github.com/resource-watch/resource-watch/pull/1182)
- Modal added to Planet Pulse page plus other related updates. [[code]](https://github.com/resource-watch/resource-watch/pull/1188)
- Redirects to dashboard pages from old deprecated topic pages. [[code]](https://github.com/resource-watch/resource-watch/pull/1224)

### Fixed
- Fix for metadata form bug. [[code]](https://github.com/resource-watch/resource-watch/pull/1183)
- Fix for an issue with the delete link in the dashboards table from the back office. [[code]](https://github.com/resource-watch/resource-watch/pull/1186)
- Restore backoffice interaction to provide column names for selection. [[code]](https://github.com/resource-watch/resource-watch/pull/1187)
- Fixed vizualization bug - temporality load widget (new vizualization). [[code]](https://github.com/resource-watch/resource-watch/pull/1187)
- Get involved page - style fix. [[code]](https://github.com/resource-watch/resource-watch/pull/1191)
- Planet pulse - css dropdown menu fix (responsive). [[code]](https://github.com/resource-watch/resource-watch/pull/1193)
- Fix the problem when dialogs temporary load when the page loads first time. [[code]](https://github.com/resource-watch/resource-watch/pull/1195)
- Fix width for the main page subheader box. [[code]](https://github.com/resource-watch/resource-watch/pull/1201)
- Fix explore detail buttons not appearing. [[code]](https://github.com/resource-watch/resource-watch/pull/1202)
- Fix charts overflowing in explore cards. [[code]](https://github.com/resource-watch/resource-watch/pull/1206) 
- Fix "More" link to point to dashboards gallery. [[code]](https://github.com/resource-watch/resource-watch/pull/1207) 
- Fix planet pulse dropdown native menu visibility. [[code]](https://github.com/resource-watch/resource-watch/pull/1209)
- Dashboard page link fix + myrw dashboard preview fix. [[code]](https://github.com/resource-watch/resource-watch/pull/1212)
- Fix: set the default layer on open in map click. [[code]](https://github.com/resource-watch/resource-watch/pull/1213)

### Changed
- Planet pulse: remove obsolete "Forest clearing" layer. [[code]](https://github.com/resource-watch/resource-watch/pull/1181)
- Update all routes (header, footer, dashboard gallery) to dashboard dynamic routes (from API). Removed topics routes. [[code]](https://github.com/resource-watch/resource-watch/pull/1185)
- Home page - topics section replaced by featured dashboards section. [[code]](https://github.com/resource-watch/resource-watch/pull/1192)
- Layers service refactored to comply with new approach for services. [[code]](https://github.com/resource-watch/resource-watch/pull/1194)
- Added unsafe prefix to deprecated methods. [[code]](https://github.com/resource-watch/resource-watch/pull/1197)
- Some updates to layers displayed in Planet Pulse. [[code]](https://github.com/resource-watch/resource-watch/pull/1198)
- Minor updates to blog feed to load new Spotlight category. [[code]](https://github.com/resource-watch/resource-watch/pull/1199)
- Minor change to Pulse pop up text. [[code]](https://github.com/resource-watch/resource-watch/pull/1200)
- `explore-actions` refactored to use services methods instead of explicit calls to `fetch`. [[code]](https://github.com/resource-watch/resource-watch/pull/1203)
- Refactor of `pages` service to use axios. [[code]](https://github.com/resource-watch/resource-watch/pull/1210)
- Remove unused passport dependencies. [[code]](https://github.com/resource-watch/resource-watch/pull/1214)
- Changed preview url for admin dashboards. [[code]](https://github.com/resource-watch/resource-watch/pull/1215)
- Support for cloning topics into dashboards removed. [[code]](https://github.com/resource-watch/resource-watch/pull/1218)
- Dashboards "More" links removed. [[code]](https://github.com/resource-watch/resource-watch/pull/1220)
- Show dashboards gallery section only when there is content for it. [[code]](https://github.com/resource-watch/resource-watch/pull/1221)
- Remove button to clone a topic when creating a dashboard. [[code]](https://github.com/resource-watch/resource-watch/pull/1226)

## [2.1.10] - 2019-12-11
### Added
- Log site search events with GA [[code]](https://github.com/resource-watch/resource-watch/pull/1170)

### Fixed
- Fix for a problem in the `TagsForm` component [[code]](https://github.com/resource-watch/resource-watch/pull/1162)
- Several subscriptions issues fixed in [[code]](https://github.com/resource-watch/resource-watch/pull/1156)
- Fix for a couple minor errors in Areas of interest --> subscriptions [[code]](https://github.com/resource-watch/resource-watch/pull/1168)

### Changed
- API communication services refactor, including improvements such as: 
    - use of [Axios](https://github.com/axios/axios) in all requests
	- better error handling
	- better error logs
	- serialize responses when applicable using the component `WRISerializer`
	The code for these changes can be found here: [[1]](https://github.com/resource-watch/resource-watch/pull/1155), [[2]](https://github.com/resource-watch/resource-watch/pull/1157), [[3]](https://github.com/resource-watch/resource-watch/pull/1162), [[4]](https://github.com/resource-watch/resource-watch/pull/1164)
- Subscriptions are now handled following the standardized agreed approach, i.e. one subscription entity should be created in the API for each combination of [area, dataset, subscription type] [[code]](https://github.com/resource-watch/resource-watch/pull/1156)
- Next.js updated to the latest version `9.1.1` [[code]](https://github.com/resource-watch/resource-watch/pull/1161). More info about the changes included can be found [here](https://nextjs.org/blog/next-9-1)
- Set origin parameter when signing up user on the API [[code]](https://github.com/resource-watch/resource-watch/pull/1166)
- Delete insights-related obsolete code and files across the app [[code]](https://github.com/resource-watch/resource-watch/pull/1174)

## [2.1.9] - 2019-09-30
### Added
- Hooks linter & Staged lint [[code]](https://github.com/resource-watch/resource-watch/pull/1135)
- Add checkbox to newsletter page [[code]](https://github.com/resource-watch/resource-watch/pull/1143)

### Fixed
- Use metadata title in subscribe to alerts modal from explore detail [[code]](https://github.com/resource-watch/resource-watch/pull/1136)
- Subscriptions fixes [[code]](https://github.com/resource-watch/resource-watch/pull/1139)
- Fix bounds and styles in area cards [[code]](https://github.com/resource-watch/resource-watch/pull/1140)
- Fix area update and fields displayed in form [[code]](https://github.com/resource-watch/resource-watch/pull/1141)
- Fix area creation [[code]](https://github.com/resource-watch/resource-watch/pull/1142)
- Fix subscriptions' preview title [[code]](https://github.com/resource-watch/resource-watch/pull/1147)
- Fix for content shown in the topics tooltip from the navigation bar [[code]](https://github.com/resource-watch/resource-watch/pull/1148)

### Changed
- Adds Cesium navigation styles externally [[code]](https://github.com/resource-watch/resource-watch/pull/1131)
- small patch to edit sentence on newsletter ty page [[code]](https://github.com/resource-watch/resource-watch/pull/1138)

## [2.1.8] - 2019-09-16
### Added
- Specify order in which layers should appear on Explore [[code]](https://github.com/resource-watch/resource-watch/pull/1027)
- Newsletter thank you page [[code]](https://github.com/resource-watch/resource-watch/pull/1103)
- Expandable table of contents in FAQs [[code]](https://github.com/resource-watch/resource-watch/pull/1107)
- Applications read-only field added to dataset form in the back office [[code]](https://github.com/resource-watch/resource-watch/pull/1113)

### Fixed
- Fix for error saving widgets from dataset detail page [[code]](https://github.com/resource-watch/resource-watch/pull/1099)
- Fix for email share icon dissapearance [[code]](https://github.com/resource-watch/resource-watch/pull/1100)
- Issue with location search in Explore fixed [[code]](https://github.com/resource-watch/resource-watch/pull/1104)
- Fix placeholder and improve text of Environment field in Layer form [[code]](https://github.com/resource-watch/resource-watch/pull/1105)
- Fix issue with widget creation in MyRW [[code]](https://github.com/resource-watch/resource-watch/pull/1115)
- Fix related to the widget editor and how we infer is a widget is of type map or not [[code]](https://github.com/resource-watch/resource-watch/pull/1117)
- Fix for an issue that prevented some fields to appear in the dataset form page from the back office (e.g. the published check box). Fix related to the widget editor and how we infer is a widget is of type map or not [[code]](https://github.com/resource-watch/resource-watch/pull/1118)
- Prevent wrong env values to be set when creating/updating subscriptions [[code]](https://github.com/resource-watch/resource-watch/pull/1120)
- Fix error thrown when saving edit dataset page [[code]](https://github.com/resource-watch/resource-watch/pull/1121)
- Fix issue consisting of subscriptions not showing up in the AOI section [[code]](https://github.com/resource-watch/resource-watch/pull/1123)
- Fix for dataset creation issue [[code]](https://github.com/resource-watch/resource-watch/pull/1124)
- MyRW visualizations --> Edit button link logic fixed [[code]](https://github.com/resource-watch/resource-watch/pull/1128)

### Changed
- Datasets and visualizations from collections link to different pages depending on user and ownership [[code]](https://github.com/resource-watch/resource-watch/pull/1106)
- Upgrade widget editor to 1.4.5 [[code]](https://github.com/resource-watch/resource-watch/pull/1112)
- Bump mixin-deep from 1.3.1 to 1.3.2 [[code]](https://github.com/resource-watch/resource-watch/pull/1114)
- Remove front-end 'wall' preventing unpublished datasets to be visible in Explore detail [[code]](https://github.com/resource-watch/resource-watch/pull/1118)
- The user should stay in the dataset form page after clicking on save/update [[code]](https://github.com/resource-watch/resource-watch/pull/1118)
- Myrw --> Vizualizations: show most recent widgets first [[code]](https://github.com/resource-watch/resource-watch/pull/1122)
- Upgrade to next@9.0.5 [[code]](https://github.com/resource-watch/resource-watch/pull/1126)
- Bump lodash from 4.17.11 to 4.17.13 [[code]](https://github.com/resource-watch/resource-watch/pull/1127)



## [2.1.7] - 2019-08-19
### Fixed
- Fixes interactions layer issue in admin [[code]](https://github.com/resource-watch/resource-watch/pull/1094)
- Fixes edge case for layer interactions [[code]](https://github.com/resource-watch/resource-watch/pull/1095)

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
