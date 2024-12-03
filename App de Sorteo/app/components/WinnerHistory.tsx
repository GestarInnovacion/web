import React from 'react'

interface WinnerHistoryProps {
    winners: any[]
}

export default function WinnerHistory({ winners }: WinnerHistoryProps) {
    return (
        <div>
            <h2 className="title">Historial de Ganadores</h2>

            {winners.length > 0 ? (
                <div className="space-y-4">
                    {winners.map((winner, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold text-gray-800">{winner.name}</p>
                                <p className="text-gray-600">Número: {winner.number}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-blue-600">{winner.prize}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">
                    Aún no hay ganadores
                </p>
            )}
        </div>
    )
}

