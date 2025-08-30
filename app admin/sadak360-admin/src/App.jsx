import { BrowserRouter } from "react-router-dom"
import AppRouter from "./router"
import "./App.css"
import "./index.css"
import "./global.css"

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
