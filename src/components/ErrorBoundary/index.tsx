import React from 'react';
import type { ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            backgroundColor: '#f5f5f5',
          }}
        >
          <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            Something went wrong
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, maxWidth: 500, textAlign: 'center', color: 'text.secondary' }}
          >
            An unexpected error occurred. Please try refreshing the page or contact support.
          </Typography>
          {import.meta.env.DEV && this.state.error && (
            <Typography
              variant="caption"
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: '#fff',
                borderRadius: 1,
                maxWidth: 500,
                overflow: 'auto',
                maxHeight: 200,
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
              }}
            >
              {this.state.error.toString()}
            </Typography>
          )}
          <Button variant="contained" onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
