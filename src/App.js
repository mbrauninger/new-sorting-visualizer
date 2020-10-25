import React, {Component} from 'react';
import { useRef, useEffect, useState } from 'react';
import {makeStyles, MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Navbar from './Components/navbar.js'
import Button from '@material-ui/core/Button';
import StyledButton from './Components/styledbutton.js'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './home.js';
import QuickSort from './quickSort'
import BubbleSort from './bubbleSort.js';
import InsertionSort from './insertionSort.js';
import HeapSort from './heapSort.js';

function App() {

  return (
    <BrowserRouter>
    <Switch>  
    <body style={{margin: 0}}>
      <header className="App-header"></header>
      <Route path="/" component={Home} exact/>
      <Route path="/QuickSort" component={QuickSort} exact/>
      <Route path="/BubbleSort" component={BubbleSort} exact/>
      <Route path="/InsertionSort" component={InsertionSort} exact/>
      <Route path="/HeapSort" component={HeapSort} exact/>
    </body>
    </Switch>
    </BrowserRouter>

  );
}

export default App;