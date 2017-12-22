
export function findTagInTree(tree, tag) {
  if (tree.value === tag) {
    return tree;
  } else if (tree.children && tree.children && tree.children.length > 0) {
    let found = false;
    for (let i = 0; i < tree.children.length && !found; i++) {
      found = findTagInTree(tree.children[i], tag);
    }
    return found;
  } else { // eslint-disable-line no-else-return
    return false;
  }
}

export function findTagInSelectorTree(tree, tag) {
  let found = false;
  for (let i = 0; tree && i < tree.length && !found; i++) {
    found = findTagInTree(tree[i], tag);
  }
  return found;
}

/**
 * Sets checked values for selector based on previous one chosen.
 *
 * @param {Object} tree used to populate selectors. Contains all options available.
 * @param {Object[]} elements Contains values to be selected in the data tree.
 */
export function selectElementsFromTree(tree = {}, elements = [], deselect = false) {
  let found = false; // We're using this loop because indexOf was finding elements
  // that were substrings, e.g. "co" and "economic" when only "economic" should have been found
  for (let i = 0; i < elements.length && !found; i++) {
    if (elements[i] === tree.value) {
      tree.checked = !deselect; // eslint-disable-line no-param-reassign
      found = true;
    }
  }

  (tree.children || []).forEach((child) => {
    this.selectElementsFromTree(child, elements, deselect);
  });
}
