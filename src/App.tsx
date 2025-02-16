import './App.css'
import Home from './pages/Home'
import { Container, Typography } from '@mui/material'

function App() {
  return (
    <Container maxWidth="md" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Form Builder
      </Typography>
      <Home />
    </Container>
  )
}

export default App