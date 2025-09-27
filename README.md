# Installation

With `npm`:

```
npm install @rnacanvas/base-pairs.oopified
```

# Usage

All exports of this package can be accessed as named imports.

```javascript
// some example imports
import { BasePair, Stem } from '@rnacanvas/base-pairs.oopified';
import { RadializableStructure } from '@rnacanvas/base-pairs.oopified';
```

## `class BasePair`

A pairing of two nucleobase objects.

```javascript
// two nucleobase objects
var base1 = {};
var base2 = {};

var basePair = new BasePair(base1, base2);

basePair[0]; // the first base
basePair[1]; // the second base

// is iterable
[...basePair];
```

### `deepCopy()`

Returns a new base-pair object that pairs the same two bases (in the same order).

```javascript
var base1 = {};
var base2 = {};

var bp1 = new BasePair(base1, base2);

var bp2 = bp1.deepCopy();

bp1[0] === bp2[0]; // true
bp1[1] === bp2[1]; // true
```

## `class RadializableStructure`

A structure amenable to radializing layout drawing algorithms.

Repeat base-pairs, conflicting base-pairs, self base-pairs and base-pairs creating pseudoknots
are omitted from the structure at construction.

Pseudoknots are omitted according to the incremental range heuristic (see [Smit et al., 2008](https://zeus.few.vu.nl/programs/k2nwww/static/method.html)).

```javascript
// an array of nucleobase objects
var bases = [...'1234567890123456'].map(() => ({}));

// an array of base-pair tuples (creating a stem)
var basePairs = [
  [bases[0], bases[9]],
  [bases[1], bases[8]],
  [bases[2], bases[7]],
];

var structure1 = new RadializableStructure(bases, basePairs);

[...structure1.basePairs].length; // 3

// a repeat base-pair
basePairs.push([bases[0], bases[9]]);

// a conflicting base-pair
// (the first base is already paired with the tenth base)
basePairs.push([bases[0], bases[10]]);

// a self base-pair
basePairs.push([bases[5], bases[5]]);

// a base-pair creating a pseudoknot
basePairs.push([bases[3], bases[11]]);

// will be equal to structure 1
var structure2 = new RadializableStructure(bases, basePairs);

[...structure2.basePairs].length; // 3
```

### `get bases()`

All bases in the structure.

The ordering of bases in this iterable is the ordering of bases in the structure.

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

[...structure.bases].length; // 6
```

### `get basePairs()`

All base-pairs in the structure.

(An iterable of base-pair objects.)

```javascript
// an array of nucleobase objects
var bases = [...'123456789'].map(() => ({}));

var basePairs = [
  [bases[0], bases[9]],
  [bases[1], bases[8]],
  [bases[2], bases[7]],
];

var structure = new RadializableStructure(bases, basePairs);

[...structure.basePairs].length; // 3

[...structure.basePairs][0]; // [bases[0], bases[9]]
[...structure.basePairs][1]; // [bases[1], bases[8]]
[...structure.basePairs][2]; // [bases[2], bases[7]]
```

### `indexOf()`

Returns the zero-based index of the specified base
in the sequence of bases for the structure.

Throws if the base is not in the structure.

```javascript
// an array of nucleobase objects
var bases = [...'1234567890'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

structure.indexOf(bases[0]); // 0
structure.indexOf(bases[2]); // 2
structure.indexOf(bases[6]); // 6

structure.indexOf({}); // throws
```

### `positionOf()`

Returns the one-based position of the specified base
in the sequence of bases for the structure.

Throws if the base is not in the structure.

```javascript
// an array of nucleobase objects
var bases = [...'1234567890'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

structure.positionOf(bases[0]); // 1
structure.positionOf(bases[2]); // 3
structure.positionOf(bases[6]); // 7

structure.positionOf({}); // throws
```
