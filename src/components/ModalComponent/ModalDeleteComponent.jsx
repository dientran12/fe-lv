import React from 'react'
import { Modal, Button, ButtonToolbar, Placeholder } from 'rsuite';

const ModalDeleteComponent = ({ title = 'Modal', onClose, onOke, isOpen = 'false', children, size = 'sm' }) => {
    return (
        <Modal open={isOpen} size={size} onClose={onClose}>
            <Modal.Header >
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onOke} color="red" appearance="primary">
                    Delete
                </Button>
                <Button onClick={onClose} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalDeleteComponent
