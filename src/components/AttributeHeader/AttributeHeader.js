import React, { Component } from 'react';
import './AttributeHeader.css';

export default class AttributeHeader extends Component {
  render() {
    return (
      <div className="attributeHeader"> {this.props.attribute} </div>
    );
  }
}
