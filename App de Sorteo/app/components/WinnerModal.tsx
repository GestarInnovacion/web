import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/solid'

interface Winner {
    name: string
    number: number
    prize: string
}

interface WinnerModalProps {
    isOpen: boolean
    onClose: () => void
    winner: Winner | undefined
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, onClose, winner }) => {
    if (!winner) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <h2 className="text-3xl font-bold text-center mb-4 text-purple-600">
                            ¡Tenemos un ganador!
                        </h2>
                        <div className="text-center">
                            <p className="text-xl mb-2">
                                <span className="font-semibold">Nombre:</span> {winner.name}
                            </p>
                            <p className="text-xl mb-4">
                                <span className="font-semibold">Número:</span> {winner.number}
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                                Premio: {winner.prize}
                            </p>
                        </div>
                        <div className="mt-6 text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="inline-block"
                            >
                                🎉
                            </motion.div>
                            <p className="text-lg mt-2">¡Felicidades al ganador!</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default WinnerModal

