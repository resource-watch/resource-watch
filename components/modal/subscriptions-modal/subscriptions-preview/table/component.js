import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class AlertsTable extends PureComponent {
  static propTypes = {
    alerts: PropTypes.shape({
      title: PropTypes.string.isRequired,
      keys: PropTypes.array.isRequired,
      data: PropTypes.array
    }).isRequired
  }

  render() {
    const { alerts } = this.props;
    const { title, keys, data } = alerts;

    return (
      <div className="c-subscription-preview-table">
        <h3>{title}</h3>
        {!data.length && (
          <span>Data no available</span>
        )}
        {!!data.length && (
          <table className="c-table">
            <thead>
              <tr>
                {(keys || []).map((_key, o) => (
                  <th key={`${_key}-${o}`}>
                    {_key}
                  </th>))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {(keys || []).map((k, x) => (
                    <td key={`${row[k]}-${x}`}>
                      {row[k]}
                    </td>))}
                </tr>))}
            </tbody>
          </table>)}
      </div>
    );
  }
}

export default AlertsTable;
