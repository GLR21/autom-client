import { EstadoForm } from './components/EstadoForm';
import { Component } from 'react';
import { NavbarComponent } from './components/NavbarComponent';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import axios from 'axios';
import { EstadoList } from './components/EstadoList';
import { CssBaseline } from '@mui/material';
import { PessoaForm } from './components/PessoaForm';
import { PessoaList } from './components/PessoaList';

function App()
{

    return(
      <Router>
        <CssBaseline/>
          <div className='App'>
              <NavbarComponent/>
              <div className='content'>
                <Switch>
                  
                  { /* Rotas para Estados */ }
                  <Route exact path='/createEstado'>
                    <EstadoForm/>
                  </Route>
                  <Route exact path='/updateEstado/:id'>
                    <EstadoForm/>
                  </Route>
                  <Route exact path='/estadosList'>
                    <EstadoList/>
                  </Route>

                  <Route exact path='/createPessoa'>
                    <PessoaForm/>
                  </Route>

                  <Route exact path='/updatePessoa/:id'>
                    <PessoaForm/>
                  </Route>

                  <Route exact path='/updatePessoa/:id'>
                    <PessoaForm/>
                  </Route>
                  <Route exact path='/pessoasList'>
                    <PessoaList/>
                  </Route>

                </Switch>
              </div>
          </div>
      </Router>
    );
}
  

export default App;