import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class AlertsTable extends PureComponent {
  static propTypes = {
    alerts: PropTypes.shape({
      title: PropTypes.string.isRequired,
      keys: PropTypes.array.isRequired,
      data: PropTypes.array,
    }).isRequired,
  }

  render() {
    const { alerts } = this.props;
    const { title, keys, data } = alerts;

    return (
      <div className="c-subscription-preview-table">
        <h3>{title}</h3>
        <div className="disclaimer-container">
          This is an example of what an alert subscription might look like. The information here is intended as an example only and does not represent the current status of this alert in your area of interest.
        </div>
        {!data.length && (
          <span>Data no available</span>
        )}
        {!!data.length && (
          <table className="c-table">
            <thead>
              <tr className="preview_table_captions">
                {(keys || []).map((_key, o) => (
                  <th key={`${_key}-${o}`}>
                    {_key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {(keys || []).map((k, x) => (
                    <td className="preview-table-element" key={`${row[k]}-${x}`}>
                      {row[k]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default AlertsTable;
