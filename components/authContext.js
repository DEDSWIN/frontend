import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const host = process.env.NEXT_PUBLIC_HOST

const AuthContext = React.createContext()

const { Provider } = AuthContext

const PrivateRoute = ({ children }) => {
    const router = useRouter()
    const { user } = React.useContext(AuthContext)

    useEffect(() => {
        if (!user && ['/profile', '/event-registration'].includes(router.pathname)) {
            router.push('/userLogin')
        } else if (user && ['/userLogin', '/userRegister'].includes(router.pathname)) {
            router.push('/registration')
        } else if (!user && router.pathname.includes('/event-registrations')) {
            router.push('/userLogin')
        }
    }, [user, router.pathname])

    return children
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const router = useRouter()

    const getUser = async () => {
        try {
            const response = await fetch(`${host}/user/editprofile`, {
                method: 'GET',
                credentials: 'include',
                redirect: 'follow'
            })
            const result = await response.json()

            if (!response.ok || [
                'you are unauthenticated , Please Log in First',
                'Your token is expired please generate new one',
                'Your token is expired please login again',
            ].includes(result.message)) {
                setUser(null)
                if (['/profile', '/event-registration'].includes(router.pathname)) {
                    toast.error(result.message, {
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
            } else {
                setUser(result)
            }
        } catch (error) {
            console.error('Error fetching user:', error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
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
            <Provider
                value={{
                    user,
                    setUser,
                    isAuth: !!user,
                    getUser,
                }}
            >
                {children}
            </Provider>
        </>
    )
}

export { AuthContext, AuthProvider, PrivateRoute }
