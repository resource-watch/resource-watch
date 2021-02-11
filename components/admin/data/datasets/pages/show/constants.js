export const DATASET_SUBTABS = [{
  label: 'Edit dataset',
  value: 'edit',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'edit' },
}, {
  label: 'Metadata',
  value: 'metadata',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'metadata' },
}, {
  label: 'Tags',
  value: 'tags',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'tags' },
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'widgets' },
}, {
  label: 'Layers',
  value: 'layers',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'layers' },
}];

export default { DATASET_SUBTABS };
