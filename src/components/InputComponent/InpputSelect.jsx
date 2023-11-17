import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

const InputSelect = ({ label = "Label", initialOptions = [], size = "large", placeholder = "Select an item", value, onChange, style }) => {
    const [items, setItems] = useState(initialOptions);
    const [selectedValue, setSelectedValue] = useState(value);

    useEffect(() => {
        setItems(initialOptions);
        setSelectedValue(value);
    }, [initialOptions]);

    const handleSelectChange = (selectedValue, option) => {
        const selectedOptionIndex = items.indexOf(option.children);
        setSelectedValue(selectedValue);
        onChange(selectedValue, selectedOptionIndex);
    };

    return (
        <Select
            size={size}
            value={selectedValue}
            onChange={handleSelectChange}
            placeholder={placeholder}
            style={{ ...style, width: "100%" }}
        >
            {items.map(item => (
                <Select.Option key={item} value={item}>
                    {item}
                </Select.Option>
            ))}
        </Select>
    );
}

export default InputSelect;
