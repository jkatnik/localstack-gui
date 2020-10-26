import React, { Component } from 'react';
import * as AWS from 'aws-sdk';
import * as R from 'ramda';
import DynamoTable from '../DynamoTable/DynamoTable';
import { Link, Route  } from 'react-router-dom';
import * as AppScope from '../../AppScope';

export default class DynamoDb extends Component {
  state = {
    tables: false,
    port: localStorage.getItem('dynamoDb.port') || 10101,
    poolingTimerId: 0
  }

  componentDidMount = () => {
    AppScope.registerIfNotExist('dynamoClient', () =>
      new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://127.0.0.1:' + this.state.port
      }));
    
    const timerId = setInterval(this.poolTableNames, 1000);
    this.setState({
      poolingTimerId: timerId
    })
  }

  componentWillUnmount = () => {
    clearInterval(this.state.poolingTimerId);
  }

  poolTableNames = () => {
    AppScope.get('dynamoClient').listTables((err, data) => {
      if (err) {
        console.log("Error", err.code);
      } else {
        if (!this.state.tables || !R.equals(new Set(this.state.tables), new Set(data.TableNames))) {
          this.setState({ tables: data.TableNames });
        }
      }
    });
  }

  render() {
    const port = this.state.port;

    let tables = this.state.tables
        ? this.state.tables.map(tableName => (
          <div key={tableName}>
            <Link to={`/dynamoDb/table/${tableName}`}>{tableName}</Link>
          </div>))
        : 'loading ...';
    if (this.state.tables?.length === 0) {
      tables = 'There are no tables created yet!';
    }

    return (
      <div>
        <h3> Dynamo DB tables</h3>
        
        <p>
          Port: <input value={port} onChange={this.updateDynamoDbPort}/>
        </p>
        {tables}
        <Route path="/dynamoDb/table/:id" component={DynamoTable} />
      </div>
    );
  }

  updateDynamoDbPort = (event) => {
    const port = event.target.value;
    const client = new AWS.DynamoDB({
      apiVersion: '2012-08-10',
      endpoint: 'http://127.0.0.1:' + port
    });

    localStorage.setItem('dynamoDb.port', port);

    AppScope.register('dynamoClient',client);
    this.setState({ port: port, tables: [] });
  }
}
