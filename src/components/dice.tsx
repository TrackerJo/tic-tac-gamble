import { useCallback, useRef, useState } from "react";
import "./dice.css"

type DiceProps = {
    onRoll: (result: number) => void,
    startRolling: () => void,
}

function Dice({ onRoll, startRolling }: DiceProps) {
    const dice = useRef<HTMLDivElement>(null);
    const [isRolling, setIsRolling] = useState<boolean>(false)

    const rollDice = useCallback(() => {
        if (isRolling) return;
        startRolling();
        setIsRolling(true);
        const result = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        dice.current!.dataset.side = result.toString();
        dice.current!.classList.toggle("reRoll");
        setTimeout(() => {

            setIsRolling(false);
            onRoll(result);
        }, 2000);

    }, [isRolling, onRoll]);



    return (
        <div id="dice" data-side="1" onClick={rollDice} ref={dice}>
            <div className="sides side-1">
                <span className="dot dot-1"></span>
            </div>
            <div className="sides side-2">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
            </div>
            <div className="sides side-3">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
            </div>
            <div className="sides side-4">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
                <span className="dot dot-4"></span>
            </div>
            <div className="sides side-5">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
                <span className="dot dot-4"></span>
                <span className="dot dot-5"></span>
            </div>
            <div className="sides side-6">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
                <span className="dot dot-4"></span>
                <span className="dot dot-5"></span>
                <span className="dot dot-6"></span>
            </div>
        </div>
    )
}

export default Dice