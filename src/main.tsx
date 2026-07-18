import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from './i18n'
import { ThemeProvider } from './theme'
import { ImagePreviewProvider } from './components/ImagePreview'

import App from './App.tsx'
import './styles/globals.css'
import { navItems } from './config/site.ts'
import { appearance } from './lib/data'

window.rootList = navItems.filter(item => item.label && item.label !== null).map(item => item.url);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <I18nProvider>
                <BrowserRouter>
                    <ImagePreviewProvider>
                        <div className="relative h-full">
                            <div
                                className="fixed inset-0 bg-cover bg-center -z-10"
                                style={{
                                    backgroundImage: `url('${appearance.background.light}')`,
                                }}
                            />
                            <div
                                className="fixed inset-0 bg-cover bg-center -z-10 opacity-0 dark:opacity-100 transition-opacity"
                                style={{
                                    backgroundImage: `url('${appearance.background.dark}')`,
                                }}
                            />
                            <App />
                        </div>
                    </ImagePreviewProvider>
                </BrowserRouter>
            </I18nProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
