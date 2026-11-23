import { expect } from 'chai'
import get from '../../src/get.js'

describe('get', () => {
  const object = {
    a: [{ b: { c: 3 } }],
    count: 0,
    active: false,
    empty: '',
    nothing: null,
    missing: undefined
  };

  describe('Normal cases', () => {
    it('returns a top-level property', () => {
      expect(get(object, 'count')).to.equal(0);
    });

    it('returns a nested value using string path', () => {
      expect(get(object, 'a[0].b.c')).to.equal(3);
    });

    it('returns a nested value using array path', () => {
      expect(get(object, ['a', '0', 'b', 'c'])).to.equal(3);
    });

    it('returns an object at the specified path', () => {
      expect(get(object, 'a[0].b')).to.deep.equal({ c: 3 });
    });
  });

  describe('Equivalence classes', () => {
    it('preserves false instead of returning default', () => {
      expect(get(object, 'active', true)).to.equal(false);
    });

    it('preserves null instead of returning default', () => {
      expect(get(object, 'nothing', 'default')).to.be.null;
    });

    it('returns default for an undefined property', () => {
      expect(get(object, 'missing', 'default')).to.equal('default');
    });

    it('returns default for a nonexistent property', () => {
      expect(get(object, 'unknown', 'default')).to.equal('default');
    });

    it('returns undefined when no default is provided', () => {
      expect(get(object, 'unknown')).to.be.undefined;
    });
  });

  describe('Boundary values', () => {
    it('returns the first array element', () => {
      expect(get({ items: [10, 20] }, 'items[0]')).to.equal(10);
    });

    it('returns default for an out-of-bounds index', () => {
      expect(get({ items: [10, 20] }, 'items[2]', 'default'))
        .to.equal('default');
    });

    it('returns default for a missing nested property', () => {
      expect(get(object, 'a[0].b.unknown', 'default'))
        .to.equal('default');
    });
  });

  describe('Invalid and missing inputs', () => {
    it('returns default when object is null', () => {
      expect(get(null, 'a', 'default')).to.equal('default');
    });

    it('returns default when object is undefined', () => {
      expect(get(undefined, 'a', 'default')).to.equal('default');
    });

    it('returns default for a missing property in an empty object', () => {
      expect(get({}, 'a', 'default')).to.equal('default');
    });
  });
});
