export const PlayerSymbol = {
    X: 'X',
    O: 'O',
    EMPTY: ' '

} as const;

export type PlayerSymbol = typeof PlayerSymbol[keyof typeof PlayerSymbol];

export class TileIndex {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Tile {
    claimedBy: PlayerSymbol;
    investedPoints: {
        [K in PlayerSymbol]: number
    };

    constructor() {
        this.claimedBy = PlayerSymbol.EMPTY;
        this.investedPoints = { [PlayerSymbol.X]: 0, [PlayerSymbol.O]: 0, [PlayerSymbol.EMPTY]: 0 };

    }

    investPoints(player: PlayerSymbol, points: number) {
        this.investedPoints[player] += points;
        if (this.investedPoints[player] >= 10) {
            this.claimedBy = player;
        }
    }


}

export class Board {
    grid: Tile[][];
    winner: PlayerSymbol;

    constructor(params?: { grid: Tile[][] }) {
        if (params && params.grid) {
            this.grid = params.grid;
            this.winner = PlayerSymbol.EMPTY;
        } else {
            this.grid = [];
            this.winner = PlayerSymbol.EMPTY;
        }
    }

    initi(rows: number, cols: number) {
        for (let i = 0; i < rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < cols; j++) {
                this.grid[i][j] = new Tile();
            }
        }
    }

    investPoints(x: number, y: number, player: PlayerSymbol, points: number) {
        if (this.grid[x][y].claimedBy === PlayerSymbol.EMPTY) {
            this.grid[x][y].investPoints(player, points);
        }
    }

    checkWin() {
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (this.grid[i][0].claimedBy !== PlayerSymbol.EMPTY &&
                this.grid[i][0].claimedBy === this.grid[i][1].claimedBy &&
                this.grid[i][1].claimedBy === this.grid[i][2].claimedBy) {
                this.winner = this.grid[i][0].claimedBy;
                return;
            }
            if (this.grid[0][i].claimedBy !== PlayerSymbol.EMPTY &&
                this.grid[0][i].claimedBy === this.grid[1][i].claimedBy &&
                this.grid[1][i].claimedBy === this.grid[2][i].claimedBy) {
                this.winner = this.grid[0][i].claimedBy;
                return;
            }
        }

        // Check diagonals
        if (this.grid[0][0].claimedBy !== PlayerSymbol.EMPTY &&
            this.grid[0][0].claimedBy === this.grid[1][1].claimedBy &&
            this.grid[1][1].claimedBy === this.grid[2][2].claimedBy) {
            this.winner = this.grid[0][0].claimedBy;
            return;
        }
        if (this.grid[0][2].claimedBy !== PlayerSymbol.EMPTY &&
            this.grid[0][2].claimedBy === this.grid[1][1].claimedBy &&
            this.grid[1][1].claimedBy === this.grid[2][0].claimedBy) {
            this.winner = this.grid[0][2].claimedBy;
            return;
        }

        return null;
    }


    clone(): Board {
        const newGrid = this.grid.map(row => row.map(tile => {
            const newTile = new Tile();
            newTile.claimedBy = tile.claimedBy;
            newTile.investedPoints = { ...tile.investedPoints };
            return newTile;
        }));
        const newBoard = new Board({ grid: newGrid });
        newBoard.winner = this.winner;
        return newBoard;
    }
}

export const TurnStage = {
    ROLLING: 'ROLLING',
    INVESTING: 'INVESTING',
    STEALING: 'STEALING'

} as const;

export type TurnStage = typeof TurnStage[keyof typeof TurnStage];

export class Player {
    displayName: string;
    symbol: PlayerSymbol;
    isTurn: boolean;
    pointsToInvest: number;
    isGambling: boolean;
    gambleAmount: number;
    playerId: string;

    constructor(params: {
        displayName: string,
        symbol: PlayerSymbol,
        isTurn?: boolean,
        pointsToInvest?: number,
        isGambling?: boolean,
        gambleAmount?: number,
        playerId: string
    }) {
        this.displayName = params.displayName;
        this.symbol = params.symbol;
        this.isTurn = params.isTurn || false;
        this.pointsToInvest = params.pointsToInvest || 0;
        this.isGambling = params.isGambling || false;
        this.gambleAmount = params.gambleAmount || 1;
        this.playerId = params.playerId;
    }


}