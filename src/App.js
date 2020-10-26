import React from 'react';
import MenuItem from './components/MenuItem/MenuItem'
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import DynamoDb from './containers/DynamoDb/DynamoDb';
import Sns from './containers/Sns/Sns';
import Sqs from './containers/Sqs/Sqs';
import Kinesis from './containers/Kinesis/Kinesis';
import Config from './containers/Config/Config';
import * as AWS from 'aws-sdk';

function App() {
  AWS.config.update({
    region: 'eu-west-1',
    credentials: {
      accessKeyId: 'any',
      secretAccessKey: 'any',
      sessionToken: 'any'
    }
  });
  return (
    <div className="App">
      <Router>
        <nav className="topMenu">
          <MenuItem label="DynamoDB" linkTo="/dynamoDb"/>
          <MenuItem label="SNS" linkTo="/sns"/>
          <MenuItem label="SQS" linkTo="/sqs"/>
          <MenuItem label="Kinesis" linkTo="/kinesis"/>
          <MenuItem label="Config" linkTo="/config" className="config"/>
        </nav>
        
        <Route path="/dynamoDb">
          <DynamoDb />
        </Route>

        <Route path="/sns">
          <Sns />
        </Route>

        <Route path="/sqs">
          <Sqs />
        </Route>

        <Route path="/kinesis">
          <Kinesis />
        </Route>
        
        <Route path="/config">
          <Config />
        </Route>

      </Router>
    </div>
  );
}

export default App;
