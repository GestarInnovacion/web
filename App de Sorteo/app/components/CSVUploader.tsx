import { useState } from 'react'
import { useCSVReader } from 'react-papaparse'
import { Participant } from '../types'

interface CSVUploaderProps {
    onParticipantsLoaded: (participants: Participant[]) => void
}

export default function CSVUploader({ onParticipantsLoaded }: CSVUploaderProps) {
    const { CSVReader } = useCSVReader()
    const [isUploaded, setIsUploaded] = useState(false)

    const handleUpload = (data: any) => {
        console.log('Raw CSV data:', data)
        const participants = data.data.map((row: string[]) => {
            const participant = {
                number: parseInt(row[0]),
                name: row[1]
            }
            console.log('Parsed participant:', participant)
            return participant
        })
        onParticipantsLoaded(participants)
        setIsUploaded(true)
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Cargar Participantes</h2>
            <CSVReader
                onUploadAccepted={handleUpload}
                config={{ header: false }}
            >
                {({ getRootProps }: any) => (
                    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-gray-500 transition-colors duration-300">
                        <p>Arrastra y suelta el archivo CSV aquí o haz clic para seleccionar</p>
                    </div>
                )}
            </CSVReader>
            {isUploaded && (
                <p className="text-green-500 font-bold">Archivo CSV cargado exitosamente</p>
            )}
        </div>
    )
}

