// src/pages/register/Step2Personal.jsx
import React, { useState } from 'react'
import { useAuthUser } from '../../../lib/multicity/context/AuthUserContext'
import toast from 'react-hot-toast'
import { User, Calendar, Phone, MapPin } from 'lucide-react'

const Step2Personal = ({ onNext, formData = {}, setFormData }) => {
    const { currentUser, updateUser } = useAuthUser()
    const [isDisabled, setDisabled] = useState(false)
    const [localData, setLocalData] = useState({
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        dob: formData.dob || '',
        gender: formData.gender || '',
        phone: formData.phone || '',
        address: formData.address || '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        // phone restriction: only numbers, max 10
        if (name === 'phone') {
            if (!/^\d*$/.test(value)) return
            if (value.length > 10) return
        }

        setLocalData({ ...localData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisabled(true)
        if (!currentUser) return toast.error('Please login first')

        if (localData.phone.length !== 10) {
            return toast.error('Phone number must be 10 digits')
        }

        try {
            setFormData({ ...(formData || {}), ...localData })

            const newStatus =
                formData?.status && parseInt(formData.status) > 2
                    ? formData.status
                    : '2'

            await updateUser(currentUser.uid, {
                personal: {
                    firstName: localData.firstName,
                    lastName: localData.lastName,
                    dob: localData.dob,
                    gender: localData.gender,
                },
                contact: {
                    phone: localData.phone,
                    address: localData.address,
                },
                status: newStatus,
            })

            if (typeof window !== 'undefined') {
                localStorage.setItem('uid', currentUser.uid)
            }
            toast.success('Personal details saved!')
            onNext()
        } catch (err) {
            toast.error('Error saving personal info: ' + err.message)
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
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
            }}
        >
            <div
                style={{
                    borderRadius: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '32rem',
                    textAlign: 'center',
                    animation: 'fadeIn 0.5s ease-in-out',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(16px)',
                }}
            >
                {/* Heading */}
                <h3
                    style={{
                        fontSize: '1.875rem',
                        fontWeight: '800',
                        marginBottom: '2rem',
                        background:
                            'linear-gradient(to left, #095DB7, #41D7B7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Personal Information
                </h3>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        textAlign: 'left',
                    }}
                >
                    {/* First + Last Name */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <User
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
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={localData.firstName}
                                onChange={handleChange}
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
                                required
                            />
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <User
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
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={localData.lastName}
                                onChange={handleChange}
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
                                required
                            />
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div style={{ position: 'relative' }}>
                        <Calendar
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
                            type={localData.dob ? 'date' : 'text'}
                            name="dob"
                            placeholder="Date of Birth"
                            value={localData.dob}
                            onFocus={(e) => (e.target.type = 'date')}
                            onBlur={(e) => {
                                if (!localData.dob) e.target.type = 'text'
                            }}
                            onChange={handleChange}
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
                            required
                        />
                    </div>

                    {/* Gender */}
                    <div style={{ position: 'relative' }}>
                        <select
                            name="gender"
                            value={localData.gender}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                paddingLeft: '1rem',
                                paddingRight: '1rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                borderRadius: '0.75rem',
                                color: 'gray',
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                outline: 'none',
                                border: '2px solid transparent',
                                transition: 'all 0.3s ease',
                            }}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Phone */}
                    <div style={{ position: 'relative' }}>
                        <Phone
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
                            type="tel"
                            name="phone"
                            placeholder="Mobile Number (10 digits)"
                            value={localData.phone}
                            onChange={handleChange}
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
                            required
                        />
                    </div>

                    {/* Address */}
                    <div style={{ position: 'relative' }}>
                        <MapPin
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                            }}
                            size={20}
                        />
                        <textarea
                            name="address"
                            placeholder="Address"
                            value={localData.address}
                            onChange={handleChange}
                            rows={3}
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
                            required
                        />
                    </div>

                    {/* Submit */}
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
                        {isDisabled ? 'Processing...' : 'Save & Next →'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Step2Personal
