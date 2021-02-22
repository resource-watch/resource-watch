import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import Tether from 'react-tether';
import { connect } from 'react-redux';

// components
import Icon from 'components/ui/icon';

class DatasetsRelatedContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widgetsActive: false,
      layersActive: false,
      metadataActive: false,
      vocabulariesActive: false,
    };

    // BINDINGS
    this.toggleTooltip = debounce(this.toggleTooltip.bind(this), 50);
  }

  BUTTONS = {
    widget: true,
    layer: true,
    metadata: true,
    tags: true,
  }

  toggleTooltip(specificDropdown, to) {
    this.setState({
      ...{
        widgetsActive: false,
        layersActive: false,
        metadataActive: false,
        vocabulariesActive: false,
      },
      [specificDropdown]: to,
    });
  }

  render() {
    const { dataset, user, route } = this.props;
    const buttons = { ...this.BUTTONS, ...this.props.buttons };

    let numberOfTags = 0;
    let knowledgeGraphVoc = null;
    // Calculate the number of tags for the current dataset
    if (dataset.vocabulary && dataset.vocabulary.length) {
      knowledgeGraphVoc = dataset.vocabulary.find((voc) => voc.name === 'knowledge_graph');
      if (knowledgeGraphVoc) {
        numberOfTags = knowledgeGraphVoc.tags.length;
      }
    }

    const isOwnerOrAdmin = (dataset.userId === user.id || user.role === 'ADMIN');

    return (
      <div className="c-related-content">
        <ul>
          {buttons.widget
            && (
            <li>
              <Tether
                attachment="bottom center"
                constraints={[{
                  to: 'window',
                }]}
                targetOffset="-4px 0"
                classes={{
                  element: 'c-tooltip',
                }}
                renderTarget={(ref) => {
                  if (isOwnerOrAdmin) {
                    return (
                      <Link
                        href={`${route}/datasets/${dataset.id}/widgets`}
                        // route={route}
                        // params={{ tab: 'datasets', id: dataset.id, subtab: 'widgets' }}
                      >
                        <a
                          ref={ref}
                          onMouseEnter={() => this.toggleTooltip('widgetsActive', true)}
                          onMouseLeave={() => this.toggleTooltip('widgetsActive', false)}
                        >
                          <Icon name="icon-widget" className="c-icon -small" />
                          <span>{(dataset.widget && dataset.widget.length) || 0}</span>
                        </a>
                      </Link>
                    );
                  }

                  return (
                    <a
                      ref={ref}
                      onMouseEnter={() => this.toggleTooltip('widgetsActive', true)}
                      onMouseLeave={() => this.toggleTooltip('widgetsActive', false)}
                    >
                      <Icon name="icon-widget" className="c-icon -small" />
                      <span>{(dataset.widget && dataset.widget.length) || 0}</span>
                    </a>
                  );
                }}
                renderElement={(ref) => {
                  if (!this.state.widgetsActive) return null;

                  return (
                    <span ref={ref}>
                      {(dataset.widget && dataset.widget.length) || 0}
                      {' '}
                      widgets
                    </span>
                  );
                }}
              />
            </li>
            )}

          {route !== 'myrw_detail' && buttons.layer
            && (
            <li>
              <Tether
                attachment="bottom center"
                constraints={[{
                  to: 'window',
                }]}
                targetOffset="-4px 0"
                classes={{
                  element: 'c-tooltip',
                }}
                renderTarget={(ref) => {
                  if (isOwnerOrAdmin) {
                    return (
                      <Link
                        href={`${route}/datasets/${dataset.id}/layers`}
                        // route={route}
                        // params={{ tab: 'datasets', id: dataset.id, subtab: 'layers' }}
                      >
                        <a
                          ref={ref}
                          onMouseEnter={() => this.toggleTooltip('layersActive', true)}
                          onMouseLeave={() => this.toggleTooltip('layersActive', false)}
                        >
                          <Icon name="icon-layers" className="c-icon -small" />
                          <span>{(dataset.layer && dataset.layer.length) || 0}</span>
                        </a>
                      </Link>
                    );
                  }

                  return (
                    <a
                      ref={ref}
                      onMouseEnter={() => this.toggleTooltip('layersActive', true)}
                      onMouseLeave={() => this.toggleTooltip('layersActive', false)}
                    >
                      <Icon name="icon-layers" className="c-icon -small" />
                      <span>{(dataset.layer && dataset.layer.length) || 0}</span>
                    </a>
                  );
                }}
                renderElement={(ref) => {
                  if (!this.state.layersActive) return null;

                  return (
                    <span ref={ref}>
                      {(dataset.layer && dataset.layer.length) || 0}
                      {' '}
                      layers
                    </span>
                  );
                }}
              />
            </li>
            )}

          {buttons.metadata
            && (
            <li>
              <Tether
                attachment="bottom center"
                constraints={[{
                  to: 'window',
                }]}
                targetOffset="-4px 0"
                classes={{
                  element: 'c-tooltip',
                }}
                renderTarget={(ref) => {
                  if (isOwnerOrAdmin) {
                    return (
                      <Link
                        href={`${route}/datasets/${dataset.id}/metadata`}
                        // route={route}
                        // params={{ tab: 'datasets', id: dataset.id, subtab: 'metadata' }}
                      >
                        <a
                          ref={ref}
                          className={classnames({ '-empty': (!dataset.metadata || !dataset.metadata.length) })}
                          onMouseEnter={() => this.toggleTooltip('metadataActive', true)}
                          onMouseLeave={() => this.toggleTooltip('metadataActive', false)}
                        >
                          <Icon name="icon-metadata" className="c-icon -small" />
                          <span>{(dataset.metadata && dataset.metadata.length) || 0}</span>
                        </a>
                      </Link>
                    );
                  }

                  return (
                    <a
                      ref={ref}
                      className={classnames({ '-empty': (!dataset.metadata || !dataset.metadata.length) })}
                      onMouseEnter={() => this.toggleTooltip('metadataActive', true)}
                      onMouseLeave={() => this.toggleTooltip('metadataActive', false)}
                    >
                      <Icon name="icon-metadata" className="c-icon -small" />
                      <span>{(dataset.metadata && dataset.metadata.length) || 0}</span>
                    </a>
                  );
                }}
                renderElement={(ref) => {
                  if (!this.state.metadataActive) return null;

                  return (
                    <span ref={ref}>
                      {(dataset.metadata && dataset.metadata.length) || 0}
                      {' '}
                      metadata
                    </span>
                  );
                }}
              />
            </li>
            )}

          {route !== 'myrw_detail' && buttons.tags
            && (
            <li>
              <Tether
                attachment="bottom center"
                constraints={[{
                  to: 'window',
                }]}
                targetOffset="-4px 0"
                classes={{
                  element: 'c-tooltip',
                }}
                renderTarget={(ref) => {
                  if (isOwnerOrAdmin) {
                    return (
                      <Link
                        href={`${route}/datasets/${dataset.id}/tags`}
                        // route={route}
                        // params={{ tab: 'datasets', id: dataset.id, subtab: 'tags' }}
                      >
                        <a
                          ref={ref}
                          className={classnames({ '-empty': (!knowledgeGraphVoc) })}
                          onMouseEnter={() => this.toggleTooltip('vocabulariesActive', true)}
                          onMouseLeave={() => this.toggleTooltip('vocabulariesActive', false)}
                        >
                          <Icon name="icon-type" className="c-icon -smaller" />
                          <span>{numberOfTags}</span>
                        </a>
                      </Link>
                    );
                  }

                  return (
                    <a
                      ref={ref}
                      className={classnames({ '-empty': (!knowledgeGraphVoc) })}
                      onMouseEnter={() => this.toggleTooltip('vocabulariesActive', true)}
                      onMouseLeave={() => this.toggleTooltip('vocabulariesActive', false)}
                    >
                      <Icon name="icon-type" className="c-icon -smaller" />
                      <span>{numberOfTags}</span>
                    </a>
                  );
                }}
                renderElement={(ref) => {
                  if (!this.state.vocabulariesActive) return null;

                  return (
                    <span ref={ref}>
                      {numberOfTags}
                      {' '}
                      tags
                    </span>
                  );
                }}
              />
            </li>
            )}
        </ul>
      </div>
    );
  }
}

DatasetsRelatedContent.propTypes = {
  user: PropTypes.object,
  dataset: PropTypes.object,
  route: PropTypes.string,
  buttons: PropTypes.object,
};

export default connect(
  (state) => ({
    user: state.user,
  }),
)(DatasetsRelatedContent);
