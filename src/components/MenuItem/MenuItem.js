import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './MenuItem.css';

export default class MenuItem extends Component {
  render() {
    let className = `MenuItem ${this.props.className}`;
    return (
      <div className={className}>
        <Link to={this.props.linkTo}>
         {this.props.label}
        </Link>
      </div>
    );
  }
}
