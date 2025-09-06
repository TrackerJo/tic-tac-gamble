import { StrictMode, useEffect, useRef } from 'react'


import './App.css'

import { createRoot } from 'react-dom/client'
import './index.css'
import OnlineGameDialog from './components/online_game_dialog'
import { signInAnon } from './firebase/auth'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

function App() {
  const onlineGameDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    signInAnon();
  }, []);

  return (
    <>
      <h2 className='title'>Tic Tac Gamble</h2>
      <div className={`actions`} >
        <button onClick={() => {
          window.location.href += 'Local/'
        }}>Local Game</button>
        <button onClick={() => {
          onlineGameDialogRef.current?.showModal();
        }}>Online Game</button>


      </div >

      <OnlineGameDialog dialogRef={onlineGameDialogRef} closeDialog={() => {
        onlineGameDialogRef.current?.close();
      }} />

    </>
  )
}

export default App
