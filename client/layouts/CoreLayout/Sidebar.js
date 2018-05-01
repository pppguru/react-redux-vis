import React, {PropTypes} from 'react';
import { Link } from 'react-router';

import {Colors} from '../../../commons/colors';
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_MENU_HEIGHT } from 'Constants';

import './Sidebar.scss';

import Search from './Search';

const styles = {
  leftNav: {
    position: 'fixed',
    top: '64px',
    left: 0,
    bottom: 0,
    backgroundColor: Colors.grape,
    color: Colors.arctic,
    zIndex: 10
  },
  search: {
    top: '64px',
    position: 'fixed',
    left: SIDEBAR_WIDTH_COLLAPSED,
    bottom: 0,
    zIndex: 10
  },
  icon: {
    color: Colors.navigation,
    width: SIDEBAR_WIDTH_COLLAPSED,
    textAlign: 'center'
  },
  searchLink: {
    cursor: 'pointer',
    backgroundColor: Colors.search
  },
  linkWrap: {
    display: 'flex',
    lineHeight: SIDEBAR_MENU_HEIGHT,
    alignItems: 'center'
  },
  link: {
    height: SIDEBAR_MENU_HEIGHT,
    lineHeight: SIDEBAR_MENU_HEIGHT
  },
  wrap: {
    position: 'relative',
    height: SIDEBAR_MENU_HEIGHT,
    width: SIDEBAR_WIDTH,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    color: Colors.arctic
  },
  text: {
    textTransform: 'capitalize',
    fontSize: '13px'
  },
  active: {
    color: Colors.bar,
    backgroundColor: Colors.grape
  },
  arrowIcon: {
    fontSize: '18px',
    height: '24px',
    lineHeight: '24px',
    transform: 'rotate(-90deg)',
    marginLeft: 'auto'
  },
  menuWrap: {
    position: 'relative',
    display: 'flex',
    width: SIDEBAR_WIDTH,
    alignItems: 'center',
    cursor: 'pointer'
  },
  subMenuWrap: {
    position: 'absolute',
    left: SIDEBAR_WIDTH,
    top: 0,
    backgroundColor: Colors.grape,
    color: Colors.arctic
  }
};

class Sidebar extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    location: PropTypes.object.isRequired,
    sidebar: PropTypes.array.isRequired
  }

  getItem = (link, activeStyle, hasSubmenu) => {
    return (
      <div style={styles.linkWrap}>
        <i style={{ ...styles.icon, ...activeStyle }} className='material-icons'>
          {link.icon}
        </i>
        {
          hasSubmenu
            ? <i style={styles.arrowIcon} className='material-icons submenu__arrow-icon'>arrow_drop_down</i>
            : null
        }
        <span style={styles.text}>{link.text}</span>
      </div>
    );
  }

  getLinks(links, active) {
    return links.map((link, index) => {
      const hasSubmenu = !!link.submenu,
        linkClass = hasSubmenu ? 'has-submenu' : '';

      let activeStyle = {};
      if (link.to === active) {
        activeStyle = styles.active;
      }
      let submenuStyle = { ...styles.subMenuWrap };
      if (hasSubmenu && (links.length - 1 - index <= 2)) {
        submenuStyle.top = 'auto';
        submenuStyle.bottom = 0;
      }

      return (
        <div style={styles.menuWrap} key={index} className={linkClass}>
          {
            link.to
              ? (
                <Link to={link.to} style={{ ...styles.wrap, ...activeStyle }}>
                  {this.getItem(link, activeStyle, hasSubmenu)}
                </Link>
              )
              : (
                <div style={{ ...styles.wrap, ...activeStyle }} >
                  {this.getItem(link, activeStyle, hasSubmenu)}
                </div>
              )
          }

          {
            hasSubmenu
              ? <i style={styles.arrowIcon} className='material-icons'>arrow_drop_down</i>
              : null
          }
          {
            hasSubmenu
                ? (
                  <div style={submenuStyle} className='submenu'>
                    {this.getLinks(link.submenu)}
                  </div>
                )
                : null
            }
        </div>
      );
    });
  }

  render() {
    const {props} = this;
    return (
      <nav className='sidebar' style={{...styles.leftNav, ...props.style}}>
        <div style={{...styles.wrap, ...styles.searchLink}}
          key='searchlink'
          onClick={props.toggleSearch}
          className='search-link'>
          <i style={styles.icon} className='material-icons'>search</i>
          <span style={styles.text}>search</span>
        </div>
        {this.getLinks(props.sidebar, props.location.pathname)}

        {
          props.showSearch
          ? (
            <Search className='search'
              style={styles.search}
              toggleSearch={props.toggleSearch} />
          )
          : null
        }
      </nav>
    );
  }
}

export default Sidebar;
