import React, { useState } from 'react'

interface PrizeFormProps {
    onAddPrize: (prize: any) => void
}

export default function PrizeForm({ onAddPrize }: PrizeFormProps) {
    const [name, setName] = useState('')
    const [rangeStart, setRangeStart] = useState('')
    const [rangeEnd, setRangeEnd] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name && rangeStart && rangeEnd) {
            onAddPrize({
                name,
                range: [parseInt(rangeStart), parseInt(rangeEnd)]
            })
            setName('')
            setRangeStart('')
            setRangeEnd('')
        }
    }

    return (
        <div>
            <h2 className="title">Agregar Premio</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre del premio"
                        className="input"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        placeholder="Número mínimo"
                        className="input"
                    />
                    <input
                        type="number"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        placeholder="Número máximo"
                        className="input"
                    />
                </div>
                <button type="submit" className="button w-full">
                    Agregar Premio
                </button>
            </form>
        </div>
    )
}

