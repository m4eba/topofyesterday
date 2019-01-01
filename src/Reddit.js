import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Posts from './Posts';
import { dateString } from './utils';

class Reddit extends Component {

  render() {
    let date;
    try {
      date = new Date(this.props.match.params.date);
    } catch(e){
      console.log(e);
      return ( <div>date????</div>);
    }
    let dateY = new Date( date.getTime()-24*60*60*1000);
    let dateT = new Date( date.getTime()+24*60*60*1000);

    return (
      <div>
        /r/{this.props.match.params.subreddit}<br/>
        <Link to={"/"+this.props.match.params.subreddit+"/"+dateString(dateY)} >{dateString(dateY)}</Link>
        &nbsp;
        {dateString(date)}
        &nbsp;
        <Link to={"/"+this.props.match.params.subreddit+"/"+dateString(dateT)} >{dateString(dateT)}</Link>
        <Posts {...this.props} />
      </div>
    );
  }
}



export default Reddit;
