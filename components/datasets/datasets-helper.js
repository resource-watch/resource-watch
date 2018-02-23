export function parseDataset(dataset) {
  const d = Object.assign({}, { ...dataset.attributes, id: dataset.id });
  if (d.metadata) {
    const metadata = d.metadata.map(m => ({
      ...m.attributes,
      ...m.attributes.info,
      id: m.id
    }));
    d.metadata = metadata && metadata.length ? metadata[0] : {};
  }
  if (d.widget) d.widget = d.widget.map(w => ({ ...w.attributes, id: w.id }));
  if (d.layer) d.layer = d.layer.map(l => ({ ...l.attributes, id: l.id }));
  if (d.vocabulary) d.vocabulary = d.vocabulary.map(v => ({ ...v.attributes, id: v.id }));
  return d;
}
