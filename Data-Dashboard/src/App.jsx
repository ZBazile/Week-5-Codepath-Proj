import { useState } from 'react';
import './App.css'
import RecipeDashboard from './components/RecipeDashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="App">
      <header className="App-header">
        <h1>International Recipes Dashboard</h1>
      </header>
      <main>
        <RecipeDashboard />
      </main>
    </div>

    </>
  )
}

export default App
