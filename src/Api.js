
class Api {
  controller = null;
  signal = null;

  constructor() {
    if ( AbortController ) {
      this.controller = new AbortController();
      this.signal = this.controller.signal;
    }
  }


  abort() {
    if ( AbortController ) {
      this.controller.abort();
      this.controller = new AbortController();
      this.signal = this.controller.signal;
    }
  }
}

export default Api;
