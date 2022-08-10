import { describe, it } from 'mocha';
import assert from 'assert';
import { borderRanges } from '../src/border';
import Area from '../src/area';
import { Border, BorderType, Range } from '../src';

const borderTypes: BorderType[] = [
  'all',
  'outside',
  'left',
  'right',
  'top',
  'right',
  'inside',
  'horizontal',
  'vertical',
];

describe('borderRanges', () => {
  const rowHeight = () => 25;
  const colWidth = (i) => (i === 5 ? 0 : 100);
  const area = Area.create(0, 0, 19, 15, 260, 50, rowHeight, colWidth);
  const areaMerges = [Range.with('I10:J11'), Range.with('B9:D10')];

  describe(`when area is [0, 0, 19, 20] and areaMerges is ['I10:J11', 'B9:D10'] `, () => {
    borderTypes.forEach((type) => {
      it(`and border is ['B1', '${type}', 'thick', '#188038']`, () => {
        const border: Border = ['B1', type, 'thick', '#188038'];
        let ret = borderRanges(area, border, areaMerges);
        assert.equal(ret.length, 1);
        assert.equal(ret[0][0].toString(), 'B1');
        assert.equal(ret[0][2], type);
        assert.deepEqual(ret[0][1], { x: 100, y: 0, width: 100, height: 25 });
      });
    });

    borderTypes.forEach((type) => {
      it(`and border is ['B2:D4', '${type}', 'thick', '#188038']`, () => {
        const border: Border = ['B2:D4', type, 'thick', '#188038'];
        let ret = borderRanges(area, border, areaMerges);
        assert.equal(ret.length, 1);
        assert.equal(ret[0][0].toString(), 'B2:D4');
        assert.equal(ret[0][2], type);
        assert.deepEqual(ret[0][1], { x: 100, y: 25, width: 300, height: 75 });
      });
    });

    borderTypes.forEach((type) => {
      ['I10', 'I10:J11'].forEach((ref) => {
        it(`and border is [''${ref}'', '${type}', 'thick', '#188038']`, () => {
          const border: Border = [ref, type, 'thick', '#188038'];
          let ret = borderRanges(area, border, areaMerges);
          if (type === 'inside' || type === 'horizontal' || type === 'vertical') {
            assert.equal(ret.length, 0);
          } else {
            assert.equal(ret[0][0].toString(), 'I10:J11');
            assert.equal(ret[0][2], type === 'all' ? 'outside' : type);
            assert.deepEqual(ret[0][1], { x: 7 * 100, y: 9 * 25, width: 200, height: 50 });
          }
        });
      });
    });

    // merge in border
    borderTypes.forEach((type) => {
      const ref = 'G8:L13';
      it(`and border is ['${ref}', '${type}', 'thick', '#188038']`, () => {
        const border: Border = [ref, type, 'thick', '#188038'];
        let ret = borderRanges(area, border, areaMerges);
        if (type === 'all') {
          assert.equal(ret.length, 4);
          const refs = ['G8:L9', 'G12:L13', 'G10:H11', 'K10:L11'];
          for (let i = 0; i < 4; i++) {
            assert.equal(true, refs.includes(ret[i][0].toString()));
            assert.equal(ret[i][2], type);
          }
          assert.deepEqual(ret[0][1], { x: 5 * 100, y: 7 * 25, width: 6 * 100, height: 2 * 25 });
          assert.deepEqual(ret[1][1], { x: 5 * 100, y: 11 * 25, width: 6 * 100, height: 2 * 25 });
          assert.deepEqual(ret[2][1], { x: 5 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
          assert.deepEqual(ret[3][1], { x: 9 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
        } else if (type === 'inside') {
          assert.equal(ret.length, 8);

          assert.equal(ret[0][2], 'inside');
          assert.equal('G8:L9', ret[0][0].toString());
          assert.deepEqual(ret[0][1], { x: 5 * 100, y: 7 * 25, width: 6 * 100, height: 2 * 25 });

          assert.equal(ret[1][2], 'bottom');
          assert.equal('G8:L9', ret[0][0].toString());
          assert.deepEqual(ret[1][1], { x: 5 * 100, y: 7 * 25, width: 6 * 100, height: 2 * 25 });

          assert.equal(ret[2][2], 'inside');
          assert.equal('G12:L13', ret[2][0].toString());
          assert.deepEqual(ret[2][1], { x: 5 * 100, y: 11 * 25, width: 6 * 100, height: 2 * 25 });

          assert.equal(ret[3][2], 'top');
          assert.equal('G12:L13', ret[2][0].toString());
          assert.deepEqual(ret[3][1], { x: 5 * 100, y: 11 * 25, width: 6 * 100, height: 2 * 25 });

          assert.equal(ret[4][2], 'inside');
          assert.equal('G10:H11', ret[4][0].toString());
          assert.deepEqual(ret[4][1], { x: 5 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });

          assert.equal(ret[5][2], 'right');
          assert.equal('G10:H11', ret[5][0].toString());
          assert.deepEqual(ret[5][1], { x: 5 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });

          assert.equal(ret[6][2], 'inside');
          assert.equal('K10:L11', ret[6][0].toString());
          assert.deepEqual(ret[6][1], { x: 9 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });

          assert.equal(ret[7][2], 'left');
          assert.equal('K10:L11', ret[7][0].toString());
          assert.deepEqual(ret[7][1], { x: 9 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
        } else if (type === 'horizontal') {
          assert.equal(ret.length, 6);
        } else if (type === 'vertical') {
          assert.equal(ret.length, 6);
        } else {
          assert.equal(ret.length, 1);
          assert.equal(ret[0][0].toString(), ref);
          assert.equal(ret[0][2], type);
          assert.deepEqual(ret[0][1], { x: 5 * 100, y: 7 * 25, width: 6 * 100, height: 6 * 25 });
        }
      });
    });

    // merge in boder with one bedge
    borderTypes.forEach((type) => {
      const ref = 'G8:L11';
      it(`and border is ['${ref}', '${type}', 'thick', '#188038']`, () => {
        const border: Border = [ref, type, 'thick', '#188038'];
        let ret = borderRanges(area, border, areaMerges);
        if (type === 'all') {
          assert.equal(ret.length, 4);
          const refs = ['G8:L9', 'G10:H11', 'K10:L11', 'I10:J11'];
          for (let i = 0; i < ret.length; i++) {
            assert.equal(true, refs.includes(ret[i][0].toString()));
            assert.equal(ret[i][2], i === 3 ? 'bottom' : type);
          }
          assert.deepEqual(ret[0][1], { x: 5 * 100, y: 7 * 25, width: 6 * 100, height: 2 * 25 });
          assert.deepEqual(ret[1][1], { x: 5 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
          assert.deepEqual(ret[2][1], { x: 9 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
          assert.deepEqual(ret[3][1], { x: 7 * 100, y: 9 * 25, width: 200, height: 50 });
        } else if (type === 'inside') {
          assert.equal(ret.length, 6);

          assert.equal(ret[0][2], 'inside');
          assert.equal('G8:L9', ret[0][0].toString());
          assert.deepEqual(ret[0][1], { x: 5 * 100, y: 7 * 25, width: 6 * 100, height: 2 * 25 });

          assert.equal(ret[1][2], 'bottom');
          assert.equal('G8:L9', ret[0][0].toString());
          assert.deepEqual(ret[1][1], { x: 5 * 100, y: 7 * 25, width: 6 * 100, height: 2 * 25 });

          assert.equal(ret[2][2], 'inside');
          assert.equal('G10:H11', ret[2][0].toString());
          assert.deepEqual(ret[2][1], { x: 5 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });

          assert.equal(ret[3][2], 'right');
          assert.equal('G10:H11', ret[3][0].toString());
          assert.deepEqual(ret[3][1], { x: 5 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });

          assert.equal(ret[4][2], 'inside');
          assert.equal('K10:L11', ret[4][0].toString());
          assert.deepEqual(ret[4][1], { x: 9 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });

          assert.equal(ret[5][2], 'left');
          assert.equal('K10:L11', ret[5][0].toString());
          assert.deepEqual(ret[5][1], { x: 9 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
        } else if (type === 'horizontal') {
          assert.equal(ret.length, 4);
        } else if (type === 'vertical') {
          assert.equal(ret.length, 5);
        } else {
          assert.equal(ret.length, 1);
          assert.equal(ret[0][0].toString(), ref);
          assert.equal(ret[0][2], type);
          assert.deepEqual(ret[0][1], { x: 5 * 100, y: 7 * 25, width: 6 * 100, height: 4 * 25 });
        }
      });
    });

    // merge in boder with two bedges
    borderTypes.forEach((type) => {
      const ref = 'G8:J11';
      it(`and border is ['${ref}', '${type}', 'thick', '#188038']`, () => {
        const border: Border = [ref, type, 'thick', '#188038'];
        let ret = borderRanges(area, border, areaMerges);
        if (type === 'all') {
          assert.equal(ret.length, 4);
          const refs = ['G8:J9', 'G10:H11', 'I10:J11'];
          for (let i = 0; i < 4; i++) {
            assert.equal(true, refs.includes(ret[i][0].toString()));
          }
          assert.equal(ret[0][2], type);
          assert.equal(ret[1][2], type);
          assert.equal(true, ['right', 'bottom'].includes(ret[2][2]));
          assert.equal(true, ['right', 'bottom'].includes(ret[3][2]));

          assert.deepEqual(ret[0][1], { x: 5 * 100, y: 7 * 25, width: 4 * 100, height: 2 * 25 });
          assert.deepEqual(ret[1][1], { x: 5 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
          assert.deepEqual(ret[2][1], { x: 7 * 100, y: 9 * 25, width: 200, height: 50 });
          assert.deepEqual(ret[3][1], { x: 7 * 100, y: 9 * 25, width: 200, height: 50 });
        } else if (type === 'inside') {
          assert.equal(ret.length, 4);

          assert.equal(ret[0][2], 'inside');
          assert.equal('G8:J9', ret[0][0].toString());
          assert.deepEqual(ret[0][1], { x: 5 * 100, y: 7 * 25, width: 4 * 100, height: 2 * 25 });

          assert.equal(ret[1][2], 'bottom');
          assert.equal('G8:J9', ret[1][0].toString());
          assert.deepEqual(ret[1][1], { x: 5 * 100, y: 7 * 25, width: 4 * 100, height: 2 * 25 });

          assert.equal(ret[2][2], 'inside');
          assert.equal('G10:H11', ret[2][0].toString());
          assert.deepEqual(ret[2][1], { x: 5 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });

          assert.equal(ret[3][2], 'right');
          assert.equal('G10:H11', ret[3][0].toString());
          assert.deepEqual(ret[3][1], { x: 5 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
        } else if (type === 'horizontal') {
          assert.equal(ret.length, 3);
        } else if (type === 'vertical') {
          assert.equal(ret.length, 3);
        } else {
          assert.equal(ret.length, 1);
          assert.equal(ret[0][0].toString(), ref);
          assert.equal(ret[0][2], type);
          assert.deepEqual(ret[0][1], { x: 5 * 100, y: 7 * 25, width: 4 * 100, height: 4 * 25 });
        }
      });
    });

    // merge in boder with three bedges
    borderTypes.forEach((type) => {
      const ref = 'I8:J11';
      it(`and border is ['${ref}', '${type}', 'thick', '#188038']`, () => {
        const border: Border = [ref, type, 'thick', '#188038'];
        let ret = borderRanges(area, border, areaMerges);
        if (type === 'all') {
          assert.equal(ret.length, 4);
          const refs = ['I8:J9', 'I10:J11'];
          for (let i = 0; i < 4; i++) {
            assert.equal(true, refs.includes(ret[i][0].toString()));
          }
          assert.equal(ret[0][2], type);
          assert.equal(ret[1][2], 'bottom');
          assert.equal(ret[2][2], 'left');
          assert.equal(ret[3][2], 'right');

          assert.deepEqual(ret[0][1], { x: 7 * 100, y: 7 * 25, width: 2 * 100, height: 2 * 25 });
          assert.deepEqual(ret[1][1], { x: 7 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
          assert.deepEqual(ret[2][1], { x: 7 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
          assert.deepEqual(ret[3][1], { x: 7 * 100, y: 9 * 25, width: 2 * 100, height: 2 * 25 });
        } else if (type === 'inside') {
          assert.equal(ret.length, 2);

          assert.equal(ret[0][2], 'inside');
          assert.equal('I8:J9', ret[0][0].toString());
          assert.deepEqual(ret[0][1], { x: 7 * 100, y: 7 * 25, width: 2 * 100, height: 2 * 25 });

          assert.equal(ret[1][2], 'bottom');
          assert.equal('I8:J9', ret[1][0].toString());
          assert.deepEqual(ret[1][1], { x: 7 * 100, y: 7 * 25, width: 2 * 100, height: 2 * 25 });
        } else if (type === 'horizontal') {
          assert.equal(ret.length, 2);
        } else if (type === 'vertical') {
          assert.equal(ret.length, 1);
        } else {
          assert.equal(ret.length, 1);
          assert.equal(ret[0][0].toString(), ref);
          assert.equal(ret[0][2], type);
          assert.deepEqual(ret[0][1], { x: 7 * 100, y: 7 * 25, width: 2 * 100, height: 4 * 25 });
        }
      });
    });
  });
});
