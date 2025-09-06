import { useState, type RefObject } from 'react';
import './online_game_dialog.css';
import { createGame, deleteGame, joinGame, waitForOtherPlayer } from '../firebase/db';




type OnlineGameDialogProps = {
    dialogRef: RefObject<HTMLDialogElement | null>;
    closeDialog: () => void;


};

function OnlineGameDialog({ dialogRef, closeDialog }: OnlineGameDialogProps) {
    const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);
    const [isJoiningGame, setIsJoiningGame] = useState<boolean>(false);
    const [gameCode, setGameCode] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [createdOnlineGame, setCreatedOnlineGame] = useState<boolean>(false);

    const generateGameCode = () => {
        const characters = '0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }


    return (
        <dialog ref={dialogRef} className="online-game-dialog">
            <div className="online-game-dialog-div" >
                <h2>Online Game</h2>

                {!isCreatingGame && !isJoiningGame && <div className='options'>
                    <button className='action-button' onClick={() => {
                        const newGameCode = generateGameCode();
                        console.log(newGameCode);
                        setGameCode(newGameCode);
                        setIsCreatingGame(true);
                        setIsJoiningGame(false);
                    }}>
                        Create Game
                    </button>
                    <button className='action-button' onClick={() => {
                        setIsJoiningGame(true);
                        setIsCreatingGame(false);
                    }}>
                        Join Game
                    </button>

                </div>}

                {isCreatingGame && !createdOnlineGame && <div className='create-game-section'>
                    <label htmlFor="game-code">Game Code: {gameCode}</label>

                    <label htmlFor="display-name">Display Name:</label>
                    <input type="text" id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />

                    {isLoading ? <div className='loader'>

                    </div> : <button className='action-button' onClick={async () => {
                        if (displayName.trim() === '') {
                            alert('Please enter a display name.');
                            return;
                        }
                        setIsLoading(true);
                        await createGame(gameCode, localStorage.getItem("userId")!, displayName);
                        setIsLoading(false);
                        setCreatedOnlineGame(true);
                        waitForOtherPlayer(gameCode);
                        // Here you would normally create the game on the server

                    }}>Create</button>}
                </div>}
                {isCreatingGame && createdOnlineGame && <div className='game-created-section'>
                    <h3>Game Created!</h3>
                    <p>Share this game code with a friend to join:</p>
                    <h2 className='game-code-display'>{gameCode}</h2>
                    <p>Waiting for another player to join...</p>
                </div>}
                {isJoiningGame && <div className='join-game-section'>
                    <label htmlFor="join-game-code">Game Code:</label>
                    <input type="text" id="join-game-code" value={gameCode} onChange={(e) => setGameCode(e.target.value)} />

                    <label htmlFor="join-display-name">Display Name:</label>
                    <input type="text" id="join-display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />

                    <button className='action-button' onClick={async () => {
                        if (gameCode.trim() === '' || displayName.trim() === '') {
                            alert('Please enter both game code and display name.');
                            return;
                        }
                        // Here you would normally join the game on the server
                        setIsLoading(true);
                        const success = await joinGame(gameCode, localStorage.getItem("userId")!, displayName);
                        setIsLoading(false);
                        if (success == "dne") {
                            alert('Failed to join game. Please check the game code and try again.');
                            return;
                        }
                        window.location.href += `Online/?gameCode=${gameCode}`;
                    }}>Join</button>
                </div>}

                <button className='action-button' onClick={() => {
                    if (createdOnlineGame) {
                        deleteGame(gameCode);
                        setCreatedOnlineGame(false);
                    }
                    setIsCreatingGame(false);
                    setIsJoiningGame(false);
                    setGameCode('');
                    setDisplayName('');
                    closeDialog();
                }}>Close</button>

            </div>
        </dialog >

    );
}

export default OnlineGameDialog;