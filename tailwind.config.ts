
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
				// ECOSISTEMA PROFESIONAL - Paleta Azul, Blanco, Gris
				'blue-ecosystem': {
					primary: 'rgb(29 78 216)',
					secondary: 'rgb(59 130 246)',
					light: 'rgb(219 234 254)',
					dark: 'rgb(30 58 138)'
				},
				'gray-ecosystem': {
					card: 'rgb(249 250 251)',
					border: 'rgb(229 231 235)',
					text: 'rgb(107 114 128)',
					light: 'rgb(248 250 252)',
					medium: 'rgb(156 163 175)',
					dark: 'rgb(75 85 99)'
				},
				// Compatibilidad con colores legacy
				'blue-primary': 'rgb(29 78 216)',
				'blue-secondary': 'rgb(59 130 246)',
				'blue-light': 'rgb(219 234 254)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'inter': ['Inter', 'system-ui', 'sans-serif'],
				'system': ['system-ui', 'sans-serif']
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
				// Animaciones profesionales del ecosistema
				'fade-in-professional': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px) scale(0.98)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'slide-up-professional': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in-professional': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'shimmer-professional': {
					'0%': { 
						backgroundPosition: '-200% 0' 
					},
					'100%': { 
						backgroundPosition: '200% 0' 
					}
				},
				'pulse-professional': {
					'0%, 100%': { 
						transform: 'scale(1)',
						opacity: '1'
					},
					'50%': { 
						transform: 'scale(1.02)',
						opacity: '0.9'
					}
				},
				'bounce-soft': {
					'0%, 100%': { 
						transform: 'translateY(0)' 
					},
					'50%': { 
						transform: 'translateY(-8px)' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				// Animaciones del ecosistema
				'fade-in-professional': 'fade-in-professional 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'slide-up-professional': 'slide-up-professional 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'scale-in-professional': 'scale-in-professional 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'shimmer-professional': 'shimmer-professional 2s infinite linear',
				'pulse-professional': 'pulse-professional 2s ease-in-out infinite',
				'bounce-soft': 'bounce-soft 1s ease-in-out infinite'
			},
			backdropBlur: {
				'xs': '2px',
				'professional': '10px'
			},
			boxShadow: {
				// Sombras profesionales del ecosistema
				'ecosystem-soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'ecosystem-medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'ecosystem-large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'ecosystem-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				// Sombras específicas para componentes
				'blue-glow': '0 4px 6px -1px rgba(29, 78, 216, 0.2), 0 2px 4px -2px rgba(29, 78, 216, 0.15)',
				'card-professional': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(229, 231, 235, 0.8)',
				'nav-professional': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
			},
			backgroundImage: {
				// Gradientes profesionales
				'gradient-professional': 'linear-gradient(135deg, rgb(29 78 216), rgb(59 130 246))',
				'gradient-soft': 'linear-gradient(135deg, rgb(249 250 251), rgb(248 250 252))',
				'gradient-overlay': 'linear-gradient(135deg, rgba(29, 78, 216, 0.05), rgba(59, 130, 246, 0.05))'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			},
			zIndex: {
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
