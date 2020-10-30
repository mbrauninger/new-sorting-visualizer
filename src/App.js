import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Home from './home.js';
import QuickSort from './quickSort'
import BubbleSort from './bubbleSort.js';
import InsertionSort from './insertionSort.js';
import HeapSort from './heapSort.js';


function App() {

  return (
    <HashRouter>
    <Switch>  
    <div>
      <header className="App-header"></header>
      {
        document.title = 'Mike\'s Sorting Vsiualizer'
      }
      <Route exact path="/" render={props => <Home {...props} />} />
      <Route exact path="/quickSort" render={props => <QuickSort {...props} />} />
      <Route exact path="/bubbleSort" render={props => <BubbleSort {...props} />} />
      <Route exact path="/insertionSort" render={props => <InsertionSort {...props} />} />
      <Route exact path="/heapSort" render={props => <HeapSort {...props} />} />
    </div>
    </Switch>
    </HashRouter>
  );
  
}

export default App;