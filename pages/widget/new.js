import React from 'react';
import WidgetForm from 'components/widget/form/WidgetForm';
import Title from 'components/ui/Title';

export default class WidgetNew extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="column small-12">
          <Title className="-huge -p-primary">
            New Widget
          </Title>
          <WidgetForm
            application={['rw']}
            authorization={gon.data.authorization}
            dataset={gon.data.dataset_id}
            onSubmit={() => window.location = `/datasets/${gon.data.dataset_id}/widgets`}
          />
        </div>
      </div>
    );
  }
}
