import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {canonicalUrl,importEntries,parseHtml,flattenTree,connections} from '../src/core.js';
test('deduplication removes trackers but preserves semantic URL distinctions',()=>{
  const {added,duplicates,invalid}=importEntries([{url:'https://example.com/a?utm_source=x'},{url:'https://example.com/a'},{url:'https://example.com/a#chapter'},{url:'https://example.com/a?q=b'},{url:'javascript:alert(1)'},{url:'https://user:secret@example.com'}]);
  assert.equal(added.length,3);assert.equal(duplicates,1);assert.equal(invalid,2);
  assert.notEqual(canonicalUrl('http://example.com'),canonicalUrl('https://example.com'));
});
test('existing links and within-batch duplicates are excluded',()=>{const first=importEntries([{url:'https://a.com'}]).added;assert.equal(importEntries([{url:'https://a.com'},{url:'https://b.com'},{url:'https://b.com'}],first).duplicates,2);});
test('HTML imports titles, nested folders, and rejects unsafe schemes downstream',()=>{const dom=new JSDOM();const parsed=parseHtml('<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><DT><H3>Design</H3><DL><DT><A HREF="https://figma.com">Figma &amp; friends</A><DT><A HREF="javascript:alert(1)">Bad</A></DL></DL>',dom.window.DOMParser);assert.equal(parsed[0].title,'Figma & friends');assert.equal(parsed[0].folder,'Design');const result=importEntries(parsed);assert.equal(result.invalid,1);assert.deepEqual(result.added[0].tags,['Design']);});
test('browser tree preserves folder context',()=>assert.deepEqual(flattenTree([{title:'Root',children:[{title:'Docs',url:'https://example.com'}]}]),[{title:'Docs',url:'https://example.com',folder:'Root'}]));
test('only explicit Evas restore preserves approval status',()=>{const raw=[{url:'https://a.com',status:'library',tags:['A','A',null],note:'hello'}];assert.equal(importEntries(raw).added[0].status,'inbox');const restored=importEntries(raw,[],{restore:true}).added[0];assert.equal(restored.status,'library');assert.deepEqual(restored.tags,['A']);assert.equal(restored.note,'hello');});
test('graph edges explain common tags or domain and exclude unrelated nodes',()=>{const rows=[{id:'1',url:'https://a.com',tags:['Design']},{id:'2',url:'https://b.com',tags:['Design']},{id:'3',url:'https://a.com/page',tags:[]},{id:'4',url:'https://c.com',tags:[]}];assert.deepEqual(connections(rows),[{source:'1',target:'2',reason:'Design'},{source:'1',target:'3',reason:'a.com'}]);});
