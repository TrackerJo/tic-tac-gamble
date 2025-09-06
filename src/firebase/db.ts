import { get, getDatabase, onValue, ref, set } from "firebase/database";
import { app } from "./init";

const db = getDatabase(app);

export async function createGame(gameCode: string, playerId: string, displayName: string) {
    // Implementation for creating a game in the database
    await set(ref(db, 'rooms/' + gameCode), {
        joinCode: gameCode,
        players: {
            [playerId]: {
                displayName: displayName,
                symbol: 'X',
                isTurn: true,
                pointsToInvest: 0,
                isGambling: false,
                gambleAmount: 1,
                playerId: playerId
            }
        },
        board: null,
    });
}

export async function joinGame(gameCode: string, playerId: string, displayName: string): Promise<"success" | "dne"> {
    // Implementation for joining a game in the database
    const roomRef = ref(db, 'rooms/' + gameCode);
    const roomSnapshot = await get(roomRef);
    if (roomSnapshot.exists()) {
        await set(ref(db, 'rooms/' + gameCode + '/players/' + playerId), {
            displayName: displayName,
            symbol: 'O',
            isTurn: false,
            pointsToInvest: 0,
            isGambling: false,
            gambleAmount: 1,
            playerId: playerId
        });
        return "success";
    } else {
        return "dne";
    }
}

export async function deleteGame(gameCode: string) {
    // Implementation for deleting a game from the database
    await set(ref(db, 'rooms/' + gameCode), null);
}

export function waitForOtherPlayer(gameCode: string) {
    const roomRef = ref(db, 'rooms/' + gameCode + '/players');
    onValue(roomRef, (snapshot) => {
        const players = snapshot.val();
        if (players && Object.keys(players).length >= 2) {
            console.log('Another player has joined the game!');
            window.location.href += `Online/?gameCode=${gameCode}`;
        }
    });

}

export async function listenToGameUpdates(gameCode: string, callback: (data: any) => void) {
    const roomRef = ref(db, 'rooms/' + gameCode);
    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}

export async function updateGameState(gameCode: string, players: { [key: string]: any }) {
    await set(ref(db, 'rooms/' + gameCode + '/players'), players);
}

export async function updateBoardState(gameCode: string, board: any) {
    await set(ref(db, 'rooms/' + gameCode + '/board'), board);
}