import Api from './Api';

class RedditApi extends Api {
  access_token = null;

  async token() {
    try {
      let data = new URLSearchParams();
      data.set('device_id','DO_NOT_TRACK_THIS_DEVICE');
      data.set('grant_type', 'https://oauth.reddit.com/grants/installed_client');
      data.set('scope','read');

      const resp = await fetch('https://www.reddit.com/api/v1/access_token',{
        method:'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic d3c5TlpEQ0d2d3RDV2c6RWo4TjF0cU1LM1FOeUlxMHJsd1JrU2tacHNJ'
        },
        body: data,
        signal:this.signal
      });
      const json = await resp.json();
      this.access_token = json.access_token;
      return;
    }catch(e){
      // don't do anything on abort error
      if ( e.toString().substr(0,10) === 'AbortError' ) return;
      throw e;
    }
  }

  async info(ids) {
    if ( !this.access_token ) {
      await this.token();
    }
    try {
      let resp = await fetch(`https://oauth.reddit.com/api/info?id=${ids}&api_type=json`,{
        headers: {
          'Authorization': 'bearer '+this.access_token
        },
        signal:this.signal
      });
      const json = await resp.json();
      return json;
    }catch(e){
      // don't do anything on abort error
      if ( e.toString().substr(0,10) === 'AbortError' ) return;
      throw e;
    }
  }


}

export default RedditApi;
