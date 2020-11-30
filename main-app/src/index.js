import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Function component, for when a component only requires a render method
function Square(props) {
    return (
        <button
            className={"square " + props.class}
            onClick={props.onClick}
        >
            {/* Render value received from props */}
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const winner = calculateWinner(this.props.squares);
        const winSquare = (winner && winner.indices.includes(i));
        // Passing in state.squares[i] to Square as prop value
        return (
            <Square
                value={this.props.squares[i]}
                // Pass Square onClick(), as it Square can't directly update Game's state
                onClick={() => this.props.onClick(i)}
                class={(winSquare) ? 'highlight' : ''}
                key={i}
            />
        );
    }

    render() {
        let board = [];
        let row = []
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare((i * 3) + j));
            }
            board.push(
            <div key={'row' + i} className="board-row">
                {row}
            </div>
            );
            row = [];
        }
        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        // Required when defining constructor of a subclass
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                description: 'No Move.'
            }],
            stepNumber: 0,
            xIsNext: true,
            reverseSteps: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i])
            return;
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const description = squares[i] + ': (' + getCol(i) + ', ' + getRow(i) + ')'; 
        this.setState({
            history: history.concat([{
                squares: squares,
                description: description,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = [];
        history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const moveDesc = ' - ' + history[move].description;
            const isCurrent = move === this.state.stepNumber;
            // If reversed, always insert moves to the front of the list (reverse order)
            const pos = (this.state.reverseSteps) ? 0 : moves.length;
            moves.splice(pos, 0,
                <li 
                    key={move}
                    style={{fontWeight: (isCurrent) ? 'bold' : 'normal'}}    
                >
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    {moveDesc}
                </li>
            );
        });

        let status;
        if (winner)
            status = 'Winner: ' + winner.winner;
        else
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.setState({reverseSteps: !this.state.reverseSteps})}>Toggle Order</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

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
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], indices: [a, b, c]};
        }
    }
    return null;
}

function getCol(i) {
    return Math.floor(i / 3);
}

function getRow(i) {
    return i % 3;
}