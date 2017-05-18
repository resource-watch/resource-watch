import React from 'react';
import WidgetForm from 'components/widget/WidgetForm';
import Title from 'components/ui/Title';

export default class WidgetEdit extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="column small-12">
          <Title className="-huge -p-primary">
            Edit Widget
          </Title>
          <WidgetForm
            application={['rw']}
            authorization={gon.data.authorization}
            dataset={gon.data.dataset_id}
            widget={gon.data.id}
            onSubmit={() => window.location = `/datasets/${gon.data.dataset_id}/widgets`}
          />
        </div>
      </div>
    );
  }
}
