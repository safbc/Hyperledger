import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from '../header'
import  * as actions from '../../actions/settings'

if (process.env.WEBPACK) {
  require('./index.scss')
}

class Layout extends Component {

  render() {
    // const { settings,  dispatch } = this.props

    return (
      <div className="home">
        <Header />
        <div id="container" className="container-fluid">
          <div className="row">
            <div className="col-md-6"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => {
  const {settings} = state
  return {settings}
})(Layout)
