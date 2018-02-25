import React, { Component } from 'react';
import PlaidLink from '../PlaidLink.js';

const environment = "sandbox";
const public_token = "4e286959097f58418d2ca69556db7f";

export default class LinkButtonView extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  handleLinkSuccess = (public_token) => {
    this.props.getPlaidToken(public_token);
  }

  render() {
    return (
      <PlaidLink
        env={this.props.env || "sandbox"}
        public_key={public_token}
        onSuccess={this.handleLinkSuccess}
      />
    )
  }
}
