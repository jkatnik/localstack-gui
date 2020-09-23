import React, { Component } from 'react';
import * as AppScope from '../../AppScope';
import * as R from 'ramda';
import AttributeHeader from '../../components/AttributeHeader/AttributeHeader'
import './DynamoTable.css';

export default class DynamoTable extends Component {
  state = {
      items: [],
      tableName: 'loading ...'
  }

  componentDidUpdate = () => {
    const currentTableName = this.state.tableName
    const updatedTableName = this.props.match.params.id

    if (currentTableName === updatedTableName) {
        return;
    }
    this.setState({ tableName: updatedTableName });

    AppScope.get('dynamoClient').scan({
        TableName: updatedTableName
    }, (err, data) => {
        this.setState({ items: data.Items})
    })
  }

  tableAttributes = () => {
    const keys = R.map(R.keys, this.state.items)
    const uniqueKeys = R.reduce((acc, elem) => new Set([ ...acc, ...elem]), [], keys)
    return [ ...uniqueKeys];
  }

  render() {    
    const attributes = this.tableAttributes()

    console.log(attributes)

    const headers = attributes.map(attribute => (<AttributeHeader attribute={attribute} key={attribute}/>))
    const items = this.state.items ? this.state.items.map(item => this.toItemRow(item, attributes)) : '';
    return (
        <div>
            <h3>{ this.state.tableName }</h3>
            <div>Number of records: {this.state.items?.length }</div>
        
            <div className="dataTable">
                {headers}
            </div>
            {items}
        </div>
    );
  }

  toItemRow = (item, attributes) => {
      console.log(item);
  const columns = attributes.map(attribute => (<div>{this.dynaomDbAttributeToString(item[attribute])}</div>));
    return (<div>{columns}</div>);
  }

  dynaomDbAttributeToString = (attr) => {
      if (!!attr.S) {
          return attr.S
      } else if (!!attr.N) {
          return attr.N
      } else if (!!attr.M) {
          return JSON.stringify(attr.M)
      } else {
          return ''
      }

  }
}
