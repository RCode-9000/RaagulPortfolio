// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )


import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"
import '@fontsource-variable/jetbrains-mono';
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx';

const rootElement = document.getElementById('root')

const theme = extendTheme({
  fonts: {
    heading: "JetBrains Mono Variable",
    body: "JetBrains Mono Variable",
  },
})

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)