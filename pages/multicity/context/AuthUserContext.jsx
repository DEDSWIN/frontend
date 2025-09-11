import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase/firebaseConfig'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged,
} from 'firebase/auth'
import {
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
} from 'firebase/firestore' // ✅ added imports
import toast from 'react-hot-toast'

const AuthUserContext = createContext()

export function AuthUserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                try {
                    const ref = doc(db, 'users', authUser.uid)
                    const snap = await getDoc(ref)
                    if (snap.exists()) {
                        setCurrentUser(snap.data())
                    } else {
                        // fallback: minimal info if Firestore doc not found
                        setCurrentUser({
                            uid: authUser.uid,
                            email: authUser.email,
                            emailVerified: authUser.emailVerified,
                        })
                    }
                } catch (err) {
                    console.error('Error fetching user:', err)
                    toast.error('Failed to fetch user data.')
                }
            } else {
                setCurrentUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const registerUser = async (email, password) => {
        try {
            // 1️⃣ Try creating a new user
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )
            const user = res.user
            await sendEmailVerification(user)
            toast.success(
                'Verification email sent to your email! Please check your inbox.'
            )

            const ref = doc(db, 'users', user.uid)
            const snap = await getDoc(ref)

            if (snap.exists()) {
                // User doc already exists → use it
                const existingData = snap.data()
                setCurrentUser(existingData)
                toast.success('Logged in successfully!')
                return existingData
            } else {
                // New user → create Firestore doc
                const userDoc = {
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    anweshaId: null,
                    createdAt: Date.now(),
                    status: '1',
                    personal: {},
                    college: {},
                    qrEnabled: false,
                    qrTokenId: null,
                    events: [],
                }
                await setDoc(ref, userDoc)
                setCurrentUser(userDoc)
                toast.success('Account created successfully!')
                return userDoc
            }
        } catch (error) {
            console.log('Auth error:', error)

            // 2️⃣ Handle email already in use → attempt sign-in
            if (error.code === 'auth/email-already-in-use') {
                try {
                    const res = await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    )
                    const user = res.user

                    const ref = doc(db, 'users', user.uid)
                    const snap = await getDoc(ref)

                    if (snap.exists()) {
                        const existingData = snap.data()
                        setCurrentUser(existingData)
                        toast.success('Logged in successfully!')
                        return existingData
                    } else {
                        // Fallback: user exists in Auth but not in Firestore
                        const userDoc = {
                            uid: user.uid,
                            email: user.email,
                            emailVerified: user.emailVerified,
                            anweshaId: null,
                            createdAt: Date.now(),
                            status: '1',
                            personal: {},
                            college: {},
                            qrEnabled: false,
                            qrTokenId: null,
                            events: [],
                        }
                        await setDoc(ref, userDoc)
                        setCurrentUser(userDoc)
                        toast.success('Account synced successfully!')
                        return userDoc
                    }
                } catch (signInError) {
                    // Sign-in errors
                    if (signInError.code === 'auth/wrong-password') {
                        toast.error('Incorrect password. Please try again.')
                    } else if (signInError.code === 'auth/user-not-found') {
                        toast.error('No account found with this email.')
                    } else {
                        toast.error(
                            signInError.message ||
                                'Sign-in failed. Please try again.'
                        )
                    }
                    return null
                }
            }

            // 3️⃣ Handle other errors
            if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email address.')
            } else if (error.code === 'auth/weak-password') {
                toast.error(
                    'Password is too weak. Use 8+ characters with letters and numbers.'
                )
            } else {
                toast.error(
                    error.message || 'Something went wrong. Please try again.'
                )
            }

            return null
        }
    }

    // Update user info in Firestore
    const updateUser = async (uid, updatedData) => {
        const ref = doc(db, 'users', uid)
        await setDoc(ref, updatedData, { merge: true })

        setCurrentUser((prev) => {
            if (!prev) return updatedData
            return { ...prev, ...updatedData }
        })

        return { ...currentUser, ...updatedData }
    }

    const finalizeRegistration = async (uid, formData) => {
        const anweshaId = `ANW-MUL-${Math.floor(
            100000 + Math.random() * 900000
        )}`
        await updateUser(uid, {
            anweshaId,
            status: 'successful',
            ...formData,
        })
        return anweshaId
    }

    const loginUser = async (email, password) => {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password)
            let user = res.user
            console.log(user)

            await user.reload()
            user = auth.currentUser

            if (user.emailVerified) {
                const userRef = doc(db, 'users', user.uid)
                await updateDoc(userRef, { emailVerified: true })
                // toast.success("Login successful!");
            } else {
                toast.error('Please verify your email first.')
                await sendEmailVerification(user)
                throw new Error('Email not verified')
            }

            // Get Firestore user document
            const userDoc = await getDoc(doc(db, 'users', res.user.uid))
            if (typeof window !== 'undefined') {
                localStorage.setItem('uid', res.user.uid)
            }

            if (userDoc.exists()) {
                const userData = userDoc.data() // extract fields
                if (userData.status != 'successful') {
                    toast.error('Complete your registration first !')
                    throw error
                }
                setCurrentUser(userData)
                toast.success('Login Successful')
                return userData
            } else {
                setCurrentUser(res.user) // fallback to auth user only
                return res.user
            }
        } catch (error) {
            if (error) toast.error(error.message || 'error')
            throw error
        }
    }

    const handleSearchByAnweshaId = async (anweshaId) => {
        try {
            console.log('search')
            const q = query(
                collection(db, 'users'),
                where('anweshaId', '==', anweshaId)
            )
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data()
                return userData
            } else {
                return null
            }
        } catch (error) {
            console.error('Error searching user:', error)
            return null
        }
    }

    //access all info from db by uid

    return (
        <AuthUserContext.Provider
            value={{
                currentUser,
                registerUser,
                updateUser,
                finalizeRegistration,
                loginUser,
                handleSearchByAnweshaId,
                loading,
            }}
        >
            {children}
        </AuthUserContext.Provider>
    )
}

export const useAuthUser = () => useContext(AuthUserContext)
