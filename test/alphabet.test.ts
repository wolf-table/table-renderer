import { describe, it } from 'mocha';
import assert from 'assert';
import { indexAt, stringAt, expr2xy, xy2expr } from '../src/alphabet';

describe('alphabet', () => {
  describe('.indexAt()', () => {
    it('should return 0 when the value is A', () => {
      assert.equal(indexAt('A'), 0);
    });
    it('should return 25 when the value is Z', () => {
      assert.equal(indexAt('Z'), 25);
    });
    it('should return 26 when the value is AA', () => {
      assert.equal(indexAt('AA'), 26);
    });
    it('should return 51 when the value is AZ', () => {
      assert.equal(indexAt('AZ'), 51);
    });
    it('should return 52 when the value is BA', () => {
      assert.equal(indexAt('BA'), 52);
    });
    it('should return 701 when the value is ZZ', () => {
      assert.equal(indexAt('ZZ'), 701);
    });
    it('should return 702 when the value is AAA', () => {
      assert.equal(indexAt('AAA'), 702);
    });
    it('should return 703 when the value is AAB', () => {
      assert.equal(indexAt('AAB'), 703);
    });
    it('should return 755 when the value is ACB', () => {
      assert.equal(indexAt('ACB'), 755);
    });
    it('should return 1432 when the value is BCC', () => {
      assert.equal(indexAt('BCC'), 1432);
    });
  });

  describe('.stringAt()', () => {
    it('should return A when the value is 0', () => {
      assert.equal(stringAt(0), 'A');
    });
    it('should return Z when the value is 25', () => {
      assert.equal(stringAt(25), 'Z');
    });
    it('should return AA when the value is 26', () => {
      assert.equal(stringAt(26), 'AA');
    });
    it('should return AZ when the value is 51', () => {
      assert.equal(stringAt(51), 'AZ');
    });
    it('should return BA when the value is 52', () => {
      assert.equal(stringAt(52), 'BA');
    });
    it('should return ZZ when the value is 701', () => {
      assert.equal(stringAt(701), 'ZZ');
    });
    it('should return AAA when the value is 702', () => {
      assert.equal(stringAt(702), 'AAA');
    });
    it('should return AAB when the value is 703', () => {
      assert.equal(stringAt(703), 'AAB');
    });
    it('should return ACB when the value is 755', () => {
      assert.equal(stringAt(755), 'ACB');
    });
    it('should return BCC when the value is 1432', () => {
      assert.equal(stringAt(1432), 'BCC');
    });
  });

  describe('.expr2xy()', () => {
    it('should return [0, 0] when the value is A1', () => {
      assert.equal(expr2xy('A1')[0], 0);
      assert.equal(expr2xy('A1')[1], 0);
    });
    it('should return [27, 10] when the value is AB11', () => {
      assert.equal(expr2xy('AB11')[0], 27);
      assert.equal(expr2xy('AB11')[1], 10);
    });
  });

  describe('.xy2expr()', () => {
    it('should return A1 when the value is [0, 0]', () => {
      assert.equal(xy2expr(0, 0), 'A1');
    });
    it('should return AB11 when the value is [27, 10]', () => {
      assert.equal(xy2expr(27, 10), 'AB11');
    });
  });
});
