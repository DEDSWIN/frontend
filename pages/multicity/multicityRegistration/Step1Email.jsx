import React, { useState } from 'react'
import { useAuthUser } from '../context/AuthUserContext'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

import toast from 'react-hot-toast'

export default function Step1EmailPassword({
    formData = {},
    setFormData,
    next,
}) {
    const [email, setEmail] = useState(formData?.email || '')
    const [password, setPassword] = useState(formData?.password || '')
    const [isDisabled, setDisabled] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const { registerUser } = useAuthUser()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisabled(true)

        try {
            const userDoc = await registerUser(email, password)

            if (userDoc) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('uid', userDoc.uid)
                }
                setFormData({ ...(formData || {}), email, password })
                next()
            }
        } catch (error) {
            toast.error(
                error.message || 'Something went wrong. Please try again.'
            )
        } finally {
            setDisabled(false) // re-enable form after error
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '3.5rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
            }}
        >
            <div
                style={{
                    borderRadius: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '28rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    animation: 'fadeIn 0.5s ease-in-out',
                }}
            >
                <h3
                    style={{
                        fontSize: '2.25rem',
                        fontWeight: '800',
                        marginBottom: '2rem',
                        background:
                            'linear-gradient(to left, #095DB7, #41D7B7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Dive into Multicity
                </h3>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}
                >
                    {/* Email Input */}
                    <div style={{ position: 'relative' }}>
                        <Mail
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                            }}
                            size={20}
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            style={{
                                width: '100%',
                                paddingLeft: '3rem',
                                paddingRight: '1rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                borderRadius: '0.75rem',
                                color: 'black',
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                outline: 'none',
                                border: '2px solid transparent',
                                transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#60a5fa'
                                e.target.style.boxShadow =
                                    '0 0 0 3px rgba(96, 165, 250, 0.2)'
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'transparent'
                                e.target.style.boxShadow = 'none'
                            }}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ position: 'relative' }}>
                        <Lock
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                            }}
                            size={20}
                        />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            style={{
                                width: '100%',
                                paddingLeft: '3rem',
                                paddingRight: '1rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                borderRadius: '0.75rem',
                                color: 'black',
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                outline: 'none',
                                border: '2px solid transparent',
                                transition: 'all 0.3s ease',
                            }}
                            disabled={isDisabled}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {showPassword ? (
                                <Eye size={20} />
                            ) : (
                                <EyeOff size={20} />
                            )}
                        </button>
                    </div>

                    <p
                        style={{
                            fontSize: '0.75rem',
                            textAlign: 'left',
                            color: '#4b5563',
                            marginTop: '0.5rem',
                        }}
                    >
                        Password must be{' '}
                        <span style={{ fontWeight: '600' }}>8+ characters</span>
                        , include{' '}
                        <span style={{ fontWeight: '600' }}>a letter</span> and{' '}
                        <span style={{ fontWeight: '600' }}>a number</span>.
                    </p>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            background:
                                'linear-gradient(to right, #41D7B7, #095DB7)',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                        disabled={isDisabled}
                    >
                        {isDisabled ? 'Processing...' : 'Next →'}
                    </button>
                </form>
            </div>
        </div>
    )
}
