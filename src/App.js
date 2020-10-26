import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './home.js';
import QuickSort from './quickSort'
import BubbleSort from './bubbleSort.js';
import InsertionSort from './insertionSort.js';
import HeapSort from './heapSort.js';

function App() {

  return (

    <div>
      <header className="App-header"></header>
      {
        document.title = 'Mike\'s Sorting Vsiualizer'
      }
      <HeapSort/>
    </div>

  );
}

/*
function App() {

  return (
    <BrowserRouter>
    <Switch>  
    <div>
      <header className="App-header"></header>
      {
        document.title = 'Mike\'s Sorting Vsiualizer'
      }
      <Route path="/" component={Home} exact/>
      <Route path="/QuickSort" component={QuickSort} exact/>
      <Route path="/BubbleSort" component={BubbleSort} exact/>
      <Route path="/InsertionSort" component={InsertionSort} exact/>
      <Route path="/HeapSort" component={HeapSort} exact/>
    </div>
    </Switch>
    </BrowserRouter>

  );
}
*/
export default App;