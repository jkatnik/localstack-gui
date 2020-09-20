import React, { Component } from 'react';
import * as AWS from 'aws-sdk';

export default class DynamoDb extends Component {
  state = {
    tables: false,
    poolingTimerId: 0
  }

  componentDidMount = () => {
    const timerId = setInterval(this.poolTableNames, 1000);
    this.setState({
      poolingTimerId: timerId
    })
  }

  componentWillUnmount = () => {
    clearInterval(this.state.poolingTimerId);
  }

  poolTableNames = () => {
    AWS.config.update({
      region: 'eu-west-1',
      credentials: {
        accessKeyId: 'any',
        secretAccessKey: 'any'
      }
    });

    var ddb = new AWS.DynamoDB({
      apiVersion: '2012-08-10',
      endpoint: 'http://localhost:4566'
    });

    ddb.listTables((err, data) => {
      if (err) {
        console.log("Error", err.code);
      } else {
        this.setState({ tables: data.TableNames });
      }
    });
  }

  render() {
    let tables = this.state.tables
        ? this.state.tables.map(tableName => (<div key={tableName}>{tableName}</div>))
        : 'loading ...';
    

    return (
      <div>
        <h3> Dynamo DB tables</h3>
        {tables}
      </div>
    );
  }
}
