import React from 'react'
import { Modal, Button, ButtonToolbar, Placeholder } from 'rsuite';

const ModalComponent = ({ title = 'Modal', nameBtnSub = 'Add', onClose, onOke, isOpen = 'false', children, size = "sm" }) => {
    return (
        <Modal backdrop="static" open={isOpen} size={size} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>
                    {title}
                    <hr className="my-3" />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onOke} color="orange" appearance="primary">
                    {nameBtnSub}
                </Button>
                <Button onClick={onClose} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalComponent
