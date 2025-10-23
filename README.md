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

## `class Linker`

Represents the connection between two consecutive stem sides.

Is composed of the last base of the preceding stem side,
the unpaired bases between the two stem sides,
and the first base of the following stem side.

A hairpin loop is an example of a linker.

Between every pair of neighboring stems there is a linker.

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var linker = new Linker(bases);

[...linker].length; // 6

// linkers must have at least two bases
new Linker([]); // throws
new Linker([bases[0]]); // throws
```

### `get bases()`

All bases in the linker.

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var linker = new Linker(bases);

[...linker.bases].length; // 6

// is synonymous to iterating over the linker itself
[...linker].length; // 6
```

### `get numBases()`

The number of bases in the linker.

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var linker = new Linker(bases);

linker.numBases; // 6
```

### `get firstBase()`

The first base in the linker
(i.e., the last base of the preceding stem side).

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var linker = new Linker(bases);

linker.firstBase; // bases[0]
```

### `get lastBase()`

The last base in the linker
(i.e., the first base of the following stem side).

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var linker = new Linker(bases);

linker.lastBase; // bases[5]
```

### `get unpairedBases()`

The unpaired bases in the linker
(i.e., all bases between the first and last bases).

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var linker = new Linker(bases);

[...linker.unpairedBases]; // bases.slice(1, 5)

// a linker with no unpaired bases
var linker = new Linker(bases.slice(0, 2));

[...linker.unpairedBases]; // []
```

### `get numUnpairedBases()`

The number of unpaired bases in the linker.

(Is always two less than the total number of bases in the linker.)

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var linker = new Linker(bases);

linker.numBases; // 6
linker.numUnpairedBases; // 4

// no unpaired bases
var linker = new Linker(bases.slice(0, 2));

linker.numBases; // 2
linker.numUnpairedBases; // 0
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

### `get numBases()`

The number of bases in the structure.

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

structure.numBases; // 6
```

### `get length()`

The number of bases in the structure.

(An alias for the `numBases()` getter.)

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

structure.length; // 6
```

### `atIndex()`

Returns the base at the zero-based index in the structure.

Throws for out-of-bounds indices.

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

structure.atIndex(0); // bases[0]
structure.atIndex(2); // bases[2]
structure.atIndex(5); // bases[5]

structure.atIndex(-1); // throws
structure.atIndex(6); // throws
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

### `atPosition()`

Returns the base at the one-based position in the structure.

Throws for out-of-bounds positions.

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

structure.atPosition(1); // bases[0]
structure.atPosition(3); // bases[2]
structure.atPosition(6); // bases[5]

structure.atPosition(0); // throws
structure.atPosition(7); // throws
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

### `get firstBase()`

The first base in the structure.

Throws for empty structures.

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var structure = new RadializableStructure(bases, []);
structure.firstBase; // bases[0]

// an empty structure
var structure = new RadializableStructure([], []);
structure.firstBase; // throws
```

### `get lastBase()`

The last base in the structure.

Throws for empty structures.

```javascript
// an array of nucleobase objects
var bases = [...'123456'].map(() => ({}));

var structure = new RadializableStructure(bases, []);
structure.lastBase; // bases[5]

// an empty structure
var structure = new RadializableStructure([], []);
structure.lastBase; // throws
```

### `subsequence()`

Returns the subsequence defined by a starting base and an ending base, inclusive.

The starting and ending base can be input to this method in either order.

(This method will never return the subsequence in reverse order.)

```javascript
// an array of nucleobase objects
var bases = [...'1234567890'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

[...structure.subsequence(bases[3], bases[7])]; // bases.slice(3, 7 + 1)

[...structure.subsequence(bases[7], bases[3])]; // bases.slice(3, 7 + 1)
```

This method will throw if either the starting base or ending base are not present in the structure.

### `interveningBases()`

Returns the subsequence of bases between two bases (not including the two bases themselves).

The two bases can be input to this method in either order.

(This method will never return the intervening bases in reverse order.)

```javascript
// an array of nucleobase objects
var bases = [...'1234567890123456'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

[...structure.interveningBases(bases[3], bases[9])]; // bases.slice(4, 8 + 1)
[...structure.interveningBases(bases[9], bases[3])]; // bases.slice(4, 8 + 1)

// when there are no intervening bases
[...structure.interveningBases(bases[3], bases[3])]; // []
[...structure.interveningBases(bases[3], bases[4])]; // []
```

This method will throw if either of the two bases input to it are not present in the structure.

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

### `isPaired()`

Returns `true` if the specified base is in a base-pair in the structure
and returns `false` otherwise.

```javascript
// an array of nucleobase objects
var bases = [...'1234567890'].map(() => ({}));

var basePairs = [
  [bases[2], bases[9]],
  [bases[3], bases[8]],
];

var structure = new RadializableStructure(bases, basePairs);

structure.isPaired(bases[2]); // true
structure.isPaired(bases[8]); // true

structure.isPaired(bases[0]); // false
structure.isPaired(bases[4]); // false
```

### `isUnpaired()`

Returns `true` if the specified base is not in a base-pair
and returns `false` otherwise.

```javascript
// an array of nucleobase objects
var bases = [...'1234567890'].map(() => ({}));

var basePairs = [
  [bases[2], bases[9]],
  [bases[3], bases[8]],
];

var structure = new RadializableStructure(bases, basePairs);

structure.isUnpaired(bases[2]); // false
structure.isUnpaired(bases[8]); // false

structure.isUnpaired(bases[0]); // true
structure.isUnpaired(bases[4]); // true
```

### `partnerOf()`

Returns the partner base for the specified base.

Throws if the specified base is unpaired
(or not present in the structure).

```javascript
// an array of nucleobase objects
var bases = [...'1234567890'].map(() => ({}));

var basePairs = [
  [bases[2], bases[8]],
  [bases[3], bases[7]],
];

var structure = new RadializableStructure(bases, basePairs);

structure.partnerOf(bases[2]); // bases[8]
structure.partnerOf(bases[7]); // bases[3]

// the first base doesn't have a partner
structure.partnerOf(bases[0]); // throws

structure.partnerOf({}); // throws
```

### `get firstPairedBase()`

The first paired base in the structure.

Throws if the structure does not have any paired bases.

```javascript
// an array of nucleobase objects
var bases = [...'12345678901234'].map(() => ({}));

var basePairs = [...parseDotBracket(bases, '..(((...)))...')];

var structure = new RadializableStructure(bases, basePairs);

structure.firstPairedBase; // bases[2]

// a structure without any paired bases
var structure = new RadializableStructure(bases, []);

structure.firstPairedBase; // throws
```

### `get lastPairedBase()`

The last paired base in the structure.

Throws if the structure does not have any paired bases.

```javascript
// an array of nucleobase objects
var bases = [...'12345678901234'].map(() => ({}));

var basePairs = [...parseDotBracket(bases, '..(((...)))...')];

var structure = new RadializableStructure(bases, basePairs);

structure.lastPairedBase; // bases[10]

// a structure without any paired bases
var structure = new RadializableStructure(bases, []);

structure.lastPairedBase; // throws
```

### `get stems()`

All stems in the structure.

```javascript
// an array of nucleobase objects
var bases = [...'12345678901234567890'].map(() => ({}));

var basePairs = [];

// stem 1
basePairs.push(
  [bases[1], bases[18]],
  [bases[2], bases[17]],
  [bases[3], bases[16]],
);

// stem 2
basePairs.push(
  [bases[5], bases[14]],
  [bases[6], bases[13]],
  [bases[7], bases[12]],
);

var structure = new RadializableStructure(bases, basePairs);

[...structure.stems].length; // 2

[...structure.stems][0].bottomBasePair[0]; // bases[1]
[...structure.stems][0].bottomBasePair[1]; // bases[18]

[...structure.stems][1].bottomBasePair[0]; // bases[5]
[...structure.stems][1].bottomBasePair[1]; // bases[14]
```

### `get numStems()`

The number of stems in the structure.

```javascript
// an array of nucleobase objects
var bases = [...'123456789012345678901234567890'].map(() => ({}));

var basePairs = [];

var structure = new RadializableStructure(bases, basePairs);

structure.numStems; // 0

var basePairs = [...parseDotBracket(bases, '..(((....))).((..(((...))).)).')];

var structure = new RadializableStructure(bases, basePairs);

structure.numStems; // 3
```

### `get linkers()`

All linkers in the structure.

```javascript
// an array of nucleobase objects
var bases = [...'123456789012345678901234'].map(() => ({}));

var basePairs = [...parseDotBracket(bases, '.(((....(((.....))).))).')];

var structure = new RadializableStructure(bases, basePairs);

[...structure.linkers].length; // 3

[...structure.linkers][0].firstBase; // bases[3]
[...structure.linkers][0].lastBase; // bases[8]

[...structure.linkers][1].firstBase; // bases[10]
[...structure.linkers][1].lastBase; // bases[16]

[...structure.linkers][2].firstBase; // bases[18]
[...structure.linkers][2].lastBase; // bases[20]
```

### `get numLinkers()`

The number of linkers in the structure.

```javascript
// an array of nucleobase objects
var bases = [...'123456789012345678901234567890'].map(() => ({}));

var basePairs = [];

var structure = new RadializableStructure(bases, basePairs);

structure.numLinkers; // 0

var basePairs = [...parseDotBracket(bases, '..(((....))).((..(((...))).)).')];

var structure = new RadializableStructure(bases, basePairs);

structure.numLinkers; // 5
```

### `get danglingBases5()`

The 5' dangling bases
(i.e., the bases preceding the first paired base in the structure).

```javascript
// an array of nucleobase objects
var bases = [...'123456789012345678'].map(() => ({}));

var basePairs = [...parseDotBracket(bases, '.....(((.....)))..')];

var structure = new RadializableStructure(bases, basePairs);

[...structure.danglingBases5]; // bases.slice(0, 5);
```

```javascript
// no 5' dangling bases
var basePairs = [...parseDotBracket(bases, '(((.....)))...')];

var structure = new RadializableStructure(bases, basePairs);

[...structure.danglingBases5]; // []
```

```javascript
// a structure with no base-pairs
var structure = new RadializableStructure(bases, []);

[...structure.danglingBases5]; // []
```

### `get danglingBases3()`

The 3' dangling bases
(i.e., the bases following the last paired base in the structure).

```javascript
// an array of nucleobase objects
var bases = [...'123456789012345678'].map(() => ({}));

var basePairs = [...parseDotBracket(bases, '...(((.....)))....')];

var structure = new RadializableStructure(bases, basePairs);

[...structure.danglingBases3]; // bases.slice(14, 18);
```

```javascript
// no 3' dangling bases
var basePairs = [...parseDotBracket(bases, '....((((......))))')];

var structure = new RadializableStructure(bases, basePairs);

[...structure.danglingBases3]; // []
```

```javascript
// a structure with no base-pairs
var structure = new RadializableStructure(bases, []);

[...structure.danglingBases3]; // []
```

### `spannedBases()`

Returns the subsequence between the two bases of a base-pair
(not including the two bases of the base-pair).

The two bases of the input base-pair can be ordered either way within the base-pair.

(This method will never return the spanned bases in reverse order.)

```javascript
// an array of nucleobase objects
var bases = [...'1234567890123456'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

[...structure.spannedBases([bases[3], bases[11]])]; // bases.slice(4, 10 + 1)
[...structure.spannedBases([bases[11], bases[3]])]; // bases.slice(4, 10 + 1)

// zero spanned bases
[...structure.spannedBases([bases[3], bases[3]])]; // []
[...structure.spannedBases([bases[3], bases[4]])]; // []
```

This method will throw if either base of the input base-pair is not present in the structure.

Note that it is allowed for the input base-pair to not be present in the structure,
so long as its two bases are present in the structure.

### `joinedBases()`

Returns the sequence of bases joined by a base-pair
(including the two bases in the base-pair).

The ordering of the two bases within the input base-pair doesn't matter.

(This method will never return the joined bases in reverse order.)

```javascript
// an array of nucleobase objects
var bases = [...'12345678901234567890'].map(() => ({}));

var structure = new RadializableStructure(bases, []);

[...structure.joinedBases([bases[5], bases[10]])]; // [...bases.slice(0, 5 + 1), ...bases.slice(10)]
[...structure.joinedBases([bases[10], bases[5]])]; // [...bases.slice(0, 5 + 1), ...bases.slice(10)]

// neighboring bases
[...structure.joinedBases([bases[5], bases[6]])]; // [...bases]

// a self-pair
[...structure.joinedBases([bases[5], bases[5]])]; // [...bases]
```

This method will throw if either base in the input base-pair is not present in the structure.

### `substructure()`

Returns the substructure defined by a starting base and an ending base, inclusive.

Only base-pairs involving bases exclusively within the substructure are included.

The starting and ending bases can be input to this method in either order.

(This method will never return the substructure in reverse order.)

```javascript
// an array of nucleobase objects
var bases = [...'123456789012345678901234'].map(() => ({}));

var basePairs = [];

// an outer stem
basePairs.push(
  [bases[1], bases[21]],
  [bases[2], bases[20]],
  [bases[3], bases[19]],
);

// an inner stem
basePairs.push(
  [bases[6], bases[16]],
  [bases[7], bases[15]],
  [bases[8], bases[14]],
);

var structure = new RadializableStructure(bases, basePairs);

var substructure = structure.substructure(bases[5], bases[17]);

[...substructure.bases]; // bases.slice(5, 17 + 1)

[...substructure.basePairs].length; // 3

[...[...substructure.basePairs][0]]; // [bases[6], bases[16]]
[...[...substructure.basePairs][1]]; // [bases[7], bases[15]]
[...[...substructure.basePairs][2]]; // [bases[8], bases[14]]
```

This method will throw if either the starting base or the ending base are not present in the structure.

### `mountainPlotHeight()`

Returns the mountain plot height for a given base
in the mountain plot traversal of the structure.

Throws if the given base is not in the structure.

```javascript
// an array of nucleobase objects
var bases = [...'123456789012345'].map(() => ({}));

bases.length; // 15

var basePairs = [
  [bases[2], bases[11]],
  [bases[3], bases[10]],
  [bases[4], bases[9]],
];

var structure = new RadializableStructure(bases, basePairs);

structure.mountainPlotHeight(bases[0]); // 0
structure.mountainPlotHeight(bases[1]); // 0
structure.mountainPlotHeight(bases[2]); // 0
structure.mountainPlotHeight(bases[3]); // 1
structure.mountainPlotHeight(bases[4]); // 2
structure.mountainPlotHeight(bases[5]); // 3
structure.mountainPlotHeight(bases[6]); // 3
structure.mountainPlotHeight(bases[7]); // 3
structure.mountainPlotHeight(bases[8]); // 3
structure.mountainPlotHeight(bases[9]); // 2
structure.mountainPlotHeight(bases[10]); // 1
structure.mountainPlotHeight(bases[11]); // 0
structure.mountainPlotHeight(bases[12]); // 0
structure.mountainPlotHeight(bases[13]); // 0
structure.mountainPlotHeight(bases[14]); // 0
```
