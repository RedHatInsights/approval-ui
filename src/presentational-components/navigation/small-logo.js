import * as React from 'react';
import SmallLogoImage from '../../assets/images/logo_small.svg';

export class SmallLogo extends React.Component {
  render() {
    return (
      <img
        style={ { height: '35px' } }
        src={ SmallLogoImage }
        alt={ this.props.alt }
      />
    );
  }
}
