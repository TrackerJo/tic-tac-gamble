
import { PlayerSymbol, type Board, type Tile } from "../constants";
import "./tile_display.css";

type TileDisplayProps = {
    board: Board,
    tile: Tile,
    onTileAction: (player: PlayerSymbol, newTurn: PlayerSymbol) => void,
    turn: PlayerSymbol,

}

function TileDisplay({ tile, onTileAction, turn, board }: TileDisplayProps) {

    const handleTileClick = () => {
        console.log('Tile clicked');
        console.log(turn);
        console.log(tile);
        console.log(board);
        if (tile.claimedBy !== ' ' || board.winner != PlayerSymbol.EMPTY) return;
        onTileAction(turn, turn === 'X' ? 'O' : 'X');
    }

    return (
        <div className="tile" onClick={() => {
            handleTileClick();
        }}>
            {tile.claimedBy !== ' ' ? <h2 className="claimedBy">{tile.claimedBy}</h2> : <div
                className="investedPoints">
                <label htmlFor="" className="x-points">{tile.investedPoints[PlayerSymbol.X]}</label>
                <label htmlFor="" className="o-points">{tile.investedPoints[PlayerSymbol.O]}</label>
            </div>}

        </div>
    )
}

export default TileDisplay