import React, { Component } from 'react';
import * as AppScope from '../../AppScope';

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
  
  render() {
    console.log('Rendering DynamoTable')
    return (
        <div>
            <h3>{ this.state.tableName }</h3>
            <div>Number of records: {this.state.items?.length }</div>
        </div>
    );
  }
}
