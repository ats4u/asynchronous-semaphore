
export class Rendezvous {
  running = false;
  queue = [];
  constructor() {
  }

  async exec( promise ) {
    if ( 'then' in promise ) {
      try {
        this.running = true;
        return await promise;
      } finally {
        this.running = false;
        for ( const qf of this.queue ) {
          /* await */ (async()=>{
            qf();
          })();
        }
      }
    } else {
      return /* is not a */ promise;
    }
  }

  /*async*/ wait() {
    if ( this.running ) {
      return new Promise((resolve,reject)=>{
        this.queue.push( resolve );
      });
    } else {
      return new Promise((resolve,reject)=>{
        resolve();
      });
    }
  }
}

