import React, { Component } from 'react';
import './App.css';
import * as crossfilter from 'crossfilter2';
import { ChartContainer, PieChart, DataTable, NumberDisplay } from 'dc-react';
import PlaidLink from './PlaidLink.js';
import { APIRequest } from './helpers/requests.js';

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
    });
  }

  handleLinkSuccess = (public_token) => {
    APIRequest('/api/get_access_token', 'POST', {"public_token": public_token}, (response) => {
      this.getTransactions(response.data.access_token, response.data.item_id);
    });
  }

  render() {
    return (
      <div className="App">
        { this.state && this.state.transactions && <ChartContainer className="container" crossfilterContext={this.crossfilterContext}>
          <h1>Offset</h1>
          <div className="pieComposite">
            <PieChart className="categoryChart" dimension={ctx => ctx.categoryDimension}
              group={ctx => ctx.carbonPerCategory}
              width={270} height={270}
              innerRadius={110}
            />
            <NumberDisplay className="carbonTotal" dimension={ctx => ctx.transactionDim}
              group={ctx => ctx.carbonTotal}
              valueAccessor={function(d) { return d; }}
            />
          </div>
          <DataTable className="transactionTable" dimension={ctx => ctx.transactionDimension}
            group={d => d.id}
            width={400} height={300}
            showGroups={false}
            columns={[
              { label: "Transaction", format: (d) => { return d.name } },
              { label: "Amount ($)", format: (d) => { return d.amount } },
              { label: "Carbon (Lbs)", format: (d) => { return Math.round(d.carbon,1) } }
            ]}
          />
        </ChartContainer>}
        <PlaidLink
          env="sandbox"
          public_key="4e286959097f58418d2ca69556db7f"
          onSuccess={this.handleLinkSuccess}
        />
        <div>{this.state.transactionsLoaded && <div>Three</div>}</div>
      </div>

    );
  }
}

export default App;
