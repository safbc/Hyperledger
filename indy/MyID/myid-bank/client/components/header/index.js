import React, { Component } from 'react'
import { connect } from 'react-redux'

import NavLink from './navlink'

if (process.env.WEBPACK) {
  require('./index.scss')
}

class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed"
                data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <NavLink to="/" className="navbar-brand">MyID Bank</NavLink>
              <NavLink to="/" activeClassName="active">VERIFY</NavLink>
            </ul>
            <p className="nav navbar-nav navbar-right"></p>
          </div>
        </div>
      </nav>
    )
  }
}

export default connect(state => {
  const {config} = state
  return {config}
})(Header)
