import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './MenuItem.css';

export default class MenuItem extends Component {
  render() {
    return (
      <div className="MenuItem">
        <Link to={this.props.linkTo}>
         {this.props.label}
        </Link>
      </div>
    );
  }
}
