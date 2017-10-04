# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2017-10-11

### Fixed
- Planet pulse dropdowns have now a z-index that makes them be displayed on top of the layer card
- Planet pulse 3D layers get their respective markers using the info located in pulseConfig
- Planet pulse globe tooltips show only the fields that are specified in the object interactionConfig
- Bar charts properly handle `null` and negative values
- Pie charts are now responsive and are properly displayed as thumbnails (newer charts only)

### Added
- Planet pulse globe tooltips have hyperlinks for url values
- New prototype of tags tooltip in Explore
- New search input for the filter tooltip in the Widget Editor
- Implementation of decision tree to get visualizations by dataset. [PDF](https://vizzuality.slack.com/files/U4C2Q99RB/F79L7J7UL/rw_-_widget_creation.pdf)
- New command to check datasets for widget editor `yarn run check-datasets`
- Vega Chart as component
- Added Vega Chart Thumbnail with theme configuration

### Changed
