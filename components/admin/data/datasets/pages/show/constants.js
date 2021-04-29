export const DATASET_SUBTABS = [{
  label: 'Edit dataset',
  value: 'edit',
  route: '/admin/data/datasets/{{id}}/edit',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'edit' },
}, {
  label: 'Metadata',
  value: 'metadata',
  route: '/admin/data/datasets/{{id}}/metadata',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'metadata' },
}, {
  label: 'Tags',
  value: 'tags',
  route: '/admin/data/datasets/{{id}}/tags',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'tags' },
}, {
  label: 'Widgets',
  value: 'widgets',
  route: '/admin/data/datasets/{{id}}/widgets',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'widgets' },
}, {
  label: 'Layers',
  value: 'layers',
  route: '/admin/data/datasets/{{id}}/layers',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'layers' },
}];

export default { DATASET_SUBTABS };
