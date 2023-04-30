import React from 'react';
import { HttpService, schema, CEP } from './Classes/Http'
import css from './App.module.css'
import Cep from './Components/Cep/Cep';
import './App.css'



function App() {

  return (
    <div className={css.Wrapper}>
      <Cep />
    </div>
  );
}

export default App;
