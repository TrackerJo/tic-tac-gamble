import { TileIndex, type Board, type PlayerSymbol } from '../constants'
import './board_display.css'
import TileDisplay from './tile_display'

type BoardDisplayProps = {
    board: Board,
    onTileAction: (tileIndex: TileIndex, player: PlayerSymbol, newTurn: PlayerSymbol) => void,
    turn: PlayerSymbol,

}

function BoardDisplay({ board, turn, onTileAction }: BoardDisplayProps) {
    return (
        <div className="board">
            {board.grid.map((row, rowIndex) => (
                <div key={rowIndex} className="board-row">
                    {row.map((tile, colIndex) => (
                        <TileDisplay key={colIndex} tile={tile} board={board} turn={turn} onTileAction={(player, newTurn) => {
                            onTileAction(new TileIndex(colIndex, rowIndex), player, newTurn);
                        }} />
                    ))}
                </div>
            ))}
        </div>
    )
}

export default BoardDisplay
