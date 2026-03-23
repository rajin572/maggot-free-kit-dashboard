import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../select";

export interface FilterOption {
    value: string;
    label: string;
}

interface ReuseFilterSelectProps {
    options: FilterOption[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
    triggerClassName?: string;
    disabled?: boolean;
    allowClear?: boolean;
    onClear?: () => void;
}

const ReuseFilterSelect: React.FC<ReuseFilterSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select filter",
    label,
    className = "",
    triggerClassName = "",
    disabled = false,
    allowClear = false,
    onClear,
}) => {
    const handleValueChange = (newValue: string) => {
        if (newValue === "__clear__" && allowClear && onClear) {
            onClear();
            return;
        }
        onChange(newValue);
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">{label}</label>
            )}
            <Select
                value={value}
                onValueChange={handleValueChange}
                disabled={disabled}
            >
                <SelectTrigger
                    className={`border-[#E5E5E5]! outline-none! shadow-none! ring-0! text-base min-w-37.5  ${triggerClassName}`}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {allowClear && value && (
                        <>
                            <SelectItem value="__clear__" className="text-gray-500 italic">
                                Clear selection
                            </SelectItem>
                            <div className="border-t my-1" />
                        </>
                    )}
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ReuseFilterSelect;