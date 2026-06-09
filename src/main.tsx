import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from './i18n'
import { ThemeProvider } from './theme'
import { ImagePreviewProvider } from './components/ImagePreview'
import App from './App.tsx'
import './styles/globals.css'
import { navItems } from './config/site.ts'

window.rootList = navItems.filter(item => item.label && item.label !== null).map(item => item.url);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <I18nProvider>
                <BrowserRouter>
                    <ImagePreviewProvider>
                        <div className="bg-[url('/light-bg.png')] dark:bg-[url('/dark-bg.png')] bg-cover bg-center bg-fixed min-h-screen">
                            <App />
                        </div>
                    </ImagePreviewProvider>
                </BrowserRouter>
            </I18nProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
