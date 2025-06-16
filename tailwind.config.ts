
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Colores de marca personalizados
				gold: 'rgb(var(--gold))',
				'blue-primary': 'rgb(var(--blue-primary))',
				'blue-secondary': 'rgb(var(--blue-secondary))',
				'blue-light': 'rgb(var(--blue-light))',
				'slate-elegant': 'rgb(var(--slate-elegant))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'inter': ['Inter', 'system-ui', 'sans-serif'],
				'playfair': ['Playfair Display', 'serif'],
				'montserrat': ['Montserrat', 'sans-serif']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Animaciones elegantes personalizadas
				'elegant-fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px) scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'elegant-scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9) rotateX(10deg)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1) rotateX(0deg)'
					}
				},
				'elegant-slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(40px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'shimmer': {
					'0%': { left: '-100%' },
					'100%': { left: '100%' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow': {
					'0%, 100%': { 
						'box-shadow': '0 0 20px rgba(212, 175, 55, 0.5)' 
					},
					'50%': { 
						'box-shadow': '0 0 40px rgba(212, 175, 55, 0.8)' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'elegant-fade-in': 'elegant-fade-in 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'elegant-scale-in': 'elegant-scale-in 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'elegant-slide-up': 'elegant-slide-up 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'shimmer': 'shimmer 2s infinite',
				'float': 'float 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate'
			},
			backdropBlur: {
				'xs': '2px'
			},
			boxShadow: {
				'elegant': '0 4px 6px -1px rgba(30, 58, 138, 0.1), 0 2px 4px -2px rgba(30, 58, 138, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
				'gold': '0 4px 6px -1px rgba(212, 175, 55, 0.2), 0 2px 4px -2px rgba(212, 175, 55, 0.15), 0 10px 15px -3px rgba(212, 175, 55, 0.1)',
				'3d-elegant': '0 4px 6px rgba(30, 58, 138, 0.07), 0 10px 20px rgba(30, 58, 138, 0.15), 0 2px 6px rgba(212, 175, 55, 0.1)',
				'hover-elegant': '0 10px 25px rgba(30, 58, 138, 0.15), 0 20px 40px rgba(30, 58, 138, 0.1), 0 4px 12px rgba(212, 175, 55, 0.15)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
