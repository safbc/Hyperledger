import React, { Component } from 'react'
import { Link } from 'react-router'

export default class NavLink extends Component {
  render() {
    let isActive = this.context.router.isActive(this.props.to, true)
    let className = isActive ? 'active' : ''

    return (
      <li className={className}><Link {...this.props} /></li>
    )
  }
}

NavLink.contextTypes = {
    router: React.PropTypes.object
}
