import React from 'react'

interface AuthHeaderProps {
    title: string,
    description ?: string
    className ?: string
}

const AuthHeader = ({ title, description, className = "mb-6" }: AuthHeaderProps) => {
    return (
        <div className={`${className} text-center`}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
            <p className="text-gray-custom text-sm">{description}</p>
        </div>
    )
}

export default AuthHeader
