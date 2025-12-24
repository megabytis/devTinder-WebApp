import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Error Boundary to catch any render errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', background: '#111', minHeight: '100vh', padding: '50px' }}>
          <h1 style={{ color: '#ff6b6b' }}>Something went wrong!</h1>
          <pre style={{ color: '#fff', background: '#222', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

// Import App
import App from './App.jsx'

const root = document.getElementById('root')
console.log('Root element:', root)

if (root) {
  console.log('Creating React root with ErrorBoundary...')
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
  console.log('Render called')
}
