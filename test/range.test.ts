import Range from '../src/range';
import { describe, it } from 'mocha';
import assert from 'assert';

describe('Range', () => {
  describe('#start', () => {
    it('should return [1, 2] when new Range(1, 2, 9, 10)', () => {
      assert.deepEqual(new Range(1, 2, 9, 10).start, [1, 2]);
    });
    it('should return [0, 2] when new Range(0, 2, 9, 10)', () => {
      assert.deepEqual(new Range(0, 2, 9, 10).start, [0, 2]);
    });
  });
  describe('#end', () => {
    it('should return [9, 10] when new Range(1, 2, 9, 10)', () => {
      assert.deepEqual(new Range(1, 2, 9, 10).end, [9, 10]);
    });
    it('should return [0, 10] when new Range(1, 2, 0, 10)', () => {
      assert.deepEqual(new Range(1, 2, 0, 10).end, [0, 10]);
    });
  });
  describe('#rows', () => {
    it('should return 8 when new Range(1, 2, 9, 10)', () => {
      assert.equal(new Range(1, 2, 9, 10).rows, 8);
    });
    it('should return 0 when new Range(0, 2, 0, 10)', () => {
      assert.equal(new Range(0, 2, 0, 10).rows, 0);
    });
  });
  describe('#cols', () => {
    it('should return 8 when new Range(1, 2, 9, 10)', () => {
      assert.equal(new Range(1, 2, 9, 10).cols, 8);
    });
    it('should return 0 when new Range(1, 0, 9, 0)', () => {
      assert.equal(new Range(1, 0, 9, 0).cols, 0);
    });
  });
  describe('#containsRow() with new Range(1, 2, 8, 8)', () => {
    const range = new Range(1, 2, 8, 8);
    it('should return false when value is 0', () => {
      assert.equal(range.containsRow(0), false);
    });
    it('should return false when value is 9', () => {
      assert.equal(range.containsRow(9), false);
    });
    it('should return false when value is 19', () => {
      assert.equal(range.containsRow(19), false);
    });
    it('should return true when value is 1', () => {
      assert.equal(range.containsRow(1), true);
    });
    it('should return true when value is 8', () => {
      assert.equal(range.containsRow(8), true);
    });
    it('should return true when value is 6', () => {
      assert.equal(range.containsRow(6), true);
    });
  });
  describe('#containsCol() with new Range(1, 2, 8, 8)', () => {
    const range = new Range(1, 2, 8, 8);
    it('should return false when value is 0', () => {
      assert.equal(range.containsCol(0), false);
    });
    it('should return false when value is 9', () => {
      assert.equal(range.containsCol(9), false);
    });
    it('should return false when value is 19', () => {
      assert.equal(range.containsCol(19), false);
    });
    it('should return true when value is 2', () => {
      assert.equal(range.containsCol(2), true);
    });
    it('should return true when value is 8', () => {
      assert.equal(range.containsCol(8), true);
    });
    it('should return true when value is 6', () => {
      assert.equal(range.containsCol(6), true);
    });
  });
  describe('#contains() with new Range(1, 2, 8, 8)', () => {
    const range = new Range(1, 2, 8, 8);
    it('should return false when value is 0, 6', () => {
      assert.equal(range.contains(0, 6), false);
    });
    it('should return false when value is 2, 9', () => {
      assert.equal(range.contains(2, 9), false);
    });
    it('should return false when value is 0, 10', () => {
      assert.equal(range.contains(0, 10), false);
    });
    it('should return true when value is 2, 6', () => {
      assert.equal(range.contains(2, 6), true);
    });
  });
  describe('#within() with new Range(1, 2, 8, 8)', () => {
    const range = new Range(1, 2, 8, 8);
    it('should return true when value is new Range(1, 2, 8, 8)', () => {
      assert.equal(range.within(new Range(1, 2, 8, 8)), true);
    });
    it('should return true when value is new Range(0, 1, 9, 9)', () => {
      assert.equal(range.within(new Range(0, 1, 9, 9)), true);
    });
    it('should return true when value is new Range(1, 2, 10, 8)', () => {
      assert.equal(range.within(new Range(1, 2, 10, 8)), true);
    });
    it('should return true when value is new Range(1, 2, 8, 10)', () => {
      assert.equal(range.within(new Range(1, 2, 8, 10)), true);
    });
    it('should return false when value is new Range(0, 2, 8, 8)', () => {
      assert.equal(range.within(new Range(2, 2, 8, 8)), false);
    });
    it('should return false when value is new Range(1, 2, 7, 8)', () => {
      assert.equal(range.within(new Range(1, 2, 7, 8)), false);
    });
    it('should return false when value is new Range(1, 3, 8, 8)', () => {
      assert.equal(range.within(new Range(1, 3, 8, 8)), false);
    });
    it('should return false when value is new Range(1, 2, 8, 7)', () => {
      assert.equal(range.within(new Range(1, 2, 8, 7)), false);
    });
    it('should return false when value is new Range(0, 0, 0, 0)', () => {
      assert.equal(range.within(new Range(0, 0, 0, 0)), false);
    });
    it('should return false when value is new Range(10, 10, 12, 12)', () => {
      assert.equal(range.within(new Range(10, 10, 12, 12)), false);
    });
    it('should return false when value is new Range(10, 1, 12, 2)', () => {
      assert.equal(range.within(new Range(10, 1, 12, 2)), false);
    });
    it('should return false when value is new Range(0, 10, 1, 12)', () => {
      assert.equal(range.within(new Range(0, 10, 1, 12)), false);
    });
  });
  describe('#intersects() with new Range(4, 4, 8, 8)', () => {
    const range = new Range(4, 4, 8, 8);
    it('should return true when value is new Range(4, 4, 8, 8)', () => {
      assert.equal(range.intersects(new Range(4, 4, 8, 8)), true);
    });
    it('should return true when value is new Range(5, 5, 6, 6)', () => {
      assert.equal(range.intersects(new Range(5, 5, 6, 6)), true);
    });
    it('should return true when value is new Range(2, 4, 4, 4)', () => {
      assert.equal(range.intersects(new Range(2, 4, 4, 4)), true);
    });
    it('should return true when value is new Range(4, 2, 4, 4)', () => {
      assert.equal(range.intersects(new Range(4, 2, 4, 4)), true);
    });
    it('should return true when value is new Range(8, 4, 10, 6)', () => {
      assert.equal(range.intersects(new Range(8, 4, 10, 6)), true);
    });
    it('should return true when value is new Range(4, 8, 6, 10)', () => {
      assert.equal(range.intersects(new Range(4, 8, 6, 10)), true);
    });
    it('should return false when value is new Range(1, 4, 3, 8)', () => {
      assert.equal(range.intersects(new Range(1, 4, 3, 8)), false);
    });
    it('should return false when value is new Range(4, 1, 8, 3)', () => {
      assert.equal(range.intersects(new Range(4, 1, 8, 3)), false);
    });
    it('should return false when value is new Range(9, 4, 9, 8)', () => {
      assert.equal(range.intersects(new Range(9, 4, 9, 8)), false);
    });
    it('should return false when value is new Range(4, 9, 8, 9)', () => {
      assert.equal(range.intersects(new Range(4, 9, 8, 9)), false);
    });
    it('should return false when value is new Range(1, 1, 2, 2)', () => {
      assert.equal(range.intersects(new Range(1, 1, 2, 2)), false);
    });
    it('should return false when value is new Range(10, 10, 12, 12)', () => {
      assert.equal(range.intersects(new Range(10, 10, 12, 12)), false);
    });
  });
  describe('#union() with new Range(4, 4, 8, 8)', () => {
    const range = new Range(4, 4, 8, 8);
    it('should return range(1, 1, 8, 8) when value is new Range(1, 1, 2, 2)', () => {
      assert.deepEqual(range.union(new Range(1, 1, 2, 2)), new Range(1, 1, 8, 8));
    });
    it('should return range(1, 1, 8, 8) when value is new Range(10, 10, 12, 12)', () => {
      assert.deepEqual(range.union(new Range(10, 10, 12, 12)), new Range(4, 4, 12, 12));
    });
    it('should return range(1, 1, 10, 8) when value is new Range(1, 1, 10, 2)', () => {
      assert.deepEqual(range.union(new Range(1, 1, 10, 2)), new Range(1, 1, 10, 8));
    });
    it('should return range(4, 4, 4, 8) when value is new Range(5, 5, 7, 7)', () => {
      assert.deepEqual(range.union(new Range(5, 5, 7, 7)), new Range(4, 4, 8, 8));
    });
  });
  describe('#clone() with new Range(4, 4, 8, 8)', () => {
    const range = new Range(4, 4, 8, 8);
    it('should return range(4, 4, 8, 8)', () => {
      assert.deepEqual(range.clone(), new Range(4, 4, 8, 8));
    });
  });
});

describe('newRange()', () => {
  it('should be range(0, 0, 0, 0) when value is A1:A1', () => {
    assert.deepEqual(Range.with('A1:A1'), new Range(0, 0, 0, 0));
  });
  it('should be range(1, 0, 9, 3) when value is A2:D10', () => {
    assert.deepEqual(Range.with('A2:D10'), new Range(1, 0, 9, 3));
  });
});
