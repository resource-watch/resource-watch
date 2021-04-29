export const WIDGET_SUBTABS = [{
  label: 'Edit widget',
  value: 'edit',
  route: '/admin/data/widgets/{{id}}/edit',
  params: { subtab: 'edit' },
}, {
  label: 'Metadata',
  value: 'metadata',
  route: '/admin/data/widgets/{{id}}/metadata',
  params: { subtab: 'metadata' },
}];

export default { WIDGET_SUBTABS };
