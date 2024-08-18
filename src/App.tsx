import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <button
        className="button"
        onClick={() => alert('Вова, здарова')}
      >
        Отправить данные
      </button>
    </div>
  );
}

export default App;
