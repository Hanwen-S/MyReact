import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
        {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            numMoves: 0,
            selected: false,
            selectedPie: null,
            centerError: false
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (calculateWinner(squares)) {
            return;
        }

        const curPlayer = this.state.xIsNext ? 'X' : 'O';
        if (this.state.numMoves < 6) {
            if (squares[i]) {
                return;
            }
            squares[i] = curPlayer;
            this.setState({
                squares: squares,
                xIsNext: !this.state.xIsNext,
                numMoves: this.state.numMoves+1
            });
        }
        else {
            if (!this.state.selected) {
                if (squares[i] !== curPlayer) {
                    return;
                }
                this.setState({
                    selected: true,
                    selectedPie: i,
                    centerError: false
                })
            }
            else {
                const occupiedCenter = squares[4] === curPlayer;
                if (!canMove(squares, this.state.selectedPie, i)) {
                    return;
                }
                squares[this.state.selectedPie] = null;
                squares[i] = curPlayer;
                if (occupiedCenter && !calculateWinner(squares) && squares[4]) {
                    this.setState({
                        selected: false,
                        centerError: true
                    });
                    return;
                }
                this.setState({
                    squares: squares,
                    xIsNext: !this.state.xIsNext,
                    selected: false
                })
            }
        }
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        const nextPlayer = this.state.xIsNext ? 'X' : 'O';
        const [status1, status2, status3] = getStatusMsgs(winner, nextPlayer, this.state.numMoves, this.state.selected, this.state.centerError);

        return (
            <div>
                <div className="status">{status1}</div>
                <div className="status">{status2}</div>
                <div className="status">{status3}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function getStatusMsgs(winner, nextPlayer, numMoves, selected, centerError) {
    let status1, status2, status3;
    if (winner) {
        status1 = 'Winner: ' + winner;
    }
    else {
        status1 = 'Next player: ' + nextPlayer;
        if (numMoves < 6) {
            status2 = 'You can occupy an empty square by clicking on it.';
        }
        else {
            status2 = 'You can move one of your existing pieces to an adjacent empty square.';
            if (centerError) {
                status3 = 'Invalid move! Since one of your pieces is in the center square, you must either win or vacate the center square. Now, reselect one of your existing pieces by clicking on it.';
            }
            else if (!selected) {
                status3 = 'Now, select one of your existing pieces by clicking on it.';
            }
            else {
                status3 = "You have selected the piece to move. Now, select an adjacent empty square by clicking on it.";
            }
        }
    }
    return [status1, status2, status3];
}

function canMove(squres, start, dest) {
    if (squres[dest]) {
        return false;
    }
    const lines = [
        [1, 3, 4],
        [0, 2, 3, 4, 5],
        [1, 4, 5],
        [0, 1, 4, 6, 7],
        [0, 1, 2, 3, 5, 6, 7, 8],
        [1, 2, 4, 7, 8],
        [3, 4, 7],
        [3, 4, 5, 6, 8],
        [4, 5, 7]
    ];
    for (let i = 0; i < lines[start].length; i++) {
        if (lines[start][i] === dest) {
            return true;
        }
    }
    return false;
}
