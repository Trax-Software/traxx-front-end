"use client";

import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export function Input({ label, error, ...props }: Props) {
    return (
        <div style={{ display: "grid", gap: 8 }}>
            {label ? <label style={{ fontSize: 13, fontWeight: 600 }}>{label}</label> : null}
            <input
                {...props}
                style={{
                    height: 48,
                    padding: "0 14px",
                    borderRadius: 10,
                    border: `1px solid ${error ? "#D93025" : "#DFE1E6"}`,
                    outline: "none",
                }}
            />
            {error ? <span style={{ color: "#D93025", fontSize: 12 }}>{error}</span> : null}
        </div>
    );
}
