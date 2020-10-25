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

class Canvas extends Component {

  constructor() {
    super();
    this.RadioButtonsGroup = this.RadioButtonsGroup.bind(this)
    this.FinalCanvas = this.FinalCanvas.bind(this)
    this.randomIntFromRange = this.randomIntFromRange.bind(this);
    this.initialize = this.initialize.bind(this);
    this.moveI = this.moveI.bind(this);
    {/*
    this.switchElements = this.switchElements.bind(this);
    this.returnIAndJ = this.returnIAndJ.bind(this);
    */}
    this.partition = this.partition.bind(this);
    this.animate = this.animate.bind(this);
    this.start = this.start.bind(this);
    this.pausePlay = this.pausePlay.bind(this);
    this.reset = this.reset.bind(this);
    this.canvasRef = React.createRef();
    // width height, and color of index boxes
    this.elementWidth = 25
    this.elementHeight = 50
    this.elementColor = "#fff"
    this.sortedColor = "#6089f7"
    this.transitionColor = "#E0B0FF"

    this.elementArray = [] // list for our number elements
    this.insertingArray = []

    // element generator creates and adds box elements to list
    this.yValue = 220 / 2 // y value location of boxes on canvas
    this.x0Value = this.elementWidth // x value location of first box on canvas
    this.sortedList = []
    this.iElement = null
    this.iValue = 0
    {/*where ijValueArray was initally declared */}
    this.arrayStack = null
    this.distance = null
    this.iDistance = null
    this.jDistance = null
    this.iRunNumber = null
    this.jRunNumber = null
    this.speedFactor = 25
    this.referenceNumber = 0 // final refresh number of whatever the previous state was, needed to determine when the next state finishes
    this.number = 0 // current number of screen refreshes, used to determine when current state ends
    this.state = "movingIAndJ" // first state that the program finds itself in
    this.myReq = null
    this.doAnim = false
    this.firstPress = true
    this.speedChosen = false
    this.nextSpeed = null
    this.sortingFinished = false
  }

  canvasState = {
      canvasWidth: window.innerWidth * 0.9,
      canvasHeight: 220
  }

  // Helper function: returns a random number in range of two given numbers
  randomIntFromRange(num1, num2) {
  var distance = num2 + 1 - num1
  var randomDistanceBetween = Math.random() * distance
  var number = Math.floor(num1 + randomDistanceBetween)
  return number
  }

  initialize() {

    this.elementArray = [] // list for our number elements
    this.insertingArray = []

    // element generator creates and adds box elements to list
    this.sortedList = []
    this.iElement = null
    this.iValue = 0
    this.arrayStack = null
    this.distance = null
    this.iDistance = null
    this.jDistance = null
    this.iRunNumber = null
    this.jRunNumber = null
    this.referenceNumber = 0 // final refresh number of whatever the previous state was, needed to determine when the next state finishes
    this.number = 0 // current number of screen refreshes, used to determine when current state ends
    this.state = "movingIAndJ" // first state that the program finds itself in
    this.myReq = null
    this.doAnim = false
    this.firstPress = true
    this.sortingFinished = false

    const canvas = this.canvasRef.current;
    const c = canvas.getContext('2d');
    c.fillStyle = "#1d7cdb";
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
    c.fillRect(0, 0, this.canvasState.canvasWidth, this.canvasState.canvasHeight);



      // --------------------------------- Box class------------------------------------------------

  // dimensions for list indices that will be visualized on the canvas
  class Box {
    constructor(x, y, width, height, value, color) {
      this.x = x // x coordinate of upper left corner
      this.y = y // y coordinate of upper left croner
      this.width = width  // width of index box
      this.height = height // height of index box
      this.value = value  // value stored in index box
      this.color = color // color of box
    }

    draw() { // method that draws boxes with a value stored inside
      c.beginPath()
      c.rect(this.x, this.y, this.width, this.height)
      c.fillStyle = this.color
      c.fill()
      c.stroke()
      c.closePath()
      c.beginPath()
      c.font = "11px Arial"
      c.fillStyle = "black"
      if (this.value === "i" || this.value === "j") {
        c.fillText(this.value, this.x + 0.46 * this.width, this.y + 0.6 * this.height)
      }
      else if (this.value < 10) {
        c.fillText(this.value, this.x + 0.39 * this.width, this.y + 0.6 * this.height)
      }
      else if (10 <= this.value && this.value < 100) {
        c.fillText(this.value, this.x + 0.26 * this.width, this.y + 0.6 * this.height)
      }
      else {
        c.fillText(this.value, this.x + 0.125 * this.width, this.y + 0.6 * this.height)
      }
      c.fill()
      c.closePath()
    }

    updateX(dx, direction) { // updates the x value of a box for next screen refresh by dx pixels
      if (direction === "left") {
        this.x -= dx
      }
      if (direction === "right") {
        this.x += dx
      }
    }

    updateY(dy, direction) { // updates the x value of a box for next screen refresh by dy pixels
      if (direction === "up") {
        this.y -= dy
      }
      if (direction === "down") {
        this.y += dy
      }
    }
  }

  // -------------------------------------------------------------------------------------------

  // ---------------------------- functions to be used in main program -------------------------

  // Funtion that initializes the visual elements and what will be working behind the scenes

    
    var i = 0
    while (i * this.elementWidth < canvas.width - (3 * this.elementWidth)) {
      let xValue = this.x0Value + this.elementWidth * i // so boxes will be placed immediately next to each other
      let listElement = new Box(xValue, this.yValue, this.elementWidth, this.elementHeight, this.randomIntFromRange(1, 999), this.elementColor)
      this.elementArray.push(listElement)
      this.sortedList.push("NS")
      i += 1
    }
    /*
   var testArray = [3, 1, 2]
   for (var i in testArray) {
    let xValue = this.x0Value + this.elementWidth * i // so boxes will be placed immediately next to each other
    let listElement = new Box(xValue, this.yValue, this.elementWidth, this.elementHeight, testArray[i], this.elementColor)
    this.elementArray.push(listElement)
    this.sortedList.push("NS")
   }
   */

    // i and j boxes are created
    this.iElement = new Box(this.x0Value, this.yValue + this.elementHeight, this.elementWidth, this.elementHeight, "i", this.elementColor)


    this.ijValueArray = [0, 1] // contains current positions of i and j, index 0 is i, index 1 is j
    this.arrayStack = [this.elementArray] // sub-arrays will be placed in here to be sorted in the future
    this.insertingArray = [this.elementArray[0]]

    for (i in this.elementArray) {
      this.elementArray[i].draw()
    }
    this.iElement.draw()
    
    cancelAnimationFrame(this.myReq)
    return
    }

    moveI(speedFactor, oldNumber, number) {
      if (this.state == "movingIAndJ") {
          if (oldNumber == 0) { // for the first animation state of the program
            // rise and runNumbers in this program are calculated by the number of screen refreshes it takes for the element to get to where it needs to be at the "speed" it is travelling at (pixels moved per screen refresh) 
            var runNumber = oldNumber + (this.elementWidth / speedFactor)
          }
          else { // all other states of the program must account for number's (the variable) incrementation with each call to animate() later in the program
            runNumber = oldNumber + (this.elementWidth / speedFactor) + 1
          }
          // rise and runNumbers in this program are calculated by the number of screen refreshes it takes for the element to get to where it needs to be at the "speed" it is travelling at (pixels moved per screen refresh)
          if (number < runNumber) {
            this.iElement.updateX(speedFactor, "right") // i moves right until it finds its position
          }
          // i and j values are incremented based upon their direction every time they pass an element
          if (this.iElement.x % this.elementWidth == 0 && number < runNumber) {
            this.iValue += 1
          }
          if (number == runNumber) {
            this.referenceNumber = number // reference number takes on value of current refresh number
            this.state = "switching"
          }
      }
    }

    switchElements(speedFactor, oldNumber, number) {
      this.distance = null
      for (var j in this.insertingArray) {
        if (this.elementArray[j].value > this.elementArray[this.iValue].value) {
          var jValue = j
          this.distance = this.iValue - j
          break
        }
      }
      if (this.distance != null) {
        var rightElement = this.elementArray[this.iValue]
        var riseNumber = oldNumber + (this.elementHeight / speedFactor) + 1 // number that signals the end of the rising phase of the animation
        var runRightNumber = riseNumber + (this.elementWidth / speedFactor) + 1
        var runLeftNumber = riseNumber + (this.elementWidth * this.distance / speedFactor) + 1
        var dropNumber = runLeftNumber + (this.elementHeight / speedFactor) + 1
        if (number < riseNumber) { // rising phase of the switching animation
          rightElement.updateY(speedFactor, "up") // right element rises above left
        }
        if (number > riseNumber && number < runRightNumber) { // running phase of the switching animation
          for (var j = jValue; j < this.insertingArray.length; j++) {
            this.insertingArray[j].updateX(speedFactor, "right")
          }
        }
        if (number > riseNumber && number < runLeftNumber) { // running phase of the switching animation
          rightElement.updateX(speedFactor, "left")
        }
        if (number > runLeftNumber && number < dropNumber) { // dropping phase of the animation
          rightElement.updateY(speedFactor, "down") // because right was above left
        }
        if (number == dropNumber) {
          this.insertingArray.splice(this.iValue - this.distance, 0, rightElement)
          this.elementArray = this.insertingArray.concat(this.elementArray.splice(this.iValue+1))
          this.referenceNumber = number // reference number takes on value of current refresh number
          if (this.iValue == this.elementArray.length - 1) {
            this.sortingFinished = true
            this.state = "done"
          }
          else {
            this.state = "movingIAndJ"
          }
        }
      }
      else {
        this.insertingArray.push(this.elementArray[this.iValue])
        this.referenceNumber = number // reference number takes on value of current refresh number
        if (this.iValue == this.elementArray.length - 1) {
          this.sortingFinished = true
          this.state = "done"
        }
        else {
          this.state = "movingIAndJ"
        }
      }
    }
    /*
    switchElements(speedFactor, oldNumber, number) {
      var leftElement = this.elementArray[this.ijValueArray[0]]
      leftElement.color = this.transitionColor
      var rightElement = this.elementArray[this.ijValueArray[1]]
      var distance = this.elementArray.indexOf(rightElement) - this.elementArray.indexOf(leftElement) // number of elements each element must travel across
      var riseNumber = oldNumber + (this.elementHeight / speedFactor) + 1 // number that signals the end of the rising phase of the animation
      var runNumber = riseNumber + (this.elementWidth * distance / speedFactor) + 1 // number that signals the end of the running phase of the animation
      var dropNumber = runNumber + (this.elementHeight / speedFactor) + 1 // number that signals the end of the dropping phase of the animation
      if (leftElement.value <= rightElement.value) { // when no switching animation is needed
        riseNumber = oldNumber + 1
        runNumber = oldNumber + 1
        dropNumber = oldNumber + 1
        this.state = "resetIAndJ"
        return
      }
      if (number < riseNumber) { // rising phase of the switching animation
        leftElement.updateY(speedFactor, "up")
        rightElement.updateY(2 * speedFactor, "up") // right element rises above left
      }
      if (number > riseNumber && number < runNumber) { // running phase of the switching animation
        leftElement.updateX(speedFactor, "right")
        rightElement.updateX(speedFactor, "left")
      }
      if (number > runNumber && number < dropNumber) { // dropping phase of the animation
        leftElement.updateY(speedFactor, "down")
        rightElement.updateY(2 * speedFactor, "down") // because right was above left
      }
      if (number == dropNumber) { // once animation is finished, the element values are switched behind the scenes
        var temp1 = rightElement
        var temp2 = leftElement
        leftElement = temp1 // leftElement variable is changed to new left element
        rightElement = temp2 // rightElement variable is changed to new right element
        this.elementArray[this.elementArray.indexOf(temp1)] = temp2
        this.elementArray[this.elementArray.indexOf(temp2)] = temp1
        rightElement.color = "#fff"
        for (var i = this.ijValueArray[0]; i < this.elementArray.length; i++) {
            if (this.elementArray[i].value > this.elementArray[Number(i) + 1].value) {
                break
            }
            if (i == this.elementArray.length - 2) {
                if (this.elementArray[i].value <= this.elementArray[Number(i) + 1].value) {
                    for (i = this.ijValueArray[1]; i < this.elementArray.length; i++) {
                      this.elementArray[i].color = this.sortedColor
                    }
                    this.state = "resetIAndJ"
                    return
                }
            }
        }
        this.referenceNumber = number // reference number takes on value of current refresh number
        this.state = "calculatingDistance" // goes back to find index of next i and j values
      }
    }

    returnIAndJ() {
      this.ijValueArray[0] = 0
      this.ijValueArray[1] = 1
      this.ijList[0].x = this.x0Value
      this.ijList[1].x = 2 * this.x0Value
      this.referenceNumber = this.number
      this.state = "calculatingDistance"
    }
    */
    partition(oldNumber, number, speedFactor) { // implementation of three above functions
      if (this.state == "movingIAndJ") {
        this.moveI(speedFactor, oldNumber, number)
      }
      
      else if (this.state == "switching") {
        this.switchElements(speedFactor, oldNumber, number)
      }
      /*
      else if (this.state == "resetIAndJ") {
        this.returnIAndJ()
      }
      */
  }

  animate() { // refreshes and draws canvas
    if (!this.doAnim) { // halts animation
      cancelAnimationFrame(this.myReq)
      return
    }
    const canvas = this.canvasRef.current;
    const c = canvas.getContext('2d');
    requestAnimationFrame(this.animate)
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
    c.fillStyle = "#1d7cdb";
    c.fillRect(0, 0, window.innerWidth, window.innerHeight);
    for (var i in this.insertingArray) {
      this.elementArray[i].color = this.transitionColor
    }
    for (var i in this.elementArray) {
      this.elementArray[i].draw()
    }
    this.iElement.draw()
    
    if (this.sortingFinished) {
        for (i in this.elementArray) {
          this.elementArray[i].color = this.sortedColor
          this.elementArray[i].draw()
        }
        cancelAnimationFrame(this.myReq)
        return
    }
    this.partition(this.referenceNumber, this.number, this.speedFactor)
    this.number += 1
  }


    start() {
      if (!this.speedChosen) {
        window.alert("Please choose a sorting speed.")
        return
      }
      if (this.firstPress) {
        this.doAnim = true
        this.speedFactor = this.nextSpeed
        this.myReq = this.animate()
        this.firstPress = false
      }
    }

    pausePlay() {
      if (!this.firstPress) {
        this.doAnim = !this.doAnim
        if (this.doAnim) {
          this.myReq = this.animate()
        }
      }
    }

    reset() {

      this.initialize()

      this.firstPress = true

    }

    RadioButtonsGroup() {

      const useStyles = makeStyles(() => ({
        radioButtons: {
            position: "relative",
            top: "10px",
            left: "3px",
            display: "block"
        }
      }));

      const classes = useStyles()

      const BlueRadio = withStyles({
          root: {
            '&$checked': {
              color: "#1d7cdb",
            },
          },
          checked: {},
        })((props) => <Radio color="default" {...props} />);
  
      const [value, setValue] = React.useState(null);
  
      const handleChange = (event) => {
          setValue(event.target.value);
          this.nextSpeed = Number(event.target.value)
          if (this.firstPress) {
            this.speedFactor = Number(event.target.value)
            this.speedChosen = true
          }
          if (!this.firstPress && !this.sortingFinished) {
            window.alert('Please reset in order to switch speeds.')
          }
      };
  
      return (
          <FormControl component="fieldset">
          <RadioGroup row aria-label="speeds" name="speed1" value={value} onChange={handleChange} className={classes.radioButtons}>
              <FormControlLabel value="25" control={<BlueRadio />} label="Fast" />
              <FormControlLabel value="12.5" control={<BlueRadio />} label="Medium" />
              <FormControlLabel value="6.25" control={<BlueRadio />} label="Slow" />
              <FormControlLabel value="3.125" control={<BlueRadio />} label="Very Slow" />
          </RadioGroup>
          
          </FormControl>
      );
  }

  FinalCanvas() {
    const useStyles = makeStyles(() => ({
      buttons: {
          position: "relative",
          top: "20px"
      },
      canvas: {
        display: "block"
      }
    }));

    const classes = useStyles()

      return (
          <div>
              <canvas ref={this.canvasRef} width={this.canvasState.canvasWidth} height={this.canvasState.canvasHeight} className={classes.canvas} />
              <this.RadioButtonsGroup />
              <Box className={classes.buttons}>
              <StyledButton id="action_button" text="Sort" function={this.start}></StyledButton>
              <StyledButton id="action_button" text="Pause" function={this.pausePlay}></StyledButton>
              <StyledButton id="action_button" text="Reset" function={this.reset}></StyledButton>
              </Box>
          </div>
      );
  }

    componentDidMount() {
      this.initialize()
    }

  

  render() {
    return(<this.FinalCanvas/>)
  }
}

function InsertionSort() {

  const theme = createMuiTheme();

  const useStyles = makeStyles(() => ({
    container: {
        width: "91.5%",
        margin: "auto",

      },
    canvas: {
      marginBottom: "15px",
      marginTop: "10px"
    },
    key: {
      width: "455px",
      height: "200px",
      [theme.breakpoints.down('xs')]: {
        height: "300px",
        width: "100px"
      },
      borderColor: 'text.primary'
    },
    unsorted: {
      width: "25px",
      height: "50px",
      borderColor: 'text.primary',
      display: "inline-block",
      position: "relative",
      top: "10px",
      //left: "20px"
    },
    pivot: {
      width: "25px",
      height: "50px",
      backgroundColor: "#E0B0FF",
      borderColor: 'text.primary',
      display: "inline-block",
      position: "relative",
      left: "205px",
      [theme.breakpoints.down('xs')]: {
        left: "-27px",
        top: "230px",
      },
      top: "10px"
    },
    sorted: {
      width: "25px",
      height: "50px",
      backgroundColor: "#6089f7",
      borderColor: 'text.primary',
      display: "inline-block",
      position: "relative",
      top: "120px",
      right: "54px"
    },
    label: {
      position: "absolute",
      top: "10px",
      left: "40px",
      width: "200px",
      fontSize: "20px"
    }
  }));
    
    const classes = useStyles()

  return (
    <body style={{margin: 0}}>
      <header className="App-header"></header>

      <Navbar/>
      <div className={classes.container}>
      <Box fontWeight="fontWeightBold" fontSize="h3.fontSize" fontFamily="Arial">InsertionSort</Box>
        <div className={classes.canvas}><Canvas/></div>
        <Box className={classes.key}>
          <Box className={classes.unsorted} border={1}><Typography className={classes.label}>Unsorted Element</Typography></Box>
          <Box className={classes.pivot} border={1}><Typography className={classes.label}>Insertion Array</Typography></Box>
          <Box className={classes.sorted} border={1}><Typography className={classes.label}>Sorted Array</Typography></Box>
        </Box>
        
      </div>
    </body>

  );
}

export default InsertionSort;