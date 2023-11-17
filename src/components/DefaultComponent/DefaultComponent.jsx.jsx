import React from 'react'
import FooterComponent from '../FooterComponent/FooterComponent'
import HeaderComponent from '../HeaderComponent/HeaderComponent'

const DefaultComponent = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HeaderComponent style={{ flex: '0 0 auto' }} />
            <div style={{ flex: '1' }}>
                {children}
            </div>
            <FooterComponent style={{ flex: '0 0 auto' }} />
        </div>
    )
}

export default DefaultComponent
