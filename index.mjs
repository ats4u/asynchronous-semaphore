
class Semaphore {
  capacity = 1;
  running = false;
  promiseQueue = [];
  waitQueue = [];

  constructor(capacity=1) {
    this.capacity = capacity;
  }

  __enter( promise ) {
    if ( ! this.promiseQueue.find( e=>e===promise ) ){
      this.promiseQueue = [ ...(this.promiseQueue), promise ];
    }
  }
  __leave( promise ) {
    this.promiseQueue = this.promiseQueue.filter( e=>e!==promise );
    if ( 0 < this.waitQueue.length ) {
      /*await*/ this.waitQueue.pop()();
    }
  }

  /*async*/ __wait() {
    if ( this.capacity <= this.promiseQueue.length ) {
      return new Promise((resolve,reject)=>{
        this.waitQueue.unshift( resolve );
      });
    } else {
      return new Promise((resolve,reject)=>{
        resolve();
      });
    }
  }

  async take( f ) {
    const promise = (async()=>{
      await this.__wait();
      return await f();
    })();

    try {
      this.__enter( promise );
      return await promise;
    } finally {
      this.__leave( promise );
    }
  }
}

export const semaphore = (...args)=>new Semaphore(...args);
