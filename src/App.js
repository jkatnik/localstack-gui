import React from 'react';
import MenuItem from './components/MenuItem/MenuItem'
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import DynamoDb from './containers/DynamoDb/DynaomDb';
import Sns from './containers/Sns/Sns';
import Kinesis from './containers/Kinesis/Kinesis';
import Config from './containers/Config/Config';


function App() {
  return (
    <div className="App">
      <Router>
        <div class="topMenu">
          <MenuItem label="DynamoDB" linkTo="dynamoDb"/>
          <MenuItem label="SNS" linkTo="sns"/>
          <MenuItem label="Kinesis" linkTo="kinesis"/>
          <MenuItem label="Config" linkTo="config" className="config"/>
        </div>
        
        <Route path="/dynamoDb">
          <DynamoDb />
        </Route>

        <Route path="/sns">
          <Sns />
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
