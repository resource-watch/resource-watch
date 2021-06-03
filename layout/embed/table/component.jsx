import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import Spinner from 'components/ui/Spinner';

// utils
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedTable extends PureComponent {
  render() {
    const { tableData } = this.props;

    const header = tableData && tableData.length > 0 && Object.keys(tableData[0]);
    const isExternal = isLoadedExternally();

    if (isEmpty(tableData)) {
      return (
        <LayoutEmbed
          title="Loading widget..."
          description=""
        >
          <Spinner isLoading className="-light" />
        </LayoutEmbed>
      );
    }

    return (
      <LayoutEmbed>
        <div className="c-embed-table">
          <div className="visualization">
            <div className="table-content c-table">
              {tableData
                && (
                <table>
                  <thead>
                    <tr>
                      {header && header.map((val) => (
                        <th
                          key={`header_${val}`}
                        >
                          {val}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(tableData || []).map((row, i) => (
                      <tr
                        // eslint-disable-next-line react/no-array-index-key
                        key={`row${i}`}
                      >
                        {Object.keys(row).map((column) => (<td key={`td${column}`}>{row[column]}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
            </div>
          </div>
          {isExternal
            && (
            <img
              className="embed-logo"
              height={21}
              width={129}
              src="/static/images/logo-embed.png"
              alt="Resource Watch"
            />
            ) }
        </div>
      </LayoutEmbed>
    );
  }
}

LayoutEmbedTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
};

export default LayoutEmbedTable;
