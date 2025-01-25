import React, { useState, useEffect, useContext } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Details from '../components/Profile/details'
import MyEvents from '../components/Profile/myEvents'
import MyMerch from '../components/Profile/myMerch'
import Head from 'next/head'
import styles from '../styles/profile.module.css'

import { AuthContext } from '../components/authContext'
import Image from 'next/image'
import { motion, wrap } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'

const host = process.env.NEXT_PUBLIC_HOST

function profile() {
    const userData = useContext(AuthContext)
    const [tabIndex, setTabIndex] = useState(0)
    // const profDetails = userData.state.user;
    const [profDetails, setProfDetails] = useState(
        userData.state.user || { anwesha_id: '' }
    )
    const [qrcode, setQrcode] = useState(
        userData ? userData.state.user?.qr_code : ''
    )

    useEffect(() => {
        fetch(`${host}/user/editprofile`, {
            method: 'GET',
            credentials: 'include',
            redirect: 'follow',
        })
            .then((response) => response.json())
            .then((result) => {
                setProfDetails(result), console.log(result)
            })
            .catch((error) => console.log('error', error))
    }, [])

    function regenrateqr() {
        fetch(`${host}/user/regenerateqr/`, {
            method: 'GET',
            credentials: 'include',
            redirect: 'follow',
        })
            .then((response) => response.json())
            .then((result) => {
                setQrcode(result.qr_code)
            })
            .catch((error) => console.log('error', error))
    }

    return (
        <>
            <Head>
                <title>Profile - Anwesha 2025</title>
                <meta name="description" content="Anwesha 2025" />
                <link rel="icon" href="./logo_no_bg.svg" />
            </Head>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className={styles.mainContainer}>
                <div className={styles.welcome}>WELCOME BACK!</div>
                <div className={styles.subContainer}>
                    <div className={styles.idandqr}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <div className={styles.userImage}>
                                <Image
                                    src={'/pics/circle_green.png'}
                                    width={180}
                                    height={180}
                                    alt="userImage"
                                />
                                <Image
                                    src={'/pics/mascot 2.png'}
                                    width={130}
                                    height={130}
                                    alt="userImage"
                                />
                            </div>
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <h1 className={styles.anwesha_username}>
                                        {profDetails.full_name}
                                    </h1>
                                    <button className={styles.copy}>
                                        <motion.div
                                            style={{ cursor: 'pointer' }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <Image
                                                src="/edit.svg"
                                                width={20}
                                                height={20}
                                                alt="edit"
                                            />
                                        </motion.div>
                                    </button>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <h1 className={styles.anwesha_id}>
                                        {profDetails.anwesha_id}
                                    </h1>
                                    <button
                                        className={styles.copy}
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                profDetails.anwesha_id
                                            )
                                            toast.success(
                                                'Copied to clipboard',
                                                {
                                                    position: 'top-right',
                                                    autoClose: 3000,
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                    theme: 'light',
                                                }
                                            )
                                        }}
                                    >
                                        <motion.div
                                            style={{ cursor: 'pointer' }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <Image
                                                src="/copy.svg"
                                                width={20}
                                                height={20}
                                                alt="copy"
                                            />
                                        </motion.div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.qrcode}>
                            <img src={qrcode} alt="" />
                            <Link
                                href="/anweshapass"
                                style={{ color: 'black', fontWeight: 'bold' }}
                            ></Link>
                            {/* <button className={styles.qrBtn} onClick={regenrateqr}>
                            Regenerate QR
                        </button> */}
                        </div>
                    </div>

                    {/* <h1 className={styles.anwesha_id}>{profDetails.anwesha_id}</h1> */}
                    <div className={styles.userDetails}>
                        <div>
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Mail ID
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.email_id}
                                </h1>
                            </div>
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Mobile Number
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.phone_number}
                                </h1>
                            </div>
                        </div>
                        <div>
                            {/* <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Gender
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    Male
                                </h1>
                            </div> */}
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Institute/Organization
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.college_name}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* <Tabs className={styles.tabs}>
                        <TabList
                            className={styles.tabList}
                            selectedIndex={tabIndex}
                            onSelect={(index) => setTabIndex(index)}
                        >
                            <Tab
                                className={styles.tab}
                                selectedClassName={styles.tabActive}
                            >
                                DETAILS
                            </Tab>
                            <Tab
                                className={styles.tab}
                                selectedClassName={styles.tabActive}
                            >
                                MY EVENTS
                            </Tab>
                            <Tab className={styles.tab}>MY MERCHANDISE</Tab>
                        </TabList>

                        <TabPanel className={styles.tabPanel}>
                            <Details />
                        </TabPanel>
                        <TabPanel className={styles.tabPanel}>
                            <MyEvents />
                        </TabPanel>
                        <TabPanel className={styles.tabPanel}>
                            <MyMerch />
                        </TabPanel>
                    </Tabs> */}
                </div>
            </div>
        </>
    )
}

export default profile
