# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2017-10-11

### Fixed
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
- Opacity selector for all layers

### Added
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
- Added map widgets to dashboards
- Added text widgets to dashboards
- MapControls component added
- BasemapControl component added
- ShareControl component added
- Added new endpoint `profiles` to save and upload profile images in S3 service

### Changed

- Planet pulse: extra point light added to the scene so that colors can be perceived more easily
- Tooltips of the charts are now based on the [`interaction_config` object](https://github.com/resource-watch/notebooks/blob/master/ResourceWatch/Api_definition/widget_definition.ipynb) of the `widgetConfig`
- WRI logo separate from partner carousel.
- Footer style's.
- Better validations for widgetEditor
- Unique components for Legend and Map
