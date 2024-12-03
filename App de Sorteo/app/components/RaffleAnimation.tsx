import React from 'react'
import { motion } from 'framer-motion'

interface RaffleAnimationProps {
    prizes: any[]
    isRaffleRunning: boolean
    currentPrize: any
    onStartRaffle: (prize: any) => void
}

export default function RaffleAnimation({
    prizes,
    isRaffleRunning,
    currentPrize,
    onStartRaffle
}: RaffleAnimationProps) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
                {currentPrize ? `Sorteando: ${currentPrize.name}` : 'Listo para sortear'}
            </h2>

            <div className="flex justify-center gap-4 mb-8">
                {[0, 0, 0].map((_, index) => (
                    <motion.div
                        key={index}
                        className="w-20 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-4xl font-bold"
                        animate={isRaffleRunning ? {
                            y: [-10, 10],
                            transition: {
                                duration: 0.5,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }
                        } : {}}
                    >
                        0
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {prizes.map((prize, index) => (
                    <button
                        key={index}
                        onClick={() => onStartRaffle(prize)}
                        disabled={isRaffleRunning}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {prize.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

