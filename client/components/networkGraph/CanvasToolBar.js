import React from 'react';
import {Toggle, CircularProgress} from 'material-ui'

import '../../styles/circularProgress.scss';

const styles = {
  parent: {
    paddingRight: "80px",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    height : "54px",
    width : "100%",
    display: 'flex'
  },
  content: {
    marginLeft: 'auto'
  },
  toolIcon:{
    width : '18px',
    height : '18px'
  },
  divShowLabel:{
    height : '18px',
    marginLeft: '40px',
    display: 'inline-block',
    width : '120px'
  },
  mainToolDiv:{
    display: 'inline-block',
    marginTop: "18px",
    marginBottom: "18px",
    height: "18px"
  },
  toggleLabel:{
    fontSize : '12px'
  },
  thumbOff: {
    backgroundColor: 'white',
    border : '1px solid #e5e5ea',
    transform : 'scale(0.8)'
  },
  trackOff: {
    backgroundColor: '#e5e5ea',
    width: '95%'
  },
  thumbSwitched: {
    backgroundColor: 'white',
    border : '1px solid #03c5ed',
    transform : 'scale(0.8)'
  },
  trackSwitched: {
    backgroundColor: '#03c5ed',

    width: '95%'
  },
  circularStyle:{
    position : 'absolute',
    top : '0',
    left : '0',
    transform: 'rotate(-90deg)'
  },

  textCenterStyle: {
    textAlign: 'center',
    margin: '0',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '11px'
  },
  textDivStyle: {
    height: '30px',
    width : '30px',
    position: 'relative'
  },
  divProgressBar:{
    width : '30px',
    height : '30px',
    marginLeft: '20px',
    display: 'inline-table',
    position:'relative',
    verticalAlign: 'middle',
    lineHeight: '30px'
  },
  divContainer:{
    display: 'inline-block',
    marginLeft: '20px',
    cursor: 'pointer'
  }
};

class CanvasToolBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowLabel: true,
    };
  }

  render() {
    return (
      <div style={styles.parent}>
        <div style={styles.content}>
          <div style={styles.mainToolDiv}>
            <div id='filterNode' style={styles.divContainer}>
              <img src="/img/canvas-tool/Filter.svg" style={styles.toolIcon}/>
            </div>
            <div id='layoutChange' style={styles.divContainer}>
              <img src="/img/canvas-tool/Layouts.svg" style={styles.toolIcon}/>
            </div>
            <div id='rescaleFit' style={styles.divContainer}>
              <img src="/img/canvas-tool/Expand.svg" style={styles.toolIcon}/>
            </div>
            <div id='reset' style={styles.divContainer}>
              <img src="/img/canvas-tool/Refresh.svg" style={styles.toolIcon}/>
            </div>
            <div id='undo' style={styles.divContainer}>
              <img src="/img/canvas-tool/Undo.svg" style={styles.toolIcon}/>
            </div>
            <div id='zoomOut' style={styles.divContainer}>
              <img src="/img/canvas-tool/Zoom_Out.svg" style={styles.toolIcon}/>
            </div>
            <div id='zoomIn' style={styles.divContainer}>
              <img src="/img/canvas-tool/Zoom_In.svg" style={styles.toolIcon}/>
            </div>
          </div>

          <div style={styles.divShowLabel}>
              <Toggle label='Show Labels'
                      defaultToggled={true}
                      labelStyle={styles.toggleLabel}
                      thumbStyle={styles.thumbOff}
                      trackStyle={styles.trackOff}
                      thumbSwitchedStyle={styles.thumbSwitched}
                      trackSwitchedStyle={styles.trackSwitched}

                      onToggle={(event, checked) => {
                        this.setState({
                          isShowLabel: checked,
                        })

                        this.props.handleShowLabel(checked);
                      }}/>
          </div>
        </div>

      </div>
    );
  }

}

export default CanvasToolBar;
