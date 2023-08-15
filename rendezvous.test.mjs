
import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Semaphore } from './rendezvous.mjs';

const wait = (t)=>new Promise((res,rej)=>setTimeout(res,t));
const log = (result,value)=>{
  console.log( value );
  result.push( value );
};
const createProc = (result,name,t)=>{
  return async ()=>{
    log( result, `begin ${name} (${t})` );
    await wait(t);
    log( result, `end   ${name} (${t})` );
  };
};

describe('A thing', () => {
  it( ' should work with the default capacity  ', async () => {
    const result=[];
    const r = new Semaphore();
    await Promise.all([
      r.take( createProc(result,'1',3000) ),
      r.take( createProc(result,'2',3000) ),
      r.take( createProc(result,'3',3000) ),
    ]);
    assert.deepEqual( result, [
      'begin 1 (3000)',
      'end   1 (3000)',
      'begin 2 (3000)',
      'end   2 (3000)',
      'begin 3 (3000)',
      'end   3 (3000)',
    ]);
  });

  it( 'should work with 2 as the specified capacity', async () => {
    const result=[];
    const r = new Semaphore(2);
    await Promise.all([
      r.take( createProc(result,'1',3000) ),
      r.take( createProc(result,'2',3000) ),
      r.take( createProc(result,'3',3000) ),
    ]);
    assert.deepEqual( result, [
      'begin 1 (3000)',
      'begin 2 (3000)',
      'end   1 (3000)',
      'begin 3 (3000)',
      'end   2 (3000)',
      'end   3 (3000)',
    ]);
  });

  it( 'should work with 3 as the specified capacity', async () => {
    const result=[];
    const r = new Semaphore(3);
    await Promise.all([
      r.take( createProc(result,'1',3000) ),
      r.take( createProc(result,'2',3000) ),
      r.take( createProc(result,'3',3000) ),
    ]);
    assert.deepEqual( result, [
      'begin 1 (3000)',
      'begin 2 (3000)',
      'begin 3 (3000)',
      'end   1 (3000)',
      'end   2 (3000)',
      'end   3 (3000)',
    ]);
  });

  it( 'should work with 3 as the specified capacity with 4 threads', async () => {
    const result=[];
    const r = new Semaphore(3);
    await Promise.all([
      r.take( createProc(result,'1',3000) ),
      r.take( createProc(result,'2',3000) ),
      r.take( createProc(result,'3',3000) ),
      r.take( createProc(result,'4',3000) ),
    ]);
    assert.deepEqual( result, [
      'begin 1 (3000)',
      'begin 2 (3000)',
      'begin 3 (3000)',
      'end   1 (3000)',
      'begin 4 (3000)',
      'end   2 (3000)',
      'end   3 (3000)',
      'end   4 (3000)',
    ]);
  });


  it( 'should work with 3 as the specified capacity with 4 threads; thread 4 finishes earlier than thread 2', async () => {
    const result=[];
    const r = new Semaphore(3);
    const promises = [];

    promises.push( r.take( createProc(result,'1',3000) ) ),
    ( await wait( 500 ) );
    promises.push( r.take( createProc(result,'2',3000) ) ),
    ( await wait( 500 ) );
    promises.push( r.take( createProc(result,'3',3000) ) ),
    ( await wait( 500 ) );
    promises.push( r.take( createProc(result,'4',10) ) ),

    await Promise.all( promises );
    assert.deepEqual( result, [
      'begin 1 (3000)',
      'begin 2 (3000)',
      'begin 3 (3000)',
      'end   1 (3000)',
      'begin 4 (10)',
      'end   4 (10)',
      'end   2 (3000)',
      'end   3 (3000)',
    ]);
  });

  it( 'should work with 3 as the specified capacity with 4 threads; thread 4 finishes earlier than thread 3',async () => {
    const result=[];
    const r = new Semaphore(3);
    const promises = [];

    promises.push( r.take( createProc(result,'1',3000) ) ),
    ( await wait( 500 ) );
    promises.push( r.take( createProc(result,'2',3000) ) ),
    ( await wait( 500 ) );
    promises.push( r.take( createProc(result,'3',3000) ) ),
    ( await wait( 500 ) );
    promises.push( r.take( createProc(result,'4',1000) ) ),

    await Promise.all( promises );
    assert.deepEqual( result, [
      'begin 1 (3000)',
      'begin 2 (3000)',
      'begin 3 (3000)',
      'end   1 (3000)',
      'begin 4 (1000)',
      'end   2 (3000)',
      'end   4 (1000)',
      'end   3 (3000)',
    ]);
  });

})


