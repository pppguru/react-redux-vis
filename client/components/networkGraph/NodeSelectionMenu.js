import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Colors } from '../../../commons/colors';
import { DEFAULT_FONT } from 'Constants';

import 'styles/_contextualMenu.scss';

const styles = {
  contextualMenu: {
    width: '180px',
    backgroundColor: Colors.white,
    border: `1px solid ${Colors.border}`,
    position: 'absolute',
    top: '50px',
    right: '510px',
    height: '190px',
    boxShadow: `1px 1px 1px 1px ${Colors.shadow}`
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    fontSize: '13px',
    height: '190px',
    overflowY: 'auto'
  },
  item: {
    cursor: 'pointer',
  },
  wrapItem: {
    display: 'flex',
    padding: '10px 15px 10px 10px',
    minHeight: '38px'
  },
  itemContent: {
    display: 'flex'
  },
  checkIcon: {
    width: '15px',
    alignSelf: 'flex-start',
    fontSize : '15px',
    marginLeft: 'auto'
  },
  typeIcon: {
    width : '18px',
    height : '15px'
  },
  frontIcon: {
    width : '18px',
    height : '15px',
    alignSelf: 'flex-start',
    marginRight: '10px'
  }
};

class NodeSelectionMenu extends React.Component {
  static propTypes = {
    showNodeSelectionMenu: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      showNodeSelectionMenu: props.showNodeSelectionMenu,
      selectedNodeType: 0
    };
  }

  componentWillReceiveProps(nextProps){

    if (nextProps){
      this.setState({
        showNodeSelectionMenu: nextProps.showNodeSelectionMenu,
        selectedNodeType: nextProps.selectedNodeType
      });
    }

  }

  componentDidMount() {
    document.addEventListener('click', this.handleNodeSelectionMenuClickOutside.bind(this), true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleNodeSelectionMenuClickOutside.bind(this), true);
  }

  handleNodeSelectionMenuClickOutside(event) {
    const domNode = this.node;//ReactDOM.findDOMNode(this);

    if ((!domNode || !domNode.contains(event.target))) {

      if (this.state.showNodeSelectionMenu ===  true) {


        this.props.networkNodeTypeSetVisible(false);
        // this.setState({
        //   showNodeSelectionMenu : false
        // });
      }
    }
  }

  doAction(selectedNodeOption) {
    return (event) => {

      this.props.chooseNodeType(selectedNodeOption);

    };

  }

  render() {

    const {state} = this;
    let contextMenuStyle = {display: state.showNodeSelectionMenu ? 'block' : 'none'};

    return (
      <div style={styles.wrap} ref={node => this.node = node}>
        <div style={{...styles.contextualMenu, ...contextMenuStyle}}
             id='networkstyle-menu'
             className='context-menu'>
          <ul style={styles.list}>


            <li style={styles.item}
                onClick={this.doAction(0)} className={state.selectedNodeType ===  0 ? 'selected' : ''}>
              <div style={styles.wrapItem}>

                <div style={styles.frontIcon}>

                </div>

                <div style={styles.itemContent}>
                  Show All
                </div>
                {
                  state.selectedNodeType === 0
                    ?
                    <i style={styles.checkIcon} className='material-icons'>
                      done
                    </i>
                    : null
                }

              </div>
            </li>

            <li style={styles.item}
                onClick={this.doAction(1)} className={state.selectedNodeType === 1 ? 'selected' : ''}>
              <div style={styles.wrapItem}>
                <div style={styles.frontIcon}>
                  <img src="/img/canvas-tool/Asset.svg" style={styles.typeIcon}/>
                </div>

                <div style={styles.itemContent}>
                  Machines
                </div>

                {
                  state.selectedNodeType === 1
                    ?
                    <i style={styles.checkIcon} className='material-icons'>
                      done
                    </i>
                    : null
                }

              </div>
            </li>

            <li style={styles.item}
                onClick={this.doAction(2)} className={state.selectedNodeType === 2 ? 'selected' : ''}>
              <div style={styles.wrapItem}>
                <div style={styles.frontIcon}>
                  <img src="/img/canvas-tool/Server.svg" style={styles.typeIcon}/>
                </div>


                <div style={styles.itemContent}>
                  Server
                </div>

                {
                  state.selectedNodeType === 2
                    ?
                    <i style={styles.checkIcon} className='material-icons'>
                      done
                    </i>
                    : null
                }
              </div>
            </li>

            <li style={styles.item}
                     onClick={this.doAction(3)} className={state.selectedNodeType === 3 ? 'selected' : ''}>
            <div style={styles.wrapItem}>
              <div style={styles.frontIcon}>
                <img src="/img/canvas-tool/Domain.svg" style={styles.typeIcon}/>
              </div>

              <div style={styles.itemContent}>
                Domain
              </div>

              {
                state.selectedNodeType === 3
                  ?
                  <i style={styles.checkIcon} className='material-icons'>
                    done
                  </i>
                  : null
              }
            </div>
          </li>

            <li style={styles.item}
                onClick={this.doAction(4)} className={state.selectedNodeType === 4 ? 'selected' : ''}>
              <div style={styles.wrapItem}>
                <div style={styles.frontIcon}>
                  <img src="/img/canvas-tool/Website.svg" style={styles.typeIcon}/>
                </div>

                <div style={styles.itemContent}>
                  Website
                </div>

                {
                  state.selectedNodeType ===  4
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

export default NodeSelectionMenu;
