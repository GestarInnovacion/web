import React from 'react'
import { motion } from 'framer-motion'
import { Participant } from '../types'
import styles from '../styles/WinnerAnnouncement.module.css'

interface WinnerAnnouncementProps {
    winner: Participant
    onClose: () => void
}

export default function WinnerAnnouncement({ winner, onClose }: WinnerAnnouncementProps) {
    return (
        <motion.div
            className={styles.winnerAnnouncement}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.content}>
                <h2 className={styles.winnerTitle}>¡Felicidades!</h2>
                <motion.div
                    className={styles.winnerInfo}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <p className={styles.winnerName}>{winner.name}</p>
                    <p className={styles.winnerNumber}>Número: {winner.number}</p>
                    <p className={styles.winnerPrize}>
                        Has ganado:
                        <span className={styles.prizeName}>{winner.prize}</span>
                    </p>
                </motion.div>
                <motion.div
                    className={styles.celebration}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 10 }}
                >
                    🎉🏆🎊
                </motion.div>
                <p className={styles.congratsMessage}>
                    ¡Enhorabuena por tu increíble victoria! Tu premio te espera.
                </p>
                <motion.button
                    className={styles.closeButton}
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Cerrar
                </motion.button>
            </div>
        </motion.div>
    )
}

