import {it} from 'node:test';import assert from 'node:assert/strict';import {safeAdminNext} from '../src/lib/safe-next';
it('admin return URLs remain on the panel origin',()=>{
 for(const value of ['https://example.com','//example.com','/\\example.com','/\r\nexample.com',null])assert.equal(safeAdminNext(value),'/admin');
 assert.equal(safeAdminNext('/admin/ilanlar?status=active'),'/admin/ilanlar?status=active');
});
