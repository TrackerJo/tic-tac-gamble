import { useState, StrictMode, useEffect, } from 'react'


import './online.css'

import { createRoot } from 'react-dom/client'
import '../index.css'
import { Board, Player, PlayerSymbol, TileIndex, TurnStage, Tile } from '../constants'
import BoardDisplay from '../components/board_display'
import Dice from '../components/dice'
import { signInAnon } from '../firebase/auth'

import { listenToGameUpdates, updateBoardState, updateGameState } from '../firebase/db'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

function App() {
  const [board, setBoard] = useState<Board>(new Board())
  const [turn, setTurn] = useState<PlayerSymbol>('X')
  const [pointsToInvest, setPointsToInvest] = useState<number>(5)
  const [turnStage, setTurnStage] = useState<TurnStage>('ROLLING')
  const [gambleAmount, setGambleAmount] = useState<number>(1)
  const [isGambling, setIsGambling] = useState<boolean>(false)
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>('');
  const [gameCode, setGameCode] = useState<string>('');
  const [players, setPlayers] = useState<{ [key: string]: Player }>({});
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);


  useEffect(() => {
    signInAnon();
  }, []);
  useEffect(() => {
    const newBoard = new Board()
    newBoard.initi(3, 3)
    setBoard(newBoard)
    setUserId(localStorage.getItem("userId")!);
    const urlParams = new URLSearchParams(window.location.search);
    const gameCodeParam = urlParams.get('gameCode');
    if (gameCodeParam) {
      setGameCode(gameCodeParam);
    }
    updateBoardState(gameCodeParam!, newBoard);
    listenToGameUpdates(gameCodeParam!, (data) => {
      console.log('Game data updated:', data);
      if (data) {
        const playersObj: { [key: string]: Player } = {};
        Object.keys(data.players).forEach((key) => {
          const p = data.players[key] as {
            displayName: string;
            symbol: PlayerSymbol;
            isTurn: boolean;
            pointsToInvest: number;
            isGambling: boolean;
            gambleAmount: number;
            playerId: string;
          };
          playersObj[key] = new Player({
            displayName: p.displayName,
            symbol: p.symbol,
            isTurn: p.isTurn,
            pointsToInvest: p.pointsToInvest,
            isGambling: p.isGambling,
            gambleAmount: p.gambleAmount,
            playerId: p.playerId
          });
        });
        setPlayers(playersObj);
        console.log('Current Players:', playersObj);
        const current = Object.values(playersObj).find((p) => p.playerId === localStorage.getItem("userId")!);
        console.log('Current Player:', current);
        if (current) {
          setCurrentPlayer(new Player({
            displayName: current.displayName,
            symbol: current.symbol,
            isTurn: current.isTurn,
            pointsToInvest: current.pointsToInvest,
            isGambling: current.isGambling,
            gambleAmount: current.gambleAmount,
            playerId: current.playerId
          }));


        }
        const playersWhoTurn = Object.values(playersObj).find((p) => p.isTurn);
        if (playersWhoTurn) {
          setTurn(playersWhoTurn.symbol);
          setPointsToInvest(playersWhoTurn.pointsToInvest);
          setIsGambling(playersWhoTurn.isGambling);
          setGambleAmount(playersWhoTurn.gambleAmount);
        }

        if (data.board) {
          const newBoard = new Board();
          newBoard.grid = data.board.grid.map((row: any[]) => row.map((tile: any) => {
            const newTile = new Tile();
            newTile.claimedBy = tile.claimedBy;
            newTile.investedPoints = tile.investedPoints;
            return newTile;
          }));
          newBoard.winner = data.board.winner;
          setBoard(newBoard);
        }
      } else {
        window.location.href = window.location.href.replace('Online/?gameCode=' + gameCodeParam!.toString(), '');
      }
    });
  }, [])



  const handleTileAction = (tileIndex: TileIndex, player: PlayerSymbol, newTurn: PlayerSymbol) => {


    const newBoard = board.clone(); // implement a clone method that deep copies tiles
    if (turnStage === TurnStage.INVESTING) {
      console.log('Handling tile action at', tileIndex, 'by player', player, 'new turn will be', newTurn);
      if (pointsToInvest <= 0) return;

      newBoard.grid[tileIndex.y][tileIndex.x].investPoints(player, 1);
      setPointsToInvest(pointsToInvest - 1);
      const newPlayers = { ...players };

      newPlayers[currentPlayer!.playerId].pointsToInvest = pointsToInvest - 1;

      updateGameState(gameCode, newPlayers);
      if (pointsToInvest - 1 <= 0) {
        setTimeout(() => {
          setTurn(newTurn);
          setTurnStage(TurnStage.ROLLING);
          const newPlayers = { ...players };
          newPlayers[currentPlayer!.playerId].isTurn = false;
          const otherPlayer = Object.values(newPlayers).find(p => p.playerId !== currentPlayer!.playerId);
          if (otherPlayer) {
            newPlayers[otherPlayer.playerId].isTurn = true;
          }
          updateGameState(gameCode, newPlayers);
        }, 500);
      }
    }

    newBoard.checkWin(); // or however you determine the winner
    updateBoardState(gameCode, newBoard);
    setBoard(newBoard);
  };

  const handleRoll = (roll: number) => {

    console.log('Rolled:', roll, isGambling, gambleAmount);
    setIsRolling(false);
    if (isGambling) {
      setIsGambling(false);

      if (roll === gambleAmount) {
        setPointsToInvest(roll * 2);
        setTurnStage('INVESTING');
        const newPlayers = { ...players };
        newPlayers[currentPlayer!.playerId].isGambling = false;
        newPlayers[currentPlayer!.playerId].pointsToInvest = roll * 2;
        newPlayers[currentPlayer!.playerId].gambleAmount = 1;
        updateGameState(gameCode, newPlayers);

      } else {
        setPointsToInvest(0);
        setGambleAmount(1);
        setTurn(turn === 'X' ? 'O' : 'X');
        const newPlayers = { ...players };
        newPlayers[currentPlayer!.playerId].isGambling = false;
        newPlayers[currentPlayer!.playerId].pointsToInvest = 0;
        newPlayers[currentPlayer!.playerId].gambleAmount = 1;
        newPlayers[currentPlayer!.playerId].isTurn = false;
        const otherPlayer = Object.values(newPlayers).find(p => p.playerId !== currentPlayer!.playerId);
        if (otherPlayer) {
          newPlayers[otherPlayer.playerId].isTurn = true;
        }
        updateGameState(gameCode, newPlayers);
        return;
      }
      setGambleAmount(1);

    } else {
      setGambleAmount(1);
      setPointsToInvest(roll);
      setTurnStage('INVESTING');
      const newPlayers = { ...players };
      newPlayers[currentPlayer!.playerId].isGambling = false;
      newPlayers[currentPlayer!.playerId].pointsToInvest = roll;
      newPlayers[currentPlayer!.playerId].gambleAmount = 1;
      updateGameState(gameCode, newPlayers);
    }
    setIsRolling(false);
  };



  return (
    <>
      <h2 className='title'>Tic Tac Gamble</h2>
      <div className={`App ${!currentPlayer?.isTurn ? "INVESTING" : turnStage}`} >

        {board.winner != PlayerSymbol.EMPTY ? <h2> Winner: {board.winner} </h2> : <h2>Current Turn: <span className={`${turn}-indicator`}>{turn}</span></h2>}



        {board.winner != PlayerSymbol.EMPTY ? <></> :
          turnStage === TurnStage.INVESTING || !currentPlayer?.isTurn ? <>
            {board.winner == PlayerSymbol.EMPTY && <label htmlFor="" className='points-to-invest'>Points To Invest: {pointsToInvest}</label>}


            <BoardDisplay board={board} turn={turn} onTileAction={handleTileAction} canPlay={currentPlayer?.isTurn || false} />
          </> : turnStage === TurnStage.ROLLING ? <>

            <Dice onRoll={handleRoll} startRolling={() => setIsRolling(true)} />
            {isGambling ? <div className='gamble-info'><h2>You need a {gambleAmount}!</h2></div> : !isRolling ? <><input type="number" name="gamble" id="gamble-amount" className='gamble-input' min={1} max={6} value={gambleAmount} onChange={(e) => {

              setGambleAmount(Math.min(6, Math.max(1, parseInt(e.target.value))));
            }} />
              {gambleAmount ? <button className='gamble-button' onClick={() => {
                setIsGambling(true);
              }}>
                Gamble
              </button> : <></>} </> : <></>}

          </> : <div>Stealing Stage - Not Implemented</div>
        }

      </div >

    </>
  )
}

export default App
