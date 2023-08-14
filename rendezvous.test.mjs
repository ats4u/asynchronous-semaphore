
import { Rendezvous } from './rendezvous.mjs';

function testRendezvous() {
  const wait = (t)=>new Promise((res,rej)=>setTimeout(res,t));

  const r = new Rendezvous();
  r.exec( (async ()=>{
    console.log( 'start' );
    await wait(3000);
    console.log( 'end' );
  })() );

  const waitFor = (async(msg) =>{
    await r.wait();
    console.log( `done ${msg}`);
    await wait( Math.floor( Math.random() * 4000 + 1000 ) );
    await r.wait();
    console.log( `redo done ${msg}`);
  });

  waitFor('hello');
  waitFor('world');
  waitFor('foo');
}

testRendezvous();

