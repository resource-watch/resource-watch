import React from 'react';
import WidgetTable from 'components/widget/table/WidgetTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

class WidgetIndex extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="column small-12">
          <Title className="-huge -p-primary">
            Widgets
          </Title>

          <ButtonContainer
            className="-end"
            buttons={[{
              label: 'New +',
              path: `/datasets/${gon.data.dataset_id}/widgets/new`,
              className: ''
            }]}
          />

          <WidgetTable
            application={['rw']}
            dataset={gon.data.dataset_id}
            authorization={gon.data.authorization}
          />
        </div>
      </div>
    );
  }
}
