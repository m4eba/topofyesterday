import Api from './Api';

class PushApi extends Api {

  async posts(after,before,subreddit) {
    try {
      const resp = await fetch(`https://api.pushshift.io/reddit/search/submission/?q=&after=${after}&before=${before}&subreddit=${subreddit}&author=&aggs=&metadata=true&frequency=hour&advanced=false&sort=desc&domain=&sort_type=num_comments&size=200`,{signal:this.signal});
      const json = await resp.json();
      return json;
    }catch(e){
      // don't do anything on abort error
      if ( e.toString().substr(0,10) === 'AbortError' ) return;
      throw e;
    }
  }
}

export default PushApi;
