export function getDatasetMetadata(dataset) {
  return dataset.metadata || {};
}

export function getDatasetName(dataset) {
  const metadata = dataset.metadata || {};
  return metadata.info && metadata.info.name ? metadata.info.name : dataset.name;
}

export function getDatasetDefaultEditableWidget(dataset) {
  const widget = dataset.widget || [];
  return widget.find(w => w.defaultEditableWidget === true);
}
