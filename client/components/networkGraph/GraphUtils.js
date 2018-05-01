export function getIcon(nodeType) {
  nodeType = nodeType.toLowerCase();

  const iconPath = '/img/nodeIcons/' + nodeType + '_normal.svg';

  if (nodeType !== '') {
    return iconPath;
  }
  else {
    return '/img/nodeIcons/no_image_normal.svg';
  }
}

export function getIconSelected(nodeType) {
  nodeType = nodeType.toLowerCase();

  const iconPath = '/img/nodeIcons/' + nodeType + '_selected.svg';

  if (nodeType !== '') {
    return iconPath;
  }
  else {
    return '/img/nodeIcons/no_image_selected.svg';
  }
}

