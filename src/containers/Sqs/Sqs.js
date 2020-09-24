import React, { Component } from 'react';
import * as AWS from 'aws-sdk';
import * as R from 'ramda';
import * as AppScope from '../../AppScope';

export default class Sqs extends Component {
  state = {
    queues: false,
    poolingTimerId: 0
  }

  componentDidMount = () => {
    AppScope.registerIfNotExist('sqsClient', () =>
      new AWS.SQS({
        apiVersion: '2012-11-05',
        endpoint: 'http://localhost:4566'
      }));

    
    const timerId = setInterval(this.poolQueueNames, 1000);
    this.setState({
      poolingTimerId: timerId
    })
  }

  componentWillUnmount = () => {
    clearInterval(this.state.poolingTimerId);
  }

  poolQueueNames = () => {
    AppScope.get('sqsClient').listQueues((err, data) => {
      if (err) {
        console.log("Error", err.code);
      } else {
        console.log(data);
        if (!this.state.queues || !R.equals(new Set(this.state.queues), new Set(data.QueueUrls))) {
          this.setState({ queues: data.QueueUrls });
        }
      }
    });
  }

  render() {
    let queues = this.state.queues
        ? this.state.queues.map(queueName => (
          <div key={queueName}>
            {queueName}
          </div>))
        : 'loading ...';
    if (this.state.queues?.length === 0) {
      queues = 'There are no queues created yet!';
    }

    return (
      <div>
        <h3>SQS queues</h3>
        {queues}
      </div>
    );
  }
}
