import React, { Component } from 'react';
import './App.css';
import * as crossfilter from 'crossfilter2';
import { ChartContainer, PieChart, DataTable, NumberDisplay } from 'dc-react';

class CrossfilterContext {
  constructor(data) {
    this.data = data;
    this.crossfilter = crossfilter(data);

    this.categoryDimension = this.crossfilter.dimension(d => d.carbonCategory);
    this.transactionDimension = this.crossfilter.dimension(d => d.description);
    this.transactionAmountDimension = this.crossfilter.dimension(d => d.amount);

    this.carbonPerCategory = this.categoryDimension.group().reduceSum((d) => { return d.carbon });
    this.carbonTotal = this.transactionDimension.groupAll().reduceSum((d) => { return d.carbon });

  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this._crossfilterContext = null;
  }

  crossfilterContext = (callback) => {
    if(!callback) {
      return this._crossfilterContext;
    }

    var annotatedTransactionData = [
      { id: 1, carbonCategory: "Food", description: "Chugga Chugga Hot Dogs", amount: 3.65, carbon: 28 },
      { id: 2, carbonCategory: "Food", description: "Swedish Imports, Inc.", amount: 7.78, carbon: 81 },
      { id: 3, carbonCategory: "Food", description: "Johnson Chicken", amount: 42.25, carbon: 206 },
      { id: 4, carbonCategory: "Electricity", description: "NEPA", amount: 67.32, carbon: 532 },
      { id: 5, carbonCategory: "Waste", description: "Waste Management", amount: 41.26, carbon: 323 },
      { id: 6, carbonCategory: "Transport", description: "Shell", amount: 48.81, carbon: 206 },
      { id: 7, carbonCategory: "Transport", description: "76", amount: 51.37, carbon: 228 }
    ];

    this._crossfilterContext = new CrossfilterContext(annotatedTransactionData);
    callback(this._crossfilterContext);
  }

  render() {
    return (
      <div className="App">
        <ChartContainer className="container" crossfilterContext={this.crossfilterContext}>
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
              { label: "Transaction", format: (d) => { return d.description } },
              { label: "Amount ($)", format: (d) => { return d.amount } },
              { label: "Carbon (Lbs)", format: (d) => { return d.carbon } }
            ]}
          />
        </ChartContainer>
      </div>

    );
  }
}

export default App;
