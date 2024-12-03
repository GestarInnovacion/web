'use client'

import React, { useReducer, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CSVReader from 'react-csv-reader'
import Confetti from 'react-confetti'
import Image from 'next/image'
import {
    SparklesIcon,
    GiftIcon,
    TrophyIcon,
    UserGroupIcon,
    ArrowPathIcon,
    FireIcon,
    StarIcon,
    SparklesIcon as SparklesOutline,
    XMarkIcon
} from '@heroicons/react/24/solid'

type Prize = {
    name: string
    range: [number, number]
}

type Participant = {
    number: number
    name: string
}

type Winner = {
    prize: string
    participant: Participant
}

const initialState = {
    prizes: [] as Prize[],
    participants: [] as Participant[],
    winners: [] as Winner[],
    currentDraw: null as number | null,
    isDrawing: false,
    drawStage: 0,
    currentWinner: null as Winner | null,
}

type Action =
    | { type: 'ADD_PRIZE'; payload: Prize }
    | { type: 'SET_PARTICIPANTS'; payload: Participant[] }
    | { type: 'START_DRAW' }
    | { type: 'SET_CURRENT_DRAW'; payload: number }
    | { type: 'SET_DRAW_STAGE'; payload: number }
    | { type: 'END_DRAW'; payload: Winner }
    | { type: 'RESET_DRAW' }

function reducer(state: typeof initialState, action: Action) {
    switch (action.type) {
        case 'ADD_PRIZE':
            return { ...state, prizes: [...state.prizes, action.payload] }
        case 'SET_PARTICIPANTS':
            return { ...state, participants: action.payload }
        case 'START_DRAW':
            return { ...state, isDrawing: true, currentDraw: null, drawStage: 0, currentWinner: null }
        case 'SET_CURRENT_DRAW':
            return { ...state, currentDraw: action.payload }
        case 'SET_DRAW_STAGE':
            return { ...state, drawStage: action.payload }
        case 'END_DRAW':
            return {
                ...state,
                isDrawing: false,
                winners: [...state.winners, action.payload],
                participants: state.participants.filter(p => p.number !== action.payload.participant.number),
                prizes: state.prizes.slice(1),
                drawStage: 4,
                currentWinner: action.payload
            }
        case 'RESET_DRAW':
            return { ...state, isDrawing: false, currentDraw: null, drawStage: 0, currentWinner: null }
        default:
            return state
    }
}

const LotteryPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [newPrize, setNewPrize] = useState({ name: '', min: '', max: '' })

    const backgroundElements = [
        { left: "56.010036876053704%", top: "87.57076031924296%" },
        { left: "59.14789847840569%", top: "1.0703308332394856%" },
        { left: "66.5137229491674%", top: "46.101301790793215%" },
        { left: "35.83899846546801%", top: "31.598803154443587%" },
        { left: "75.64971379642597%", top: "35.927662908601455%" },
        { left: "5.106352934660818%", top: "76.84828273336149%" },
        { left: "15.46221211780978%", top: "99.6588836005692%" },
        { left: "53.39510547838462%", top: "72.10006530984529%" },
        { left: "54.20556576152571%", top: "60.57981830222956%" },
        { left: "79.85206493234709%", top: "55.402140224455955%" },
        { left: "83.88710180379162%", top: "14.741534893455%" },
        { left: "39.91724950776443%", top: "1.3817447552784579%" },
        { left: "11.413157043251609%", top: "15.713901294662524%" },
        { left: "17.07362243239874%", top: "83.07904979829553%" },
        { left: "14.716016582069557%", top: "59.57495399369939%" },
        { left: "42.51711440824908%", top: "65.3756706479181%" },
        { left: "52.23658370624846%", top: "38.26063595531184%" },
        { left: "13.637965488726778%", top: "41.15357279595653%" },
        { left: "47.531785858523115%", top: "93.71180447752936%" },
        { left: "65.69788197365305%", top: "70.49451104619794%" },
    ];

    const handleAddPrize = (e: React.FormEvent) => {
        e.preventDefault()
        if (newPrize.name && newPrize.min && newPrize.max) {
            if (state.prizes.some(prize => prize.name === newPrize.name)) {
                alert('Ya existe un premio con ese nombre. Por favor, elige otro nombre.')
                return
            }
            dispatch({
                type: 'ADD_PRIZE',
                payload: {
                    name: newPrize.name,
                    range: [parseInt(newPrize.min), parseInt(newPrize.max)]
                }
            })
            setNewPrize({ name: '', min: '', max: '' })
        }
    }

    const handleParticipantsUpload = (data: any[]) => {
        const participants = data.map(row => ({
            number: parseInt(row[0]),
            name: row[1]
        }))
        dispatch({ type: 'SET_PARTICIPANTS', payload: participants })
    }

    const startDraw = async (prize: Prize) => {
        dispatch({ type: 'START_DRAW' })

        console.log('Prize Range:', prize.range)
        console.log('All Participants:', state.participants)

        const eligibleParticipants = state.participants.filter(p => {
            const isEligible = p.number >= prize.range[0] && p.number <= prize.range[1]
            console.log(`Checking participant ${p.number}: ${isEligible}`)
            return isEligible
        })

        console.log('Eligible Participants:', eligibleParticipants)

        if (eligibleParticipants.length === 0) {
            alert('No hay participantes elegibles para este premio')
            dispatch({ type: 'RESET_DRAW' })
            return
        }

        // Stage 1: Initial suspense (2 seconds)
        dispatch({ type: 'SET_DRAW_STAGE', payload: 1 })
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Stage 2: Number cycling (5 seconds)
        dispatch({ type: 'SET_DRAW_STAGE', payload: 2 })
        const cyclingInterval = setInterval(() => {
            dispatch({
                type: 'SET_CURRENT_DRAW',
                payload: Math.floor(Math.random() * (prize.range[1] - prize.range[0] + 1)) + prize.range[0]
            })
        }, 100)
        await new Promise(resolve => setTimeout(resolve, 2000))
        clearInterval(cyclingInterval)

        // Stage 3: Final result
        const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)]
        dispatch({ type: 'END_DRAW', payload: { prize: prize.name, participant: winner } })
    }

    const getDrawAnimation = () => {
        switch (state.drawStage) {
            case 1:
                return {
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5, repeat: 4 }
                }
            case 2:
                return {
                    y: [-20, 0],
                    transition: { duration: 0.1, repeat: Infinity }
                }
            case 4:
                return {
                    scale: [1, 1.5, 1],
                    transition: { duration: 0.5, times: [0, 0.5, 1] }
                }
            default:
                return {}
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-900 text-white p-8 font-sans overflow-hidden">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
                <motion.div
                    className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-pink-500 to-yellow-500 transform -skew-y-3"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 0.3, y: 0 }}
                    transition={{ duration: 1 }}
                />
                {backgroundElements.map((position, i) => (
                    <motion.div
                        key={i}
                        className="absolute size-2 bg-white rounded-full"
                        style={position}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <header className="relative flex justify-between items-center mb-12 z-10 px-4 py-8">
                <motion.div
                    className="h-80 w-80 relative"
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src="/logo-forza.png"
                        alt="Logo Forza"
                        layout="fill"
                        objectFit="contain"
                        className="animate-float"
                    />
                </motion.div>
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h1 className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 drop-shadow-lg font-display mb-2">
                        Sorteo Nuevo Hundred
                    </h1>
                    <motion.div
                        className="flex justify-center gap-2 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {Array.from({ length: 5 }).map((_, i) => (
                            <motion.span
                                key={i}
                                className="text-green-400"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 360, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.1,
                                    repeat: Infinity,
                                }}
                            >
                                <StarIcon className="h-8 w-8" />
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
                <motion.div
                    className="h-80 w-80 relative"
                    initial={{ opacity: 0, rotate: 10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src="/logo-gestar.png"
                        alt="Logo Gestar"
                        layout="fill"
                        objectFit="contain"
                        className="animate-float"
                    />
                </motion.div>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Prize Form */}
                <motion.section
                    className="bg-white/10 p-8 rounded-3xl backdrop-blur-lg shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-5xl font-bold mb-8 flex items-center font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                        <GiftIcon className="h-12 w-12 mr-4 text-yellow-400 animate-bounce" />
                        Agregar Premio
                    </h2>
                    <form onSubmit={handleAddPrize} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Nombre del premio"
                                value={newPrize.name}
                                onChange={e => setNewPrize({ ...newPrize, name: e.target.value })}
                                className="w-full p-4 rounded-2xl bg-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 pl-12 text-xl"
                            />
                            <TrophyIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-yellow-400 transition-transform group-hover:scale-110" />
                        </div>
                        <div className="flex space-x-4">
                            <div className="relative w-1/2">
                                <input
                                    type="number"
                                    placeholder="Número mínimo"
                                    value={newPrize.min}
                                    onChange={e => setNewPrize({ ...newPrize, min: e.target.value })}
                                    className="w-full p-4 rounded-2xl bg-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 text-xl"
                                />
                            </div>
                            <div className="relative w-1/2">
                                <input
                                    type="number"
                                    placeholder="Número máximo"
                                    value={newPrize.max}
                                    onChange={e => setNewPrize({ ...newPrize, max: e.target.value })}
                                    className="w-full p-4 rounded-2xl bg-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 text-xl"
                                />
                            </div>
                        </div>
                        <motion.button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-700 to-green-700 p-4 rounded-2xl font-bold text-2xl shadow-lg relative overflow-hidden group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                            <span className="relative flex items-center justify-center">
                                <GiftIcon className="h-8 w-8 mr-2" />
                                Agregar Premio
                            </span>
                        </motion.button>
                    </form>
                </motion.section>

                {/* Participants Upload */}
                <motion.section
                    className="bg-white/10 p-8 rounded-3xl backdrop-blur-lg shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h2 className="text-5xl font-bold mb-8 flex items-center font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                        <UserGroupIcon className="h-12 w-12 mr-4 text-yellow-400" />
                        Cargar Participantes
                    </h2>
                    <motion.div
                        className="bg-white/20 p-6 rounded-2xl mb-6"
                    >
                        <p className="text-xl mb-4 font-semibold">Formato del archivo CSV:</p>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-black/20 rounded-xl text-lg">
                            <div>Número del participante</div>
                            <div>Nombre del participante</div>
                            <div className="text-yellow-300">2</div>
                            <div className="text-yellow-300">Cristian Castro</div>
                            <div className="text-yellow-300">56</div>
                            <div className="text-yellow-300">Stiven benavides</div>
                        </div>
                    </motion.div>
                    <CSVReader
                        onFileLoaded={handleParticipantsUpload}
                        parserOptions={{ header: false }}
                        inputId="csvReader"
                        inputStyle={{ display: 'none' }}
                    />
                    <motion.label
                        htmlFor="csvReader"
                        className="block w-full text-center bg-gradient-to-r from-blue-700 to-green-700 p-4 rounded-2xl cursor-pointer font-bold text-2xl shadow-lg relative overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        <span className="relative flex items-center justify-center">
                            <ArrowPathIcon className="h-8 w-8 mr-2 animate-spin-slow" />
                            Seleccionar archivo CSV
                        </span>
                    </motion.label>
                    <motion.p
                        className="mt-6 text-3xl font-semibold text-center"
                        animate={{ scale: [1, 1.1, 1], transition: { duration: 2, repeat: Infinity } }}
                    >
                        Participantes cargados: {state.participants.length}
                    </motion.p>
                </motion.section>
            </div>

            {/* Raffle Section */}
            <motion.section
                className="mt-12 bg-white/10 p-8 rounded-3xl backdrop-blur-lg shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <h2 className="text-5xl font-bold mb-8 flex items-center font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                    <SparklesIcon className="h-12 w-12 mr-4 text-yellow-400" />
                    Realizar Sorteo
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {state.prizes.map((prize, index) => (
                        <motion.button
                            key={index}
                            onClick={() => startDraw(prize)}
                            disabled={state.isDrawing}
                            className="relative bg-gradient-to-r from-blue-700 to-green-700 p-6 rounded-2xl font-bold text-2xl shadow-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                            <div className="relative">
                                <h3 className="text-3xl font-bold mb-2 font-display">{prize.name}</h3>
                            </div>
                            <FireIcon className="absolute bottom-2 right-2 h-10 w-10 text-yellow-300 animate-pulse" />
                        </motion.button>
                    ))}
                </div>
            </motion.section>

            {/* Raffle Animation Modal */}
            <AnimatePresence>
                {(state.isDrawing || state.currentWinner) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm z-50"
                    >
                        <motion.div
                            className="bg-gradient-to-r from-blue-700/50 to-green-700/50 p-16 rounded-3xl backdrop-blur-xl shadow-2xl text-center border border-white/20 relative"
                            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <button
                                onClick={() => dispatch({ type: 'RESET_DRAW' })}
                                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                            <motion.h3
                                className="text-8xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 font-display"
                                animate={{ scale: [1, 1.05, 1], transition: { duration: 1, repeat: Infinity } }}
                            >
                                {state.drawStage === 4 ? '¡GANADOR!' : (
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                                        Sorteando...
                                    </span>
                                )}
                            </motion.h3>
                            <motion.div
                                key={state.currentDraw}
                                animate={getDrawAnimation()}
                                className="relative"
                            >
                                <div className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500 font-display relative z-10">
                                    {state.currentDraw?.toString().padStart(3, '0') ?? '???'}
                                </div>
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                >
                                    <SparklesOutline className="h-64 w-64 text-yellow-400/20" />
                                </motion.div>
                            </motion.div>
                            {state.currentWinner && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 text-4xl font-bold text-white"
                                >
                                    {state.currentWinner.participant.name}
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Winners History */}
            <motion.section
                className="mt-12 bg-white/10 p-8 rounded-3xl backdrop-blur-lg shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <h2 className="text-5xl font-bold mb-8 flex items-center font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                    <TrophyIcon className="h-12 w-12 mr-4 text-yellow-400" />
                    Historial de Ganadores
                </h2>
                <div className="space-y-6">
                    {state.winners.map((winner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gradient-to-r from-blue-800/30 to-green-800/30 p-6 rounded-2xl border border-white/20 transform hover:scale-102 transition-transform duration-300"
                        >
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-yellow-400/20 p-4 rounded-full">
                                        <TrophyIcon className="h-10 w-10 text-yellow-400 animate-bounce" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-yellow-400 font-display">{winner.prize}</h3>
                                        <p className="text-white/80 text-xl">Número: {winner.participant.number}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                                        {winner.participant.name}
                                    </p>
                                    <p className="text-xl text-white/60">Ganador</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Confetti Effect */}
            {state.winners.length > 0 && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                    colors={['#1D4ED8', '#065F46', '#047857', '#2563EB', '#059669', '#3B82F6', '#10B981']}
                />
            )}

            {/* Global Styles */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Poppins:wght@300;400;600;700;800&display=swap');
        
        :root {
          --font-display: 'Bungee', cursive;
          --font-sans: 'Poppins', sans-serif;
        }

        body {
          font-family: var(--font-sans);
        }

        .font-display {
          font-family: var(--font-display);
        }

        /* Scrollbar personalizado */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          border: 3px solid rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Animaciones adicionales */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
        </div>
    )
}

export default LotteryPage

