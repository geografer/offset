import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import { Container, Grid, Menu } from 'semantic-ui-react';
import * as crossfilter from 'crossfilter2';
import LinkButton from './LinkButton/LinkButton.js';
import { APIRequest } from './helpers/requests.js';
import FootprintDisplay from './Footprint/FootprintDisplay.js';

class CrossfilterContext {
  constructor(data) {
    this.data = data;
    this.crossfilter = crossfilter(data);

    this.categoryDimension = this.crossfilter.dimension(d => d.carbonCategory);
    this.transactionDimension = this.crossfilter.dimension(d => d.name);
    this.transactionAmountDimension = this.crossfilter.dimension(d => d.amount);

    this.carbonPerCategory = this.categoryDimension.group().reduceSum((d) => { return d.carbon });
    this.carbonTotal = this.transactionDimension.groupAll().reduceSum((d) => { return d.carbon });

  }
}

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state={env: null}

    if (this.props.match.path === "/prod") {
      this.state.env = "development";
    }
  }

  render() {
    return (
      <Container>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column textAlign={"left"}>
              <h1>THE<br /><span className="mid blue">CO</span><br />D<span className="blue">O</span>WN</h1>
            </Grid.Column>
            <Grid.Column textAlign={"left"} verticalAlign={"middle"}>
              <h3><p>Every choice affects global warming. We can help you understand yours.</p></h3><p>We&#39;re commited to giving you an accurate picture of your carbon emissions by analyzing your actual spending history.<span style={{ fontSize: '24pt', fontWeight: 'bold' }}>&#42;</span></p>
              <LinkButton env={this.state.env} />
              <p><span style={{ fontSize: '24pt', fontWeight: 'bold' }}>&#42;</span> We take your privacy extremely seriously. Read more about security from our partner <a href="https://plaid.com/security/">here</a>.</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: null,
      context: function() {}
    }

    this._crossfilterContext = null;
  }

  crossfilterContext = (callback) => {
    if(!callback) {
      return this._crossfilterContext;
    }

    if (this.state.transactions)
      this._crossfilterContext = new CrossfilterContext(this.state.transactions);
    callback(this._crossfilterContext);
  }

  getTransactions = (access_token, item_id) => {
    APIRequest('/api/get_transactions?access_token='+access_token, 'GET', { "access_token": access_token }, (response) => {
      this.setState({transactions: response.data});
      console.log(response);
      this.props.history.push('/footprint');
    });
  }

  handleLinkSuccess = (public_token) => {
    this.props.getPlaidToken(public_token);
    /*APIRequest('/api/get_access_token', 'POST', {"public_token": public_token}, (response) => {
      this.getTransactions(response.data.access_token, response.data.item_id);
    }); */
  }

  render() {
    return (
      <div className="Page">
        <Menu secondary style={{background: '#DDD', width: '100%'}}>
          <Container>
            <Menu.Item name="About">About</Menu.Item>
            <Menu.Item name="Methodology">Methodology</Menu.Item>
            <Menu.Item name="Support">Support</Menu.Item>
          </Container>
        </Menu>
        <div className="App">
          <Route exact path ="/footprint" component={FootprintDisplay} />
          <Route exact path ="/prod" component={HomePage} environment="production" />
          <Route exact path ="/" component={HomePage} />
        </div>
      </div>

    );
  }
}

export default App;
