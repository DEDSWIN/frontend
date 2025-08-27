// src/pages/register/Step5Success.jsx
import React from 'react'
import { useAuthUser } from '../context/AuthUserContext'

import { CheckCircle2 } from 'lucide-react'

export default function Step5Success({ anweshaId }) {
    const { currentUser } = useAuthUser()
    const displayId = anweshaId || currentUser?.anweshaId || 'N/A'

    return (
        <div className="flex items-center justify-center mb-14 px-6">
            <div className="rounded-3xl shadow-2xl border p-10 w-full max-w-md text-center animate-fade-in bg-white/80 backdrop-blur-lg">
                {/* Heading */}
                <h3 className="text-4xl font-extrabold mb-6 bg-gradient-to-l from-[#095DB7] to-[#41D7B7] bg-clip-text text-transparent">
                    Registration Successful!
                </h3>

                {/* Success Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500 mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>

                {/* Anwesha ID */}
                <p
                    style={{
                        fontSize: '1.125rem',
                        color: '#374151',
                    }}
                >
                    Your unique Anwesha ID is:
                </p>
                <p
                    style={{
                        fontSize: '1.875rem',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        color: '#d97706',
                        marginTop: '0.75rem',
                        letterSpacing: '0.05em',
                    }}
                >
                    {displayId}
                </p>

                {/* Save Notice */}
                <p
                    style={{
                        marginTop: '0.75rem',
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        fontStyle: 'italic',
                    }}
                >
                    ⚠️ Please save this ID for future reference.
                </p>

                {/* Success Message */}
                <div
                    style={{
                        marginTop: '2rem',
                        backgroundColor: '#dcfce7',
                        paddingLeft: '1.25rem',
                        paddingRight: '1.25rem',
                        paddingTop: '0.75rem',
                        paddingBottom: '0.75rem',
                        borderRadius: '0.75rem',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #bbf7d0',
                    }}
                >
                    <p style={{ color: '#15803d' }}>
                        🎉{' '}
                        <span style={{ fontWeight: '600' }}>
                            Registration Complete!
                        </span>{' '}
                        You can now close this window or continue using the
                        application.
                    </p>
                </div>
            </div>
        </div>
    )
}
