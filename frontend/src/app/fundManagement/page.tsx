"use client"
import React from 'react'
import FundManagement from '@/app/components/organisms/FundManagement'

const page = () => {
    return (
        <div className="min-h-screen root-container">
            <h1 className="text-4xl font-semibold text-secondary mb-4">Fund Management</h1>
            <h2 className="text-xl font-normal text-secondary mb-8">
                Track and manage all available funds
            </h2>
            <FundManagement />
        </div>
    )
}

export default page