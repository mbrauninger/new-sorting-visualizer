import React from 'react';
//import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HashRouter, Route, Link } from 'react-router-dom';
import Home from './home.js';
import QuickSort from './quickSort'
import BubbleSort from './bubbleSort.js';
import InsertionSort from './insertionSort.js';
import HeapSort from './heapSort.js';
/*
<HashRouter basename='/'>
   <div>
    <ul>
     <li><Link to="/">Home</Link></li>
     <li><Link to="/about">About</Link></li>
    </ul>
    <hr />
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
   </div>
  </HashRouter>
*/

function App() {
  return (
  <HashRouter basename='/'>
   <div>
    <ul>
     <li><Link to="/">Home</Link></li>
     <li><Link to="/quickSort">QuickSort</Link></li>
     <li><Link to="/bubbleSort">BubbleSort</Link></li>
     <li><Link to="/insertionSort">InsertionSort</Link></li>
     <li><Link to="/heapSort">HeapSort</Link></li>
    </ul>
    <Route exact path="/" component={Home} />
    <Route path="/quickSort" component={QuickSort} />
    <Route path="/bubbleSort" component={BubbleSort} />
    <Route path="/insertionSort" component={InsertionSort} />
    <Route path="/heapSort" component={HeapSort} />
   </div>
  </HashRouter>
  )
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