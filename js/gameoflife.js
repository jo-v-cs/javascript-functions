function seed(a,b,c) {
  return Array.of(...arguments);
}

function same([x, y], [j, k]) {
  if (arguments[0][0] === arguments[1][0] && arguments[0][1] === arguments[1][1]) {
    return true;
  }
  else {
    return false;
  }
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  for (let i = 0; i < this.length; i++) {
    // Compare the two cells
    if (same(cell, this[i])) {
      return true;
    }
  }
  // Cell was not found in current state
  return false;
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)) {
    return '\u25A3';
  }
  else {
    return '\u25A2';
  }
};

const corners = (state = []) => {
  let topRight = [0,0];
  let bottomLeft = [0,0];

  // If state is NOT empty
  if (state.length !== 0) {
    // Iterate over state
    state.forEach((cell, i) => {
      if (i === 0) {
        // Initialize using first cell
        topRight[0] = bottomLeft[0] = cell[0];
        topRight[1] = bottomLeft[1] = cell[1];
      }
      
      if (topRight[0] < cell[0])
      {
        topRight[0] = cell[0];
      }
      if (topRight[1] < cell[1])
      {
        topRight[1] = cell[1];
      }
      if (bottomLeft[0] > cell[0])
      {
        bottomLeft[0] = cell[0];
      }
      if (bottomLeft[1] > cell[1])
      {
        bottomLeft[1] = cell[1];
      }
    })
  }
  return {'topRight': topRight, 'bottomLeft': bottomLeft};
};

const printCells = (state) => {
  let corner = corners(state);
  let stateRepresentation = "";
  console.log(corner);
  let height = corner.topRight[1] - corner.bottomLeft[1];
  let width = corner.topRight[0] - corner.bottomLeft[0];
  console.log(height + ' ' + width);
  for (let i = corner.bottomLeft[0]; i <= corner.topRight[0]; i++) {
    for (let j = corner.bottomLeft[1]; j <= corner.topRight[1]; j++) {
      console.log("Result: " + printCell([i,j], state));
      stateRepresentation += printCell([i,j], state);
      console.log("Current state representation: " + stateRepresentation);
      if (j != 2) {
        stateRepresentation += ' ';
      } 
    }
    stateRepresentation += '\n';
  }

  console.log(stateRepresentation);
  return stateRepresentation;
};

const getNeighborsOf = ([x, y]) => {
  return [[x-1,y-1],[x-1,y],[x-1,y+1],[x,y-1],[x,y+1],[x+1,y-1],[x+1,y],[x+1,y+1]];
};

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell);
  let livingNeighbors = [];
  contains = contains.bind(state);
  for (let cell of neighbors) {
    if (contains(cell)) {
      livingNeighbors.push(cell);
    }
  }
  return livingNeighbors;
};

const willBeAlive = (cell, state) => {
  let numberOfLivingNeighbors = getLivingNeighbors(cell, state).length;

  if (numberOfLivingNeighbors == 3) {
    return true;
  }
  if (contains.call(state, cell) && numberOfLivingNeighbors == 2)
  {
    return true;
  }
  else {
    return false;
  }
};

const calculateNext = (state) => {
  console.log("Old game state: " + JSON.stringify(state));
  let newState = [];
  // Get corners of current state
  let corner = corners(state);
  console.log("Old corners: " + corner.topRight + " " + corner.bottomLeft);
  // Get new expanded grid corners
  corner.topRight[0] += 1;
  corner.topRight[1] += 1;
  corner.bottomLeft[0] -= 1;
  corner.bottomLeft[1] -= 1;
  console.log("New corners: " + corner.topRight + " " + corner.bottomLeft);
  // Iterate over new grid
  for (let i = corner.bottomLeft[0]; i <= corner.topRight[0]; i++) {
    for (let j = corner.bottomLeft[1]; j <= corner.topRight[1]; j++) {
      if (willBeAlive([i,j], state)) {
        newState.push([i,j]);
      }
    }
  }

  console.log("New game state: " + JSON.stringify(newState));
  return newState;
};

const iterate = (state, iterations) => {};

const main = (pattern, iterations) => {};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;