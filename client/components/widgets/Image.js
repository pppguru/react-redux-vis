import React, {PropTypes} from 'react';

class ImageWithStatusText extends React.Component {
  constructor(props) {
    super(props);
    this.state = { style: {display: 'none'} };

    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.handleImageErrored = this.handleImageErrored.bind(this);
  }

  static propTypes = {
    imageUrl: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired
  }

  handleImageLoaded() {
    this.setState({ style: {} });
  }

  handleImageErrored() {
    this.setState({ style: {display: 'none'} });
  }

  render() {
    const {props, state} = this;
    return (
      <img
        style={{...props.style, ...state.style}}
        src={props.imageUrl}
        alt={props.alt}
        onLoad={this.handleImageLoaded}
        onError={this.handleImageErrored}
        />
    );
  }
}

export default ImageWithStatusText;
