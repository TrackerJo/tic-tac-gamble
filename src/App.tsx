import { useState, StrictMode, useEffect, useCallback } from 'react'


import './App.css'

import { createRoot } from 'react-dom/client'
import './index.css'
import { Board, PlayerSymbol, TileIndex, TurnStage } from './constants'
import BoardDisplay from './components/board_display'
import Dice from './components/dice'
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

  useEffect(() => {
    const newBoard = new Board()
    newBoard.initi(3, 3)
    setBoard(newBoard)
  }, [])



  const handleTileAction = (tileIndex: TileIndex, player: PlayerSymbol, newTurn: PlayerSymbol) => {


    const newBoard = board.clone(); // implement a clone method that deep copies tiles
    if (turnStage === TurnStage.INVESTING) {
      if (pointsToInvest <= 0) return;

      newBoard.grid[tileIndex.y][tileIndex.x].investPoints(player, 1);
      setPointsToInvest(pointsToInvest - 1);
      if (pointsToInvest - 1 <= 0) {
        setTimeout(() => {
          setTurn(newTurn);
          setTurnStage(TurnStage.ROLLING);
        }, 500);
      }
    }

    newBoard.checkWin(); // or however you determine the winner
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

      } else {
        setPointsToInvest(0);
        setGambleAmount(1);
        setTurn(turn === 'X' ? 'O' : 'X');
        return;
      }
      setGambleAmount(1);

    } else {
      setGambleAmount(1);
      setPointsToInvest(roll);
      setTurnStage('INVESTING');
    }
    setIsRolling(false);
  };



  return (
    <>
      <h2 className='title'>Tic Tac Gamble</h2>
      <div className={`App ${turnStage}`} >

        {board.winner ? <h2> Winner: {board.winner} </h2> : <h2>Current Turn: <span className={`${turn}-indicator`}>{turn}</span></h2>}



        {
          turnStage === TurnStage.INVESTING ? <>
            {!board.winner && <label htmlFor="" className='points-to-invest'>Points To Invest: {pointsToInvest}</label>}


            <BoardDisplay board={board} turn={turn} onTileAction={handleTileAction} />
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
