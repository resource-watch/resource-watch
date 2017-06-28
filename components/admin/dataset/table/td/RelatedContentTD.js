import React from 'react';
import classnames from 'classnames';

// Next components
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';

class RelatedContentTD extends React.Component {

  render() {
    const { row, index } = this.props;

    return (
      <td key={index} className="related-content">
        <ul>
          <li>
            <Link route="admin_data_detail" params={{ tab: 'datasets', id: row.id, subtab: 'widgets' }}>
              <a className={classnames({ '-empty': (!row.widget || !row.widget.length) })}>
                <Icon name="icon-hash" className="c-icon -smaller" />
                <span>{(row.widget && row.widget.length) || 0}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link route="admin_data_detail" params={{ tab: 'datasets', id: row.id, subtab: 'metadata' }}>
              <a className={classnames({ '-empty': (!row.metadata || !row.metadata.length) })}>
                <Icon name="icon-hash" className="c-icon -smaller" />
                <span>{(row.metadata && row.metadata.length) || 0}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link route="admin_data_detail" params={{ tab: 'datasets', id: row.id, subtab: 'vocabularies' }}>
              <a className={classnames({ '-empty': (!row.vocabulary || !row.vocabulary.length) })}>
                <Icon name="icon-hash" className="c-icon -smaller" />
                <span>{(row.vocabulary && row.vocabulary.length) || 0}</span>
              </a>
            </Link>
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
