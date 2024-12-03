import React, { useState } from 'react'
import { useCSVReader } from 'react-papaparse'

interface ParticipantUploaderProps {
    onParticipantsLoaded: (participants: any[]) => void
}

export default function ParticipantUploader({ onParticipantsLoaded }: ParticipantUploaderProps) {
    const { CSVReader } = useCSVReader()
    const [isUploaded, setIsUploaded] = useState(false)

    const handleUpload = (data: any) => {
        const participants = data.data.map((row: string[]) => ({
            number: parseInt(row[0]),
            name: row[1]
        }))
        onParticipantsLoaded(participants)
        setIsUploaded(true)
    }

    return (
        <div>
            <h2 className="title">Cargar Participantes</h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-700 mb-4">
                    Instrucciones para el archivo CSV:
                </h3>
                <div className="space-y-2 text-gray-600">
                    <p className="font-medium">Desde Excel:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Selecciona "Guardar como" y elige formato CSV</li>
                        <li>Usa el formato "CSV (delimitado por comas) (*.csv)"</li>
                        <li>Ignora las advertencias de Excel sobre pérdida de características</li>
                    </ul>

                    <p className="font-medium mt-4">Formato esperado:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Primera fila: Número, Nombre (opcional)</li>
                        <li>Siguientes filas: 1, Juan Pérez</li>
                    </ul>
                </div>
            </div>

            <CSVReader onUploadAccepted={handleUpload} config={{ header: false }}>
                {({ getRootProps }: any) => (
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                        <p className="text-gray-600">
                            Arrastra y suelta el archivo CSV aquí o haz clic para seleccionar
                        </p>
                    </div>
                )}
            </CSVReader>

            {isUploaded && (
                <p className="mt-4 text-green-600 font-semibold">
                    Archivo CSV cargado exitosamente
                </p>
            )}
        </div>
    )
}

