import React, { useEffect, useState } from 'react';
import { Select, Input } from 'antd';
import ModalComponent from '../ModalComponent/ModalComponent';


const InputSelectAndAddNew = ({ label = "Label", initialOptions = [], size = "large", placeholder = "Enter new item", value, onChange, style }) => {
    const [items, setItems] = useState(initialOptions);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newItem, setNewItem] = useState('');

    const handleAddItem = () => {
        setIsModalVisible(true);
    };

    useEffect(() => {
        setItems(initialOptions);
    }, [initialOptions]);

    const handleOk = () => {
        if (newItem && !items.includes(newItem)) {
            setItems([...items, newItem]);
            onChange(newItem);  // <-- Cập nhật giá trị đã chọn khi thêm mới
        }
        setIsModalVisible(false);
        setNewItem('');
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setNewItem('');
    };

    return (
        <>
            <Select
                size={size}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={style}
                dropdownRender={menu => (
                    <div style={{ zIndex: 1500 }}> {/* Đặt z-index cho menu */}
                        {menu}
                        <div style={{ padding: '4px 8px', cursor: 'pointer' }} onMouseDown={e => e.preventDefault()} onClick={handleAddItem}>
                            Add {label.toLowerCase()}
                        </div>
                    </div>
                )}
            >
                {items.map(item => (
                    <Select.Option key={item} value={item}>
                        {item}
                    </Select.Option>
                ))}
            </Select>

            <ModalComponent
                title={`Add ${label}`}
                isOpen={isModalVisible}
                onOke={handleOk}
                onClose={handleCancel}
                zIndex={10000}
            >
                <Input
                    placeholder={placeholder}
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                />
            </ModalComponent>
        </>
    );
}

export default InputSelectAndAddNew;
