import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';


// Services
import UserService from 'services/UserService';
import WidgetService from 'services/WidgetService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetList from 'components/widgets/WidgetList';
import Icon from 'components/ui/Icon';
import CustomSelect from 'components/ui/CustomSelect';

class MyRWWidgetsMy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      myWidgetsLoaded: false,
      myWidgets: null,
      mode: 'grid',
      orderDirection: 'asc',
      selectedWidgetCollection: 'All collections',
      widgetCollections: []
    };

    // User service
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
    this.widgetService = new WidgetService(null, { apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentDidMount() {
    this.loadWidgets();
    this.loadWidgetCollections();
  }

  @Autobind
  setMode(value) {
    this.setState({
      mode: value
    });
  }

  loadWidgetCollections() {
    this.widgetService.getUserWidgetCollections(this.props.user)
      .then((response) => {
        this.setState({ widgetCollections: response });
      });
  }

  loadWidgets() {
    const { orderDirection } = this.state;
    this.setState({
      myWidgetsLoaded: false
    });
    this.widgetService.getUserWidgets(this.props.user.id, true, orderDirection, 'vocabulary')
    .then((response) => {
      this.setState({
        myWidgetsLoaded: true,
        myWidgets: response
      });
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  @Autobind
  handleWidgetRemoved() {
    this.loadWidgets(this.props);
  }

  @Autobind
  handleOrderChange() {
    const newOrder = this.state.orderDirection === 'asc' ? 'desc' : 'asc';
    this.setState({
      orderDirection: newOrder
    },
    () => this.loadWidgets());
  }

  @Autobind
  handleSelectedWidgetCollectionChange(value) {
    this.setState({ selectedWidgetCollection: value.value });
  }

  @Autobind
  handleUpdateWidgetCollections() {
    this.loadWidgets();
    this.loadWidgetCollections();
  }

  render() {
    const {
      myWidgetsLoaded,
      myWidgets,
      mode,
      orderDirection,
      widgetCollections,
      selectedWidgetCollection
    } = this.state;
    const { user } = this.props;

    const widgetCollectionOptionsSet = new Set();
    let widgetCollectionOptionsArray = [{ label: 'All collections', value: 'All collections' }];

    if (widgetCollections.length > 0) {
      widgetCollections
        .map(val => val.tags)
        .forEach(val => val.forEach(val2 => widgetCollectionOptionsSet.add(val2)));
      widgetCollectionOptionsArray = widgetCollectionOptionsArray.concat(
        Array.from(widgetCollectionOptionsSet)
        .map((val) => {
          const newVal = val.replace(`${user.id}-`, '');
          return { label: newVal, value: newVal };
        }));
    }

    let widgetsFiltered = [];
    if (selectedWidgetCollection === 'All collections') {
      widgetsFiltered = myWidgets;
    } else {
      widgetsFiltered = myWidgets && myWidgets.filter((widget) => {
        const vocabulary = widget.attributes.vocabulary;
        if (vocabulary && vocabulary.length > 0) {
          const widgetCollectionsVoc = vocabulary.find(voc => voc.id === 'widget_collections');
          if (widgetCollectionsVoc) {
            let found = false;
            widgetCollectionsVoc.attributes.tags.forEach((tag) => {
              const tagFound = selectedWidgetCollection === tag.replace(`${user.id}-`, '');
              if (tagFound) {
                found = true;
              }
            });
            return found;
          }
          return false;
        }
        return false;
      });
    }

    return (
      <div className="c-myrw-widgets-my">
        <div className="row">
          <div className="column small-12">
            <div className="list-actions">
              <div className="widget-collections-selector">
                <CustomSelect
                  placeholder="Select a widget collection"
                  options={widgetCollectionOptionsArray}
                  onValueChange={this.handleSelectedWidgetCollectionChange}
                  allowNonLeafSelection={false}
                  value={selectedWidgetCollection}
                />
              </div>
              <div className="buttons-container">
                <div
                  role="button"
                  tabIndex={0}
                  className="last-modified-container"
                  onClick={this.handleOrderChange}
                >
                  <a>
                    Last modified
                  </a>
                  {orderDirection === 'asc' &&
                    <Icon className="-small" name="icon-arrow-up" />
                  }
                  {orderDirection === 'desc' &&
                    <Icon className="-small" name="icon-arrow-down" />
                  }
                </div>
                <div className="mode-buttons">
                  <button
                    className={(mode === 'grid' ? '-active' : '')}
                    onClick={() => this.setMode('grid')}
                    title="Grid view"
                  >
                    <Icon name="icon-view-grid" />
                  </button>
                  <button
                    className={(mode === 'list' ? '-active' : '')}
                    onClick={() => this.setMode('list')}
                    title="List view"
                  >
                    <Icon name="icon-view-list" />
                  </button>
                </div>
              </div>
            </div>
            <Spinner
              isLoading={!myWidgetsLoaded}
              className="-fixed -light"
            />
            {myWidgets &&
            <WidgetList
              widgets={widgetsFiltered}
              mode={mode}
              onWidgetRemove={this.handleWidgetRemoved}
              showActions
              showRemove
              showWidgetColllections
              widgetCollections={widgetCollections}
              widgetCollectionsOptions={widgetCollectionOptionsArray.filter(elem => (elem.value !== 'All collections'))}
              onUpdateWidgetCollections={this.handleUpdateWidgetCollections}
            />
            }
            {myWidgets && myWidgets.length === 0 &&
            <div className="no-widgets-div">
              You currently have no widgets
            </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

MyRWWidgetsMy.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(MyRWWidgetsMy);
