import { EstadoForm } from './components/EstadoForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EstadoList } from './components/EstadoList';
import { PessoaForm } from './components/PessoaForm';
import { PessoaList } from './components/PessoaList';
import { LoginForm } from './components/LoginForm';
import { Layout } from './components/Layout';
import { RequireAuth } from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';

function App()
{

    return(
      <Routes>
        <Route path='/' element={ <Layout/> }>

          <Route path='/login' element={ <LoginForm/>  }/>
          
          <Route element={ <PersistLogin/> }>
            <Route element={ <RequireAuth/> }>
              <Route path='/createEstado' element={ <EstadoForm/> }/>
              <Route path='/updateEstado/:id' element={  <EstadoForm/> } />
              <Route path='/estadosList' element={ <EstadoList/> } />
              <Route path='/createPessoa' element={ <PessoaForm/> } />
              <Route path='/updatePessoa/:id' element={ <PessoaForm/> } />
              <Route path='/pessoasList' element={ <PessoaList/> } />
            </Route>
          </Route>
        </Route>
      </Routes>
    );
}

export default App;