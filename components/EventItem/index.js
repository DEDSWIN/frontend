import Image from 'next/image'
import styles from './eventitem.module.css'
import { motion } from 'framer-motion'
import Modal from '../BigModal'
import { useState } from 'react'


const index = ({ event, onClick }) => {
    const [modal, setModal] = useState(false)
    const [title, smalldesc] = (event?.name ?? "").split("#");
    const close = () => {
        setModal(false)
    }

    return (
        <>

            <div
                className={styles.card}
                onClick={onClick}

            >

                {event.is_active ? null : (
                    <img
                        src="/assets/coming-soon.png"
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '30px',
                            zIndex: 2,
                            height: '100px',
                        }}
                        alt="Coming Soon"
                    />
                )}
                <div className={`${styles.imageWrap}`} style={{
                    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${event.poster
                        ? event.poster
                        : '/events/poster1.png'}') lightgray 0px -10.182px / 100% 133.782% no-repeat `
                }}>
                    <div className={styles.innerShadow}> {/* Add shadow layer */}
                        <div className={styles.eventDescription}>

                            <div className={styles.eventName}>{title}</div>
                            <div className={styles.smalldescription}>{smalldesc}</div>
                        </div>
                    </div>
                </div>

            </div>
            {modal && (
                <>
                    <Modal
                        title={event.name}
                        body={event}
                        closeHandler={close}
                    />
                </>
            )}
        </>
    )
}

export default index
