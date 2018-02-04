import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import './App.css';
import { Container, Grid, Menu } from 'semantic-ui-react';
import * as crossfilter from 'crossfilter2';
import { ChartContainer, PieChart, DataTable, NumberDisplay } from 'dc-react';
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
          <Route exact path ="/" render={(props) => (
            <Container>
              <Grid divided="vertically">
                <Grid.Row columns={2}>
                  <Grid.Column textAlign={"left"}>
                    <h1>CARBON<br />NO<br />MORE</h1>
                  </Grid.Column>
                  <Grid.Column textAlign={"left"} verticalAlign={"middle"}>
                    <h3><p>We&#39;re trying to be the internet&#39;s best carbon calculator.</p></h3><p>We analyze your bank and credit card transactions and score you based on your actual spending habits. Link your info below using our secure API to get started! <span style={{ fontSize: '24pt', fontWeight: 'bold' }}>&#42;</span></p>
                    <LinkButton />
                    <p><span style={{ fontSize: '24pt', fontWeight: 'bold' }}>&#42;</span> We only recieve read access to basic account info and transaction info from your bank. Read more about security from our partner <a href="https://plaid.com/security/">here</a>.</p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          )} />
        </div>
      </div>

    );
  }
}

export default App;
