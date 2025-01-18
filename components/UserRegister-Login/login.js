import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import styles from './style.module.css'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import { AuthContext } from '../authContext'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'

const host = process.env.NEXT_PUBLIC_HOST

const UserLoginForm = () => {
    const context = useContext(AuthContext)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passwordShown, setPasswordShown] = React.useState(false)

    useEffect(() => {
        const frame = document.createElement('iframe')
        frame.id = '3pc'
        frame.src = 'https://chamithrepo.github.io/create-third-party-cookie/' //Add your hosted domain url here
        frame.style.display = 'none'
        frame.style.position = 'fixed'
        document.body.appendChild(frame)

        window.addEventListener(
            'message',
            function listen(event) {
                if (event.data === '3pcUnsupported') {
                    document.body.removeChild(frame)
                    window.removeEventListener('message', listen)
                    toast.error(
                        'Please Enable third party cookies to be able to Login (go to browser settings)',
                        {
                            position: 'top-right',
                            autoClose: 10000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'light',
                        }
                    )
                }
            },
            false
        )
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        let body = { username: email, password: password }
        // user input validation
        if (email.length == 0 || password.length == 0) {
            toast.warning('Please fill email and password', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
            return
        }
        try {
            const response = await fetch(`${host}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                credentials: 'include',
            })

            //check if request is successful
            // console.log(response.status)
            if (response.status === 200 || response.status === 201) {
                const data = await response.json()
                console.log(data);
                console.log(document.cookie);

                if (data.success === true) {
                    toast.success('You are successfully logged in', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    })
                    console.log(data.token);

                    context.getUser();
                } else {
                    toast.error(data.message, {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    })
                }
            } else if (response.status === 409) {
                const data = await response.json()
                toast.error(data.message || 'Unable to login', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
            } else {
                const data = await response.json()
                toast.error(data.message, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
            }
        } catch (err) {
            console.log(err)
            toast.error('Login failed. Check your internet connection', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
        }
    }

    return (
        <div>
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

            <motion.form
                initial={{ opacity: 0, x: '-20%' }}
                whileInView={{ opacity: 1, x: '0%' }}
                transition={{ duration: 1 }}
                onSubmit={handleSubmit}
            >
                <div className={styles.container_login}>
                    <div className={styles.form}>
                        <h1
                            style={{
                                fontSize: '2rem',
                                fontFamily: 'Anavio Small Capitals W01 Bold',
                                margin: ' -1rem 0 2rem 0',
                                textAlign: 'center',
                            }}
                        >
                            Welcome Back!
                        </h1>
                        <div className={styles.field}>
                            <label htmlFor="email_id">Email ID</label>
                            <br />
                            <input
                                type="email"
                                name="Email_Id"
                                placeholder="Enter your email address"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <br />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password">Password</label>
                            <br />
                            <input
                                id="pwd"
                                name="Password"
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <br />

                            <br />

                            <div className={styles.passwd_box}>
                                <Link
                                    href="/password-reset"
                                    style={{
                                        color: '#ffffff',
                                        marginTop: -8,
                                        textAlign: 'right',
                                    }}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <br />
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.8 }}
                        >
                            <button className={styles.fancyButton} type='submit'>
                                <span>LOGIN</span>
                                <Image
                                    src={'/assets/Subtract.svg'}
                                    className={styles.memberImage}
                                    height={220}
                                    width={220}
                                    alt="register"
                                />
                            </button>
                        </motion.div>
                        <p style={{ marginTop: 18, textAlign: 'center' }}>
                            Don't have an account? &nbsp;
                            <Link
                                href="/userRegister"
                                style={{ color: '#ffffff', fontWeight: 600 }}
                            >
                                Register here.
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.form>
        </div>
    )
}

export default UserLoginForm
