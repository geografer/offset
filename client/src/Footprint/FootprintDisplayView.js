import React, { Component } from 'react';
import * as crossfilter from 'crossfilter2';
import { ChartContainer, PieChart, DataTable, NumberDisplay } from 'dc-react';

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

export default class FootprintDisplayView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: null,
      context: function() {}
    }

    this._crossfilterContext = null;
  }

  componentDidMount() {
    this.props.getFootprint();
  }

  crossfilterContext = (callback) => {
    if(!callback) {
      return this._crossfilterContext;
    }

    if (this.props.footprintData)
      this._crossfilterContext = new CrossfilterContext(this.props.footprintData);
    callback(this._crossfilterContext);
  }

  render() {
    return (
      <div>
        { this.props.footprintData && <ChartContainer className="container" crossfilterContext={this.crossfilterContext}>
          <h1>YOUR CARBON FOOTPRINT</h1>
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
        </ChartContainer> }
      </div>
    );
  }
}
