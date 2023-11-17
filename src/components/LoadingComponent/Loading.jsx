import React from 'react'
import { PulseLoader } from 'react-spinners'

const Loading = ({ children, isLoading, color = "white" }) => {
    if (isLoading) {
        return (
            <PulseLoader
                color={color}
                loading={isLoading}
                size={10}
                speedMultiplier={1}
                aria-label="Loading Spinner"
                data-testid="loader"
            >
                {children}
            </PulseLoader>
        )
    } else return children
}

export default Loading
