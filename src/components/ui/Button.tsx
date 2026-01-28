"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
};

export function Button({ loading, children, ...props }: Props) {
    return (
        <button
            {...props}
            disabled={props.disabled || loading}
            style={{
                height: 48,
                width: "100%",
                borderRadius: 10,
                border: 0,
                color: "white",
                fontWeight: 700,
                cursor: props.disabled || loading ? "not-allowed" : "pointer",
                background: "linear-gradient(135deg, #FD8F06, #990099)",
                opacity: props.disabled || loading ? 0.7 : 1,
            }}
        >
            {loading ? "Entrando..." : children}
        </button>
    );
}
