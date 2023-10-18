 asynchronous-semaphore
=========================

This is an ordinary semaphore implementation which is written in JavaScript's
`async`/`await` semantic. This enables users to limit the number of their
asynchronous process which are executed simultaneously. It also allows users to
implement critical section especially when its capacity is 1.


```javascript
  import { semaphore } from './index.mjs';
  // This is a simple `sleep` implementation.
  const sleep = (t)=>new Promise((res,rej)=>setTimeout(res,t));
  // Create an arbitrary procedure which consumes a specified amount of time.
  const createProc = (name,t)=>{
    // Return a closure which is asynchronously executed.
    return async ()=>{
      log( `begin ${name} (${t})` );
      await sleep(t);
      log( `end   ${name} (${t})` );
    };
  };
```

```javascript
  const r = semaphore(); // Call without arguments. The default capacity is 1.
  await Promise.all([
    r.take( createProc('1',3000) ),
    r.take( createProc('2',3000) ),
    r.take( createProc('3',3000) ),
  ]);

  // Output :
  // begin 1 (3000)
  // end   1 (3000)
  // begin 2 (3000)
  // end   2 (3000)
  // begin 3 (3000)
  // end   3 (3000)

  // In this example, the capacity number is set to one; that is these closures
  // are also critical sections.
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

  // In this example, the capacity number is set to two.
  // Please note that the beginnings and the endings of job-1 and job-2 are
  // interchanged.
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

 History
======================
(Wed, 18 Oct 2023 21:39:07 +0900) Released `v1.0.0`

