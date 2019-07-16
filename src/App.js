import React from 'react';
import './App.css';

class GameGrid extends React.Component {
  gridHeight;
  gridWidth;
  timer = null;

  constructor (props) {
    super(props);
    this.gridHeight = 40;
    this.gridWidth = 40;

    this.state = {
      running: false,
      grid: {},
    }
  }

  checkNeighbours (point) {
    let neighbours = 0;
    for (let y = -1; y < 2; y++){
      for (let x = -1; x < 2; x++){
        if(x === 0 && y === 0){
          continue;
        }
        let neighbour = [point[0]+x, point[1]+y];
        if (this.state.grid[neighbour]) {
          neighbours += 1;
        }
      }
    }
    return neighbours;
  }

  tick() {
    let nextGrid = {};
    Object.assign(nextGrid, this.state.grid);

    for (let y = 0; y < this.gridHeight; y++){
      // for every row...
      for (let x = 0; x < this.gridWidth; x++){
        // for every column...
        // check neighbour count at [col, row]
        let neighbourCount = this.checkNeighbours([x, y]);

        if (this.state.grid[[x, y]]){
          if (neighbourCount < 2 || neighbourCount > 3){
            delete nextGrid[[x, y]];
          }
        } else {
          if (neighbourCount === 3){
            nextGrid[[x, y]] = true;
          }
        }
      }
    }
    this.setState({grid: nextGrid});
  }

  handleClick (e) {
    let id = e.target.id;
    let point = id.split(',');
    // check if cell exists
    if (this.state.grid[point]){
      // if it does, get rid of it
      let grid = this.state.grid;
      delete grid[point];
      this.setState({grid: grid});
    } else {
      // if it doesn't, make it live!
      let grid = this.state.grid;
      grid[point] = true;
      this.setState({grid: grid});
    }
  }

  handleStart() {
    if(!this.state.running) {
      this.timer = setInterval(() => this.tick(), 250);
    } else {
      clearInterval(this.timer);
    }
    this.setState({running: !this.state.running});
  }

  renderCell (point) {
    if (this.state.grid[point]) {
      return (<td
        className="cell alive"
        key={point}
        id={point}
        onClick={(e) => {this.handleClick(e);}}
        ></td>);
    } else {
      return (<td
        className="cell"
        key={point}
        id={point}
        onClick={(e) => {this.handleClick(e);}}
        ></td>);
    }
  }

  renderRow (rowNumber) {
    let cells = [];
    for (let i = 0; i < this.gridWidth; i++) {
      cells.push(this.renderCell([i, rowNumber]));
    }

    return (<tr key={rowNumber}>{cells}</tr>);
  }

  render () {
    let table = [];
    for (let i = 0; i < this.gridHeight; i++) {
      table.push(this.renderRow(i));
    }

    return (
      <div>
        <table>
          <tbody>{table}</tbody>
        </table>
        <button
          onClick={() => this.handleStart()}
          >{!this.state.running ? 'Start' : 'Stop'}</button>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GameGrid className="game-grid" />
      </header>
    </div>
  );
}

export default App;
