import { Component, type ReactNode } from 'react'
import { ErrorState } from './ErrorState'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Use ErrorState (functional component with i18n) for the error display
      return (
        <div className="my-8">
          <ErrorState
            message={this.state.error?.message}
            onRetry={this.handleReset}
          />
        </div>
      )
    }

    return this.props.children
  }
}
