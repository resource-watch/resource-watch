import React from 'react';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import TetherComponent from 'react-tether';

// Next components
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';

class RelatedContentTD extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      widgetsActive: false,
      vocabulariesActive: false,
      metadataActive: false
    };

    // BINDINGS
    this.toggleTooltip = debounce(this.toggleTooltip.bind(this), 50);
  }

  toggleTooltip(specificDropdown, to) {
    this.setState({
      ...{ widgetsActive: false, vocabulariesActive: false, metadataActive: false },
      [specificDropdown]: to
    });
  }


  render() {
    const { row, index } = this.props;

    return (
      <td key={index} className="related-content">
        <ul>
          <li>
            <TetherComponent
              attachment="bottom center"
              constraints={[{
                to: 'window'
              }]}
              targetOffset="-4px 0"
              classes={{
                element: 'c-tooltip'
              }}
            >
              <Link route="admin_data_detail" params={{ tab: 'datasets', id: row.id, subtab: 'widgets' }}>
                <a
                  className={classnames({ '-empty': (!row.widget || !row.widget.length) })}
                  onMouseEnter={() => this.toggleTooltip('widgetsActive', true)}
                  onMouseLeave={() => this.toggleTooltip('widgetsActive', false)}
                >
                  <Icon name="icon-hash" className="c-icon -smaller" />
                  <span>{(row.widget && row.widget.length) || 0}</span>
                </a>
              </Link>

              {this.state.widgetsActive &&
                <div>
                  <span>{(row.widget && row.widget.length) || 0} widgets</span>
                </div>
              }
            </TetherComponent>
          </li>
          <li>
            <TetherComponent
              attachment="bottom center"
              constraints={[{
                to: 'window'
              }]}
              targetOffset="-4px 0"
              classes={{
                element: 'c-tooltip'
              }}
            >
              <Link route="admin_data_detail" params={{ tab: 'datasets', id: row.id, subtab: 'metadata' }}>
                <a
                  className={classnames({ '-empty': (!row.metadata || !row.metadata.length) })}
                  onMouseEnter={() => this.toggleTooltip('metadataActive', true)}
                  onMouseLeave={() => this.toggleTooltip('metadataActive', false)}
                >
                  <Icon name="icon-hash" className="c-icon -smaller" />
                  <span>{(row.metadata && row.metadata.length) || 0}</span>
                </a>
              </Link>

              {this.state.metadataActive &&
                <div>
                  <span>{(row.metadata && row.metadata.length) || 0} metadata</span>
                </div>
              }
            </TetherComponent>
          </li>
          <li>
            <TetherComponent
              attachment="bottom center"
              constraints={[{
                to: 'window'
              }]}
              targetOffset="-4px 0"
              classes={{
                element: 'c-tooltip'
              }}
            >
              <Link
                route="admin_data_detail"
                params={{ tab: 'datasets', id: row.id, subtab: 'vocabularies' }}
              >
                <a
                  className={classnames({ '-empty': (!row.vocabulary || !row.vocabulary.length) })}
                  onMouseEnter={() => this.toggleTooltip('vocabulariesActive', true)}
                  onMouseLeave={() => this.toggleTooltip('vocabulariesActive', false)}
                >
                  <Icon name="icon-hash" className="c-icon -smaller" />
                  <span>{(row.vocabulary && row.vocabulary.length) || 0}</span>
                </a>
              </Link>

              {this.state.vocabulariesActive &&
                <div>
                  <span>{(row.vocabulary && row.vocabulary.length) || 0} vocabularies</span>
                </div>
              }
            </TetherComponent>
          </li>
        </ul>
      </td>
    );
  }
}

RelatedContentTD.propTypes = {
  row: React.PropTypes.object,
  index: React.PropTypes.string
};

export default RelatedContentTD;
