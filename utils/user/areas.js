export function mergeSubscriptions(areas, subs, datasets) {
  // Fetch data for the datasets needed
  const datasetsWithLabels = datasets.map(elem => ({
    id: elem.id,
    label: elem.attributes.metadata && elem.attributes.metadata[0] &&
      elem.attributes.metadata[0].attributes.info &&
      elem.attributes.metadata[0].attributes.info.name ?
      elem.attributes.metadata[0].attributes.info.name :
      elem.attributes.name
  }));

  // Merge datasets with labels inside of subscriptions
  subs.forEach((sub) => {
    sub.attributes.datasets = sub.attributes.datasets
      .map(val => datasetsWithLabels.find(elem => elem.id === val));
  });

  // Load datasets info
  subs.forEach((sub) => {
    const tempArea = areas.find(val => val.id === sub.attributes.params.area);
    if (tempArea) {
      tempArea.subscription = sub;
    }
  });

  return areas;
}
