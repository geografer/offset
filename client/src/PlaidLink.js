import React, {Component} from 'react';
import Script from 'react-load-script';

export default class PlaidLinkButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handler: null,
      plaidUrl: "https://cdn.plaid.com/link/v2/stable/link-initialize.js",
      plaidInitialized: false

    }

    this.HandleClick = this.HandleClick.bind(this);
    this.HandlerOnLoad = this.HandlerOnLoad.bind(this);
  }

  HandlerOnLoad() {
    window.handler = window.Plaid.create({
      apiVersion: 'v2',
      clientName: 'Offset App',
      env: this.props.env,
      product: ['transactions'],
      key: this.props.public_key,
      onSuccess: this.props.onSuccess
    });
  }

  HandleClick(button) {
    if (window.handler) {
      window.handler.open()
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.HandleClick}>Link</button>
        <Script
          url={this.state.plaidUrl}
          onLoad={this.HandlerOnLoad}
        />
      </div>
    )
  }
}
