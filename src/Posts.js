import React, { Component } from 'react';

import PushApi from './PushApi';
import RedditApi from './RedditApi';

class Posts extends Component {
  date = null;
  pushApi = new PushApi();
  redditApi = new RedditApi();

  state = {
    error: null,
    fetching: null,
    data:null
  };


  async fetchPush() {
    this.setState({
      fetching:'push',
      error:null
    });
    let time = 0;
    try {
      time = Math.floor( (new Date(this.props.match.params.date)).getTime() / 1000 );
    } catch(e){
      console.log(e);
      this.setState({
        error:'unable to parse date???'
      });
      return;
    }
    let after = time;
    let before = time + 24*60*60;
    let subreddit = this.props.match.params.subreddit;
    try {
      let data = await this.pushApi.posts(after,before,subreddit);
      this.setState({
        data: data
      });
      if ( !data.data ) {
        this.setState({
          error:'invalid json received'
        });
      } else {
        this.fetchReddit();
      }
    }catch(e){
      this.setState({
        error:'pushshift api call error:'+e
      });
    }
  }

  fetchReddit() {
    if ( this.state.data.data.length === 0 ) {
      this.setState({
        fetching:'nothing'
      });
      return;
    }
    this.setState({
      fetching:'reddit'
    });
    let ids = this.state.data.data.map(d=>'t3_'+d.id);
    // split in groups of len
    let groups = [];
    let len = 100;
    let count = Math.ceil(ids.length/len);
    for(let i=0;i<count;++i) {
      groups.push( ids.slice(i*len, Math.min((i+1)*len,ids.length+1)) );
    }

    this.fetchRedditGroup(groups,0,len);
  }

  async fetchRedditGroup(groups,idx,len) {
    let ids = groups[idx].join();

    try {
      let data = await this.redditApi.info(ids);

      data.data.children.forEach( (post,i) => {
        this.state.data.data[ idx*len+i ].score = post.data.score;
        if ( post.data.thumbnail.substr(0,4) === 'http' ) {
          this.state.data.data[ idx*len+i ].thumbnail_url = post.data.thumbnail;
        } else {
          this.state.data.data[ idx*len+i ].thumbnail_url = 'https://www.redditstatic.com/desktop2x/img/banner/banner-small-logo@2x.png';
        }

      });
      if ( idx+1 === groups.length ) {
        this.sort();
      } else {
        this.fetchRedditGroup(groups,idx+1,len);
      }
    } catch(e) {
      console.log(e);
      this.setState({
        error:'unable to catch scores'
      });
    }
  }

  sort() {
    this.state.data.data.sort( (a,b) => b.score-a.score);
    this.setState({
      fetching: 'done'
    });
  }

  componentDidMount() {
    console.log('component mount');
    //this.fetchPush();
  }

  render() {
    if (this.props.match.params.date !== this.date ) {
      this.pushApi.abort();
      this.redditApi.abort();

      this.date = this.props.match.params.date;
      this.fetchPush();
    }
    console.log( this.props );
    console.log( this.state );
    if ( this.state.error ) {
      return (
        <div>
          Error: {this.state.error}
        </div>
      );
    }
    if ( this.state.fetching === 'push' ) {
      return (
        <div>
          fetching posts from pushshift.io, please wait ...
        </div>
      );
    }
    if ( this.state.fetching === 'reddit' ) {
      return (
        <div>
          {this.state.data.metadata.results_returned} posts found<br/>
          fetching scores from reddit api, please wait ...
        </div>
      )
    }
    if ( this.state.fetching === 'nothing' ) {
      return (
        <div>
          nothing found :(
        </div>
      );
    }
    if ( this.state.fetching === 'done' ) {
      let results = this.state.data.data.map( post =>
        <div class="post">
          <div class="thumb" >
            <img src={post.thumbnail_url} alt=":(" />
          </div>
          <div>
            <span class="score">{post.score}</span>
            <span class="author">by {post.author}</span>
            <br/>
            <a target="_blank" href={post.full_link}><span class="title">{post.title}</span></a>
          </div>
          <div>
            <a target="_blank" href={post.url}>{post.url}</a>
          </div>
          <div class="endpost" ></div>
        </div>
      );
      return (
        <div class="results">
          {this.state.data.metadata.results_returned} results:
          {results}
        </div>
      );
    }

    return (
      <div></div>
    );
  }

}

export default Posts;
