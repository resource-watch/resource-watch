
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
