import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StickyContainer, Sticky } from 'react-sticky';

// Redux
import { connect } from 'react-redux';

// Components
import CollectionListAside from 'components/collection-list-aside';
import DatasetsList from 'components/datasets/list/DatasetsList';
import MyRWDatasetsStarred from 'components/app/myrw/datasets/MyRWDatasetsStarred';

// Constants
const DATASET_SUBTABS = [{
  label: 'My datasets',
  value: 'my_datasets',
  route: 'myrw',
  params: { tab: 'datasets', subtab: 'my_datasets' }
}, {
  label: 'Favourites',
  value: 'favourites',
  route: 'myrw',
  params: { tab: 'datasets', subtab: 'favourites' }
}];

class DatasetsIndex extends PureComponent {
  static defaultProps = {
    subtab: 'my_datasets'
  };

  static propTypes = {
    id: PropTypes.string,
    subtab: PropTypes.string,
    user: PropTypes.object
  };

  render() {
    const { id, user, subtab } = this.props;

    return (
      <div className="c-datasets-index">
        <StickyContainer>
          <div className="row l-row">
            <div className="columns small-12 medium-3">
              <Sticky>
                {
                  ({ style }) => (
                    <div style={style}>
                      <CollectionListAside
                        additionalTabs={DATASET_SUBTABS}
                        selected={subtab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              {subtab === 'starred' &&
                <MyRWDatasetsStarred user={user} dataset={id} embed />
              }

              {subtab === 'my_datasets' &&
                <DatasetsList
                  getDatasetsFilters={{
                    userId: user.id
                  }}
                  routes={{
                    index: 'myrw',
                    detail: 'myrw_detail'
                  }}
                />
              }
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DatasetsIndex);
