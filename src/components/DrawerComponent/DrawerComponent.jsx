import { Drawer } from 'rsuite';
import React from 'react';

const styles = {
    radioGroupLabel: {
        padding: '8px 12px',
        display: 'inline-block',
        verticalAlign: 'middle'
    }
};
const DrawerComponent = ({ title = 'Drawer', placement = 'right', isOpen = false, onClose, children, ...rest }) => {
    const [backdrop, setBackdrop] = React.useState('static');
    return (
        <>
            <Drawer backdrop={backdrop} open={isOpen} onClose={onClose} size='md'>
                <Drawer.Header>
                    <Drawer.Title>{title}</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    {children}
                </Drawer.Body>
            </Drawer>
        </>
    );
};

export default DrawerComponent;
