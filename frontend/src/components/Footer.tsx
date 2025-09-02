import React from 'react'
const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-10 border-t border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4 text-gray-600 dark:text-gray-300">
        <div className="flex gap-4">
          <a href="https://www.linkedin.com/in/matheushrz" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:opacity-80">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 22h4V7h-4v15zM8.5 7h3.8v2.1h.05c.53-1 1.84-2.1 3.8-2.1 4.06 0 4.8 2.67 4.8 6.14V22h-4v-7.3c0-1.74-.03-3.98-2.42-3.98-2.43 0-2.8 1.9-2.8 3.86V22h-4V7z"/></svg>
          </a>
          <a href="https://github.com/Matheushrz" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:opacity-80">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.77 5.46.77 11.73c0 4.93 3.19 9.1 7.62 10.57.56.1.77-.24.77-.54v-2c-3.1.68-3.76-1.3-3.76-1.3-.5-1.29-1.23-1.63-1.23-1.63-1-.7.08-.68.08-.68 1.1.08 1.68 1.14 1.68 1.14.99 1.7 2.6 1.2 3.23.92.1-.71.39-1.2.7-1.47-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.43-2.22 1.14-3-.11-.28-.5-1.41.1-2.94 0 0 .95-.3 3.1 1.14.9-.25 1.86-.37 2.82-.38.96 0 1.94.13 2.83.38 2.15-1.44 3.1-1.14 3.1-1.14.6 1.53.22 2.66.11 2.94.72.78 1.14 1.78 1.14 3 0 4.3-2.62 5.25-5.11 5.53.4.34.76 1.01.76 2.05v3.03c0 .3.2.65.78.54 4.42-1.47 7.61-5.64 7.61-10.57C23.23 5.46 18.27.5 12 .5z"/></svg>
          </a>
        </div>
        <div className="text-center text-sm">Matheus Reis – Todos os direitos reservados © 2025</div>
      </div>
    </footer>
  )
}
export default Footer
