import React, { Component } from 'react';
import * as AppScope from '../../../AppScope';

export default class KinesisStream extends Component {
  state = {
      records: [],
      streamName: 'loading ...'
  }

  componentDidUpdate = () => {
    const currentStreamName = this.state.streamName
    const updatedStreamName = this.props.match.params.id

    if (currentStreamName === updatedStreamName) {
        return;
    }
    this.setState({ streamName: updatedStreamName });

    const kinesis = AppScope.get('kinesisClient');
    kinesis.describeStream({StreamName: updatedStreamName}, this.describeStream);
  }

  describeStream = (err, data) => {
    const kinesis = AppScope.get('kinesisClient');
    const streamName = data.StreamDescription.StreamName
    if (err) {
        console.log(err);
        return;
    } 

    kinesis.getShardIterator({
        StreamName: streamName,
        ShardId:data.StreamDescription.Shards[0].ShardId,
        ShardIteratorType: 'TRIM_HORIZON'
    }, (err,data) => { 
      this.getRecords(err, data, this.getRecords) 
    });
  }

  getRecords = (err, data) => {
    const kinesis = AppScope.get('kinesisClient');
    const next = this.getRecords


    kinesis.getRecords({ShardIterator:data.ShardIterator,Limit:100}, function (err, data) {
      if (err) {
        console.log(err);
        return;
      }

      var decoder = new TextDecoder('utf8');
      
      const records = data.Records.map(record => {
        return String.fromCharCode.apply(null, new Uint16Array(record.Data))
      })
      const newRecords = [...this.state.records]
      newRecords.push(records)
      this.setState({records: newRecords});

      setTimeout(function() {
        data.ShardIterator = data.NextShardIterator;
        next(null, data);
      }.bind(this), 500);
    }.bind(this))
  }

  render() {
    const data = this.state.records.map(rec => (<p>{rec}</p>))


    return (
      <div>
        <div> Kinesis stream {this.state.streamName } </div>
        {data}
      </div>
    );
  }
}
