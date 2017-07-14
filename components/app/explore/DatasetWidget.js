import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { Link, Router } from 'routes';

// Components
import Title from 'components/ui/Title';
import Button from 'components/ui/Button';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import DatasetLayerChart from 'components/app/explore/DatasetLayerChart';
import DatasetPlaceholderChart from 'components/app/explore/DatasetPlaceholderChart';
import { toggleDatasetActive, setUrlParams, setDatasetsHidden } from 'redactions/explore';

class DatasetWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
      dataset: props.dataset,
      widget: props.widget,
      layer: props.layer,
      hasWidget: !!props.widget,
      hasLayer: !!props.layer,
      mode: props.mode
    };

    // BINDINGS
    this.triggerToggleLayer = this.triggerToggleLayer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.active,
      dataset: nextProps.dataset,
      widget: nextProps.widget,
      layer: nextProps.layer,
      hasWidget: !!nextProps.widget,
      hasLayer: !!nextProps.layer,
      mode: nextProps.mode
    });
  }

  /**
   * HELPERS
   * - hideLayer
   * - getWidgetOrLayer
   * - getDescription
   * - getButton
  */
  getButton() {
    const { active, layer } = this.state;
    const buttonText = (active) ? 'Active' : 'Add to map';
    const buttonClass = (active) ? '-active' : '';

    if (layer) {
      return (
        <Button
          properties={{
            className: `-primary -fullwidth ${buttonClass}`
          }}
          onClick={this.triggerToggleLayer}
        >
          {buttonText}
        </Button>
      );
    }
    return (
      <Button
        properties={{
          disabled: true,
          className: '-primary -fullwidth -disabled'
        }}
        onClick={this.triggerToggleLayer}
      >
        Not displayable
      </Button>

    );
  }

  getWidgetOrLayer() {
    if (this.state.hasWidget) {
      return {
        ...this.state.widget.attributes,
        id: this.state.widget.id
      };
    }
    if (this.state.hasLayer) {
      return {
        ...this.state.layer.attributes,
        id: this.state.layer.id
      };
    }
    return null;
  }

  getDescription(_text) {
    let text = _text;
    if (typeof text === 'string' && text.length > 70) {
      text = text.replace(/^(.{70}[^\s]*).*/, '$1');
      return `${text}...`;
    }
    return text;
  }

  hideLayer(dataset) {
    let newLayersHidden = this.props.layersHidden.slice();
    if (this.props.layersHidden.includes(dataset)) {
      newLayersHidden = this.props.layersHidden.filter(l => l !== dataset);
    } else {
      newLayersHidden.push(dataset);
    }

    this.props.setDatasetsHidden(newLayersHidden);
  }

  /**
   * UI EVENTS
   * - triggerToggleLayer (e)
   * - handleClick
  */
  triggerToggleLayer() {
    const { dataset } = this.state;
    this.props.toggleDatasetActive(dataset.id);
    if (this.props.layersHidden.includes(dataset.id)) {
      this.hideLayer(dataset.id);
    }
  }
  @Autobind
  handleClick(event) {
    if (event.target.type !== 'submit') {
      Router.pushRoute('explore_detail', { id: this.props.dataset.id });
    }
  }

  render() {
    const { hasWidget, hasLayer, mode, dataset } = this.state;
    const { showActions } = this.props;
    const gridMode = (mode === 'grid');
    const element = this.getWidgetOrLayer();

    return (
      <div
        className={`c-dataset-list-item -${mode}`}
        onClick={this.handleClick}
      >
        {/* If it has widget we want to renderize the default widget one */}
        {hasWidget && gridMode &&
          <DatasetWidgetChart widget={element} mode="thumbnail" />
        }
        {/* If it doesn't have widget but has layer we want to renderize the default layer one */}
        {!hasWidget && hasLayer && gridMode &&
          <DatasetLayerChart layer={element} />
        }

        {!hasWidget && !hasLayer && gridMode &&
          <DatasetPlaceholderChart />
        }

        <div className="info">
          <div className="detail">
            {/* Title */}
            <Title className="-default -primary">
              <Link
                route={'explore_detail'}
                params={{ id: dataset.id }}
              >
                <a className="explore_detail_link">{dataset.attributes.name}</a>
              </Link>
            </Title>

            {/* Description */}
            {dataset.attributes.metadata && (dataset.attributes.metadata.length > 0) &&
             dataset.attributes.metadata[0].attributes.info &&
             dataset.attributes.metadata[0].attributes.info.functions &&
             <p>{this.getDescription(dataset.attributes.metadata[0].attributes.info.functions)}</p>
            }

            {/* Source */}
            {dataset.attributes.metadata && (dataset.attributes.metadata.length > 0)
              && dataset.attributes.metadata[0].attributes.source &&
              <p>Source: {dataset.attributes.metadata[0].attributes.source}</p>
            }
          </div>
          <div className="actions">
            {/* Layer Button */}
            {showActions && this.getButton()}
          </div>

        </div>
      </div>
    );
  }
}

DatasetWidget.propTypes = {
  // STATE
  active: PropTypes.bool,
  layersHidden: PropTypes.array,
  dataset: PropTypes.object,
  widget: PropTypes.object,
  layer: PropTypes.object,
  mode: PropTypes.string,
  showActions: PropTypes.bool,
  // ACTIONS
  toggleDatasetActive: PropTypes.func,
  setDatasetsHidden: PropTypes.func
};

const mapStateToProps = state => ({
  layersHidden: state.explore.datasets.hidden
});

const mapDispatchToProps = dispatch => ({
  toggleDatasetActive: (id) => {
    dispatch(toggleDatasetActive(id));
    dispatch(setUrlParams());
  },
  setDatasetsHidden: (id) => { dispatch(setDatasetsHidden(id)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DatasetWidget);
