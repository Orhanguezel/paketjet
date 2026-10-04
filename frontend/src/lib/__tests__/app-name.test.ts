import {describe,expect,it} from 'vitest';
import {splitWordmark,stripBrand,withBrand} from '../app-name';
describe('brand name from deployment env',()=>{
 it('splits a camel-case name for the two-tone wordmark and keeps single words whole',()=>{
  expect(splitWordmark('PaketJet')).toEqual(['Paket','Jet']);expect(splitWordmark('Kargoist')).toEqual(['Kargoist','']);expect(splitWordmark('')).toEqual(['','']);
 });
 it('adds and removes the brand suffix without touching other titles',()=>{
  expect(withBrand('Rehber')).toBe('Rehber | PaketJet');
  expect(stripBrand('PaketJet | Rehber | PaketJet')).toBe('Rehber');expect(stripBrand('Rehber | Başka','')).toBe('Rehber | Başka');
 });
});
