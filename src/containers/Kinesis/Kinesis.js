import React, { Component } from 'react';
import * as AWS from 'aws-sdk';
import * as R from 'ramda';
import * as AppScope from '../../AppScope';

export default class Kinesis extends Component {
  state = {
    streams: false,
    poolingTimerId: 0
  }

  componentDidMount = () => {
    AppScope.registerIfNotExist('kinesisClient', () =>
      new AWS.Kinesis({
        apiVersion: '2013-12-02',
        endpoint: 'http://localhost:4566'
      }));

    
    const timerId = setInterval(this.poolStreams, 1000);
    this.setState({
      poolingTimerId: timerId
    })
  }

  componentWillUnmount = () => {
    clearInterval(this.state.poolingTimerId);
  }

  poolStreams = () => {
    AppScope.get('kinesisClient').listStreams((err, data) => {
      if (err) {
        console.log("Error", err.code);
      } else {
        console.log(data);
        if (!this.state.streams || !R.equals(new Set(this.state.streams), new Set(data.StreamNames))) {
          this.setState({ streams: data.StreamNames });
        }
      }
    });
  }

  render() {
    let streams = this.state.streams
        ? this.state.streams.map(name => (
          <div key={name}>
            {name}
          </div>))
        : 'loading ...';
    if (this.state.streams?.length === 0) {
      streams = 'There are no streams created yet!';
    }

    return (
      <div>
        <h3>Kinesis streams</h3>
        {streams}
      </div>
    );
  }
}
