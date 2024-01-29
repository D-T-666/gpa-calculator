import clsx from "clsx";
import { ChangeEvent, useEffect, useState } from "react";

export type NumberInputProps = {
    value: number | string | undefined,
    setValue: (x: number | null) => void,
    className?: string,
    min: number,
    max: number,
};

function is_string_valid_number(x: string | number | undefined, min: number, max: number) {
    const v = Number(x);
    return !(!x || v === undefined || Number.isNaN(v) || v < min || v > max);
}

export default function NumberInput({ value, setValue, className, min, max }: NumberInputProps) {
    const [valid, setValid] = useState(true);

    const change_handler = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value, is_string_valid_number(e.target.value, min, max) ? "valid" : "invalid")

        if (!is_string_valid_number(e.target.value, min, max)) {
            console.log("invalid number");
            setValue(null);
            setValid(false);
            return;
        }

        setValid(true);
        console.log("valid number");
        setValue(Number(e.target.value));
    };

    // Initial load
    useEffect(() => {
        if (!is_string_valid_number(value, min, max)) {
            setValid(false);
            setValue(null);
        } else {
            setValid(true);
        }
    }, []);

    return (
          <input
            className={clsx(`bg-transparent ${className}`, {
              "shadow-[inset_0_0_8px_0_rgba(255,0,0,0.6)]": !valid,
              "shadow-[inset_0_0_8px_0_rgba(0,0,0,0.1)]": valid
            })}
            type="number"
            value={value}
            {...{min, max}}
            onChange={change_handler}
            onWheel={e => (e.target as HTMLElement).blur()}
        />
    );
}
