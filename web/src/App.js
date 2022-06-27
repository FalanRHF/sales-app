import logo from './logo.svg';
import './App.css';

import { BrowserRouter } from 'react-router-dom';
import Router from './routes'
import { Container } from '@mui/material'

const oldApp = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const App = () => {

  return (
    <Container sx={{ height: '100vh', backgroundColor: '#F0F0F0' }}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Container>
  )
}

export default App;
