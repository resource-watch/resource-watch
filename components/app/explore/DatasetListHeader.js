import React from 'react';
import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import { connect } from 'react-redux';

import { setDatasetsMode} from 'redactions/explore';

class DatasetListHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mode: props.mode,
      list: props.list
    };

    // BINDINGS
    this.triggerSetDatasetMode = this.triggerSetDatasetMode.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mode: nextProps.mode,
      list: nextProps.list
    });
  }

  /**
   * UI EVENTS
   * - triggerSetDatasetMode (e)
  */
  triggerSetDatasetMode(e) {
    if (this.state.mode !== e.currentTarget.dataset.mode) {
      this.props.setDatasetsMode(e.currentTarget.dataset.mode);
    }
  }

  render() {
    const { mode, list } = this.state;

    return (
      <div className="c-dataset-list-header">
        <div className="total">
          {list.length} datasets
        </div>
        <div className="actions">
          <div className="mode-container">
            <Button
              properties={{
                'data-mode': 'grid',
                className: (mode === 'grid') ? '-active' : ''
              }}
              onClick={this.triggerSetDatasetMode}
            >
              <Icon name="icon-view-grid" />
            </Button>
            <Button
              properties={{
                'data-mode': 'list',
                className: (mode === 'list') ? '-active' : ''
              }}
              onClick={this.triggerSetDatasetMode}
            >
              <Icon name="icon-view-list" />
            </Button>
          </div>
          {/* <div className="filter-container">
            Filters
          </div> */}
        </div>
      </div>
    );
  }
}

DatasetListHeader.propTypes = {
  // STATE
  mode: React.PropTypes.string,
  list: React.PropTypes.array,
  // ACTIONS
  setDatasetsMode: React.PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  setDatasetsMode: (mode) => {
    dispatch(setDatasetsMode(mode));
  }
});

export default connect(null, mapDispatchToProps)(DatasetListHeader);
