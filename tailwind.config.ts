import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import forms from "@tailwindcss/forms";

const config = {
    darkMode: "class",
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                display: ["Playfair Display", "serif"], 
                body: ["Manrope", "sans-serif"], 
                sans: ["Manrope", "sans-serif"], 
            },
            colors: {
                primary: "#10B981",
                "primary-darker": "#059669",

                "background-light": "#f5f5f5",
                "background-dark": "#1a2a3a",
                "text-light": "#1a2a3a",
                "text-dark": "#f5f5f5",
                "muted-light": "#5c6a77",
                "muted-dark": "#a0b0c0",
                "surface-light": "#FFFFFF",
                "surface-dark": "#233446",
                "text-primary-light": "#1a2a3a",
                "text-primary-dark": "#f5f5f5",
                "text-secondary-light": "#5c6a77",
                "text-secondary-dark": "#a0b0c0",

                success: "#28a745",
                danger: "#dc3545",
                "subtle-light": "#6c757d",
                "subtle-dark": "#a0a0a0",

                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primaryShad: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                DEFAULT: "0.5rem",
                lg: "1rem",
                xl: "1.5rem",
                full: "9999px",
                shadcnLg: "var(--radius)",
                shadcnMd: "calc(var(--radius) - 2px)",
                shadcnSm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                'input-focus': '0 0 0 3px rgba(16, 185, 129, 0.2)',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [
        tailwindcssAnimate,
        forms,
    ],
} satisfies Config;

export default config;