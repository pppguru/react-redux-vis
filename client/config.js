const global = window.global || {};

export const baseUrl = (global.baseUrl !== undefined) ? global.baseUrl : 'https://demo.ranksoftwareinc.com';
export const loginUrl = global.loginUrl || (baseUrl + '/oauth/authorize');
export const responseType = 'token';
export const clientId = 'taf_dashboard';
export const redirectUri = global.redirectUri || 'http://localhost:3000/#/dashboard?';
export const defaultRoute = global.defaultRoute || '/';

export const applyHierarchicalNetwork = global.applyHierarchicalNetwork;
export const networkGraphDefaultOptions = {
  physics: {
    stabilization: true
  },
  interaction: {
    keyboard: false,
    multiselect: true,
    hover: true,
    selectConnectedEdges: false
  },
  autoResize: true,
  // height: '600',
  width: '100%',
  layout: {
    improvedLayout: true
  }
};

export const hierarchicalNetwork = {
  hierarchical: {
    direction: global.hierarchicalNetworkDirection, // Direction can be - UD, DU, LR, RL
    nodeSpacing: 150,
    levelSeparation: 300,
    treeSpacing: 200
  }
};
