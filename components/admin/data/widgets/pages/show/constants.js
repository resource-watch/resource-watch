export const WIDGET_SUBTABS = [{
  label: 'Edit widget',
  value: 'edit',
  route: 'admin_data_detail',
  params: { tab: 'widgets', id: '{{id}}', subtab: 'edit' },
}, {
  label: 'Metadata',
  value: 'metadata',
  route: 'admin_data_detail',
  params: { tab: 'widgets', id: '{{id}}', subtab: 'metadata' },
}];

export default { WIDGET_SUBTABS };
