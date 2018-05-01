import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Colors } from '../../../commons/colors';
import { DEFAULT_FONT } from 'Constants';

import 'styles/_contextualMenu.scss';

const styles = {
  contextualMenu: {
    width: '120px',
    backgroundColor: Colors.white,
    border: `1px solid ${Colors.border}`,
    position: 'absolute',
    top: '50px',
    right: '470px',
    height: '105px',
    boxShadow: `1px 1px 1px 1px ${Colors.shadow}`
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    fontSize: '13px',
    height: '140px',
    overflowY: 'auto'
  },
  item: {
    cursor: 'pointer',
  },
  wrapItem: {
    display: 'flex',
    padding: '10px 15px 10px 10px',
    minHeight: '35px'
  },
  itemContent: {
    display: 'flex'
  },
  checkIcon: {
    width: '15px',
    alignSelf: 'flex-start',
    fontSize : '15px',
    marginLeft: 'auto'
  }
};

class NetworkStyleMenu extends React.Component {
  static propTypes = {
    showStyleMenu: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      showStyleMenu: props.showStyleMenu,
      selectedStyle: 0
    };
  }

  componentWillReceiveProps(nextProps){

    if (nextProps){
      this.setState({
        showStyleMenu: nextProps.showStyleMenu,
        selectedStyle: nextProps.selectedStyle
      });
    }

  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
  }

  handleClickOutside(event) {
    const domNode = this.node;//ReactDOM.findDOMNode(this);

    if ((!domNode || !domNode.contains(event.target))) {


      //Hide the menu
      if (this.state.showStyleMenu ===  true) {

        this.props.networkStyleSetVisible(false);
        // this.setState({
        //   showStyleMenu : false
        // });
      }
    }
  }

  doAction(param) {
    return (event) => {

      if (param === 'standard') {
        this.props.networkStyleSetLayout(0);
      }
      else if (param === 'hierarchial') {
        this.props.networkStyleSetLayout(1);
      }
      else if (param === 'radial') {
        this.props.networkStyleSetLayout(2);
      }
      else if (param === 'sequential') {
        this.props.networkStyleSetLayout(3);
      }
    };

  }

  render() {

    const {state} = this;
    let contextMenuStyle = {display: state.showStyleMenu ? 'block' : 'none'};

    return (
      <div style={styles.wrap} ref={node => this.node = node}>
        <div style={{...styles.contextualMenu, ...contextMenuStyle}}
             id='networkstyle-menu'
             className='context-menu'>
          <ul style={styles.list}>


            <li style={styles.item}
                onClick={this.doAction("standard")} className={state.selectedStyle ===  0 ? 'selected' : ''}>
              <div style={styles.wrapItem}>
                <div style={styles.itemContent}>
                  Standard
                </div>
                {
                  state.selectedStyle ===  0
                    ?
                    <i style={styles.checkIcon} className='material-icons'>
                      done
                    </i>
                    : null
                }

              </div>
            </li>

            <li style={styles.item}
                onClick={this.doAction("hierarchial")} className={state.selectedStyle ===  1 ? 'selected' : ''}>
              <div style={styles.wrapItem}>
                <div style={styles.itemContent}>
                  Hierarchial
                </div>

                {
                  state.selectedStyle ===  1
                    ?
                    <i style={styles.checkIcon} className='material-icons'>
                      done
                    </i>
                    : null
                }

              </div>
            </li>

            <li style={styles.item}
                onClick={this.doAction("sequential")} className={state.selectedStyle ===  3 ? 'selected' : ''}>
              <div style={styles.wrapItem}>
                <div style={styles.itemContent}>
                  Sequential
                </div>

                {
                  state.selectedStyle ===  3
                    ?
                    <i style={styles.checkIcon} className='material-icons'>
                      done
                    </i>
                    : null
                }
              </div>
            </li>


          </ul>
        </div>

      </div>
    );
  }
}

export default NetworkStyleMenu;
