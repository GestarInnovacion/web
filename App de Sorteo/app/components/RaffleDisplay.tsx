import React, { useState } from 'react'

interface RaffleDisplayProps {
    prizes: any[]
    participants: any[]
    onSelectWinner: (winner: any) => void
}

export default function RaffleDisplay({ prizes, participants, onSelectWinner }: RaffleDisplayProps) {
    const [currentNumbers, setCurrentNumbers] = useState(['0', '0', '0'])
    const [isRunning, setIsRunning] = useState(false)

    const startRaffle = async (prize: any) => {
        if (isRunning) return
        setIsRunning(true)

        // Simular animación de números
        const duration = 3000
        const interval = 50
        const startTime = Date.now()

        const updateNumbers = () => {
            const numbers = Array(3).fill(0).map(() =>
                Math.floor(Math.random() * 10).toString()
            )
            setCurrentNumbers(numbers)
        }

        const animation = setInterval(() => {
            if (Date.now() - startTime >= duration) {
                clearInterval(animation)
                const winner = participants[Math.floor(Math.random() * participants.length)]
                setCurrentNumbers(winner.number.toString().padStart(3, '0').split(''))
                onSelectWinner({ ...winner, prize: prize.name })
                setIsRunning(false)
            } else {
                updateNumbers()
            }
        }, interval)
    }

    return (
        <div>
            <h2 className="title">Listo para sortear</h2>

            <div className="flex justify-center gap-4 mb-8">
                {currentNumbers.map((number, index) => (
                    <div
                        key={index}
                        className="w-20 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-4xl font-bold"
                    >
                        {number}
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {prizes.map((prize, index) => (
                    <button
                        key={index}
                        onClick={() => startRaffle(prize)}
                        disabled={isRunning}
                        className="button"
                    >
                        {prize.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

