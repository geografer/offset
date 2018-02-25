import React, { Component } from 'react';
import PlaidLink from '../PlaidLink.js';


export default class LinkButtonView extends Component {
  constructor(props) {
    super(props);
  }

  handleLinkSuccess = (public_token) => {
    this.props.getPlaidToken(public_token);
  }

  render() {
    return (
      <PlaidLink
        env={this.props.env}
        public_key={this.props.public_key}
        onSuccess={this.handleLinkSuccess}
      />
    )
  }
}
