 asynchronous-semaphore
=========================

```javascript
  import { semaphore } from './index.mjs';
  const wait = (t)=>new Promise((res,rej)=>setTimeout(res,t));
  const createProc = (name,t)=>{
    return async ()=>{
      log( `begin ${name} (${t})` );
      await wait(t);
      log( `end   ${name} (${t})` );
    };
  };
```

```javascript
  const r = semaphore(); // default capacity is 1
  await Promise.all([
    r.take( createProc('1',3000) ),
    r.take( createProc('2',3000) ),
    r.take( createProc('3',3000) ),
  ]);

  // begin 1 (3000)
  // end   1 (3000)
  // begin 2 (3000)
  // end   2 (3000)
  // begin 3 (3000)
  // end   3 (3000)
```

```javascript
  const r = semaphore(2);
  await Promise.all([
    r.take( createProc('1',3000) ),
    r.take( createProc('2',3000) ),
    r.take( createProc('3',3000) ),
  ]);

  // begin 1 (3000)
  // begin 2 (3000)
  // end   1 (3000)
  // begin 3 (3000)
  // end   2 (3000)
  // end   3 (3000)
```

```javascript
  const r = semaphore(3);
  await Promise.all([
    r.take( createProc('1',3000) ),
    r.take( createProc('2',3000) ),
    r.take( createProc('3',3000) ),
  ]);

  // begin 1 (3000)
  // begin 2 (3000)
  // begin 3 (3000)
  // end   1 (3000)
  // end   2 (3000)
  // end   3 (3000)
```
