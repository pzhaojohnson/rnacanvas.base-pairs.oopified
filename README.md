# Installation

With `npm`:

```
npm install @rnacanvas/base-pairs.oopified
```

# Usage

All exports of this package can be accessed as named imports.

```javascript
// some example imports
import { BasePair } from '@rnacanvas/base-pairs.oopified';
import { Stem } from '@rnacanvas/base-pairs.oopified';
```

## `class RadializableStructure`

A structure amenable to radializing layout drawing algorithms.

Repeat base-pairs, conflicting base-pairs, self base-pairs and base-pairs creating pseudoknots
are omitted from the structure at construction.

Pseudoknots are omitted according to the incremental range heuristic ([Smit et al., 2008](https://pubmed.ncbi.nlm.nih.gov/18230758/)).

```javascript
// an array of nucleobase objects
var bases = [...'1234567890123456'].map(() => ({}));

// an array of base-pair tuples
// (creating a stem)
var basePairs = [
  [bases[0], bases[9]],
  [bases[1], bases[8]],
  [bases[2], bases[7]],
];

var structure1 = new RadializableStructure(bases, basePairs);

// repeat base-pair
basePairs.push([bases[0], bases[9]]);

// conflicting base-pair
// (the first base is already paired with the tenth base)
basePairs.push([bases[0], bases[10]]);

// self base-pair
basePairs.push([bases[5], bases[5]]);

// a base-pair creating a pseudoknot
basePairs.push([bases[3], bases[11]]);

// will be equal to structure 1
var structure2 = new RadializableStructure(bases, basePairs);
```
