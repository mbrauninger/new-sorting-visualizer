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
    this.returnIAndJ = this.returnIAndJ.bind(this);
    this.moveIAndJ = this.moveIAndJ.bind(this);
    this.switchElements = this.switchElements.bind(this);
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
    this.parentColor = "#E0B0FF"
    this.childColor = "#F08080"

    this.elementArray = [] // list for our number elements

    // element generator creates and adds box elements to list
    this.yValue = 220 / 2 // y value location of boxes on canvas
    this.x0Value = this.elementWidth // x value location of first box on canvas
    this.sortedList = []
    this.ijList = []
    this.ijValueArray = null
    {/*where ijValueArray was initally declared */}
    this.arrayStack = null
    this.iDistance = null
    this.jDistance = null
    this.iRunNumber = null
    this.jRunNumber = null
    this.leftElement = null
    this.rightElement = null
    this.speedFactor = 25
    this.referenceNumber = 0 // final refresh number of whatever the previous state was, needed to determine when the next state finishes
    this.number = 0 // current number of screen refreshes, used to determine when current state ends
    this.checkingNumber = null
    this.state = "createCheckingNumber" // first state that the program finds itself in
    this.myReq = null
    this.doAnim = false
    this.firstPress = true
    this.speedChosen = false
    this.nextSpeed = null
    this.sortingFinished = false
    this.iRunNumber = null
    this.jRunNumber = null
    this.sortedCount = 0
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

    // element generator creates and adds box elements to list
    this.sortedList = []
    this.ijList = []
    this.ijValueArray = null
    this.arrayStack = null
    this.iDistance = null
    this.jDistance = null
    this.iRunNumber = null
    this.jRunNumber = null
    this.leftElement = null
    this.rightElement = null
    this.referenceNumber = 0 // final refresh number of whatever the previous state was, needed to determine when the next state finishes
    this.number = 0 // current number of screen refreshes, used to determine when current state ends
    this.checkingNumber = null
    this.state = "createCheckingNumber" // first state that the program finds itself in
    this.myReq = null
    this.doAnim = false
    this.firstPress = true
    this.sortingFinished = false
    this.iRunNumber = null
    this.jRunNumber = null
    this.sortedCount = 0

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

    if ((this.elementArray.length - 1) % 2 == 1) {
      this.checkingNumber = (Math.floor((this.elementArray.length - 2)) / 2)
    }
    else {
      this.checkingNumber = (Math.floor((this.elementArray.length - 3)) / 2)
    }
  
    this.ijValueArray = [0, 1] // contains current positions of i and j, index 0 is i, index 1 is j

    // i and j boxes are created
    this.ijList.push(new Box(this.x0Value + this.ijValueArray[0] * this.elementWidth, this.yValue + this.elementHeight, this.elementWidth, this.elementHeight, "i", this.elementColor))
    this.ijList.push(new Box(this.x0Value + this.ijValueArray[1] * this.elementWidth, this.yValue + this.elementHeight, this.elementWidth, this.elementHeight, "j", this.elementColor))
    {/*}
    var myReq
    */}
    this.arrayStack = [this.elementArray] // sub-arrays will be placed in here to be sorted in the future

    for (i in this.elementArray) {
      this.elementArray[i].draw()
    }
    for (i in this.ijList) {
      this.ijList[i].draw()
    }
    cancelAnimationFrame(this.myReq)
    return
    }

    moveIAndJ(array, speedFactor, oldNumber, number) {
      if (this.state == "calculatingMaxValue")  {
        var parentValue = array[this.ijValueArray[0]].value
        var leftChildValue = array[this.ijValueArray[1]].value
        if (this.ijValueArray[1] != array.length - 1 - this.sortedCount) {
          var rightChildValue = array[this.ijValueArray[1] + 1].value
          if (rightChildValue > leftChildValue) {
            if (rightChildValue > parentValue) {
              this.leftElement = array[this.ijValueArray[0]]
              this.rightElement = array[this.ijValueArray[1] + 1]
              array[this.ijValueArray[0]].color = this.parentColor
              array[this.ijValueArray[1]].color = this.childColor
              array[this.ijValueArray[1] + 1].color = this.childColor
              this.state = "movingJ"
            }
            else {
              this.state = "calculatingDistance"
            }
          }
          else {
            if (leftChildValue > parentValue) {
              this.leftElement = array[this.ijValueArray[0]]
              this.rightElement = array[this.ijValueArray[1]]
              array[this.ijValueArray[0]].color = this.parentColor
              array[this.ijValueArray[1]].color = this.childColor
              array[this.ijValueArray[1] + 1].color = this.childColor
              this.state = "pre-switch"
            }
            else {
              this.state = "calculatingDistance"
            }
          }
        }
        else {
          if (leftChildValue > parentValue) {
            this.leftElement = array[this.ijValueArray[0]]
            this.rightElement = array[this.ijValueArray[1]]
            array[this.ijValueArray[0]].color = this.parentColor
            array[this.ijValueArray[1]].color = this.childColor
            this.state = "pre-switch"
          }
          else {
            this.state = "calculatingDistance"
          }
        }
      }
      if (this.state === "pre-switch") {
        var waitNumber = oldNumber + 1
        if (number == waitNumber) {
          this.referenceNumber = number
          this.state = "switching"
        }
      }
      if (this.state === "movingJ") {
        var runNumber = oldNumber + (this.elementWidth / speedFactor) + 1
        if (number < runNumber) { // running phase of the switching animation
          this.ijList[1].updateX(speedFactor, "right")
        }
        if (this.ijList[1].x % this.elementWidth === 0 && number < runNumber) {
          this.ijValueArray[1] += 1
        }
        if (number == runNumber) {
          this.state = "switching"
          this.referenceNumber = number
        }
      }
      if (this.state === "calculatingDistance") {
        if (this.ijValueArray[0] == 0) {
          var waitNumber = oldNumber + 1
          if (number == waitNumber) {
            this.referenceNumber = number
            this.state = "sortingSwitch"
            this.leftElement = array[0]
            this.rightElement = array[array.length - 1 - this.sortedCount]
          }
        }
        else {
          this.iRunNumber = oldNumber + (this.elementWidth / speedFactor) + 1
          if (array.length % 2 == 0) {
            if (this.ijValueArray[1] % 2 == 1) {
              this.jRunNumber = oldNumber + (2 * this.elementWidth / speedFactor) + 1
            }
            else {
              this.jRunNumber = oldNumber + (3 * this.elementWidth / speedFactor) + 1
            }
          }
          else {
            if (this.ijValueArray[1] % 2 == 0) {
              this.jRunNumber = oldNumber + (3 * this.elementWidth / speedFactor) + 1
            }
            else {
              this.jRunNumber = oldNumber + (2 * this.elementWidth / speedFactor) + 1
            }        }
          this.state = "movingIAndJ"
        }
      }
      if (this.state == "movingIAndJ") {
        if (number < this.iRunNumber) { // running phase of the switching animation
          this.ijList[0].updateX(speedFactor, "left")
        }
        if (number < this.jRunNumber) {
          this.ijList[1].updateX(speedFactor, "left")
        }
        if (this.ijList[0].x % this.elementWidth === 0 && number < this.iRunNumber) {
          this.ijValueArray[0] -= 1
        }
        if (this.ijList[1].x % this.elementWidth === 0 && number < this.jRunNumber) {
          this.ijValueArray[1] -= 1
        }
        if (number == this.jRunNumber) {
          this.referenceNumber = number
          this.checkingNumber -= 1

        this.state = "calculatingMaxValue"

        }
      }
    }
    
    switchElements(array, speedFactor, oldNumber, number) {
      
      // left and right elements are selected based upon state
      if (this.state == "switching" || this.state == "sortingSwitch") {
        var distance = this.elementArray.indexOf(this.rightElement) - this.elementArray.indexOf(this.leftElement) // number of elements each element must travel across
        var riseNumber = oldNumber + (this.elementHeight / speedFactor) + 1 // number that signals the end of the rising phase of the animation
        var runNumber = riseNumber + (this.elementWidth * distance / speedFactor) + 1 // number that signals the end of the running phase of the animation
        var dropNumber = runNumber + (this.elementHeight / speedFactor) + 1 // number that signals the end of the dropping phase of the animation
        
        if (distance === 0) { // when no switching animation is needed
          riseNumber = oldNumber + 1
          runNumber = oldNumber + 1
          dropNumber = oldNumber + 1
        }
        
        if (number < riseNumber) { // rising phase of the switching animation
          this.leftElement.updateY(speedFactor, "up")
          this.rightElement.updateY(2 * speedFactor, "up") // right element rises above left
        }
        if (number > riseNumber && number < runNumber) { // running phase of the switching animation
          this.leftElement.updateX(speedFactor, "right")
          this.rightElement.updateX(speedFactor, "left")
        }
        if (number > runNumber && number < dropNumber) { // dropping phase of the animation
          this.leftElement.updateY(speedFactor, "down")
          this.rightElement.updateY(2 * speedFactor, "down") // because right was above left
        }
        if (number === dropNumber) { // once animation is finished, the element values are switched behind the scenes
          var temp1 = this.rightElement
          var temp2 = this.leftElement
          this.leftElement = temp1 // leftElement variable is changed to new left element
          this.rightElement = temp2 // rightElement variable is changed to new right element
          this.elementArray[this.elementArray.indexOf(temp1)] = temp2
          this.elementArray[this.elementArray.indexOf(temp2)] = temp1
          array[array.indexOf(temp1)] = temp2
          array[array.indexOf(temp2)] = temp1
          this.referenceNumber = number // reference number takes on value of current refresh number
          for (var i in this.elementArray) {
            if (this.elementArray[i].color == this.parentColor || this.elementArray[i].color == this.childColor) {
              this.elementArray[i].color = this.elementColor
            }
          }
          if (this.ijValueArray[0] === 0 && this.state === "switching") {
            this.state = "sortingSwitch"
            this.leftElement = array[0]
            this.rightElement = array[array.length - 1 - this.sortedCount]
          }
          else {
            if (this.ijValueArray[0] === 0) {
              this.sortedCount += 1
              this.rightElement.color = this.sortedColor
              if (this.sortedCount == this.elementArray.length - 1) {
                this.leftElement.color = this.sortedColor
                this.rightElement.color = this.sortedColor
                this.sortingFinished = true
                this.state = "done"
              }
              else {
                this.state = "createCheckingNumber"
              }
            }
            else {
              this.state = "calculatingDistance"
            }
          }
        }
      }
    }
    
    returnIAndJ(array, speedFactor, oldNumber, number) {
      if (this.state == "createCheckingNumber") {
        this.checkingNumber = Math.ceil((array.length - 1 - this.sortedCount) / 2) - 1
        this.iDistance = this.checkingNumber
        if (array.length % 2 == 1) {
          if (this.sortedCount % 2 === 0) {
            this.jDistance = (array.length - 1) - this.ijValueArray[1] - 1 - this.sortedCount
          }
          else {
            this.jDistance = (array.length - 1) - this.ijValueArray[1] - 1 - this.sortedCount + 1
          }
        }
        else {
          if (this.sortedCount % 2 === 0) {
            this.jDistance = (array.length - 1) - this.ijValueArray[1] - this.sortedCount
          }
          else {
            this.jDistance = (array.length - 1) - this.ijValueArray[1] - (this.sortedCount + 1)
          }
        }
        this.state = "calculatingDistance2"
      }
      if (this.state == "calculatingDistance2") {
        if (number === oldNumber) { // because "createCheckingNumber" does no animation
          this.iRunNumber = oldNumber + (this.elementWidth * this.iDistance / speedFactor)
          this.jRunNumber = oldNumber + (this.elementWidth * this.jDistance / speedFactor)
        }
        else {
          this.iRunNumber = oldNumber + (this.elementWidth * this.iDistance / speedFactor) + 1
          this.jRunNumber = oldNumber + (this.elementWidth * Math.abs(this.jDistance) / speedFactor) + 1
        }
        this.state = "returningIAndJ"
      }
      if (number < this.iRunNumber) {
        this.ijList[0].updateX(speedFactor, "right")
        if (this.ijList[0].x % this.elementWidth === 0 && number < this.iRunNumber) {
          this.ijValueArray[0] += 1
        }
      }
      if (number < this.jRunNumber) {
        if (this.jDistance >= 0) {
          this.ijList[1].updateX(speedFactor, "right")
          if (this.ijList[1].x % this.elementWidth === 0 && number < this.jRunNumber) {
            this.ijValueArray[1] += 1
          }
        }
        else {
          this.ijList[1].updateX(speedFactor, "left")
          if (this.ijList[1].x % this.elementWidth === 0 && number < this.jRunNumber) {
            this.ijValueArray[1] -= 1
          }
        }
      }
      if (number == this.jRunNumber) {
        this.referenceNumber = number
        this.state = "calculatingMaxValue"
      }
    }
    partition(array, oldNumber, number, speedFactor) { // implementation of three above functions
      if (this.state === "calculatingMaxValue" || this.state === "movingJ" || this.state === "movingIAndJ" || this.state  === "calculatingDistance" || this.state === "pre-switch") {
        this.moveIAndJ(array, speedFactor, oldNumber, number)
      }
      
      else if (this.state === "switching" || this.state === "sortingSwitch") {
        this.switchElements(array, speedFactor, oldNumber, number)
      }
      else if (this.state === "returningIAndJ" || this.state === "createCheckingNumber") {
        this.returnIAndJ(array, speedFactor, oldNumber, number)
      }
    }
    
    animate() { // refreshes and draws canvas
      if (!this.doAnim) {
        cancelAnimationFrame(this.myReq)
        return
      }
      const canvas = this.canvasRef.current;
      const c = canvas.getContext('2d');
      requestAnimationFrame(this.animate)
      c.clearRect(0, 0, window.innerWidth, window.innerHeight)
      c.fillStyle = "#1d7cdb";
      c.fillRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i in this.elementArray) {
        this.elementArray[i].draw()
      }
      for (var i in this.ijList) {
        this.ijList[i].draw()
      }
      this.partition(this.arrayStack[0], this.referenceNumber, this.number, this.speedFactor)
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

function HeapSort() {

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
        height: "400px",
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
    parent: {
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
    children: {
      width: "25px",
      height: "50px",
      backgroundColor: "#F08080",
      borderColor: 'text.primary',
      display: "inline-block",
      position: "relative",
      top: "120px",
      left: "151px",
      [theme.breakpoints.down('xs')]: {
        left: "0px",
        top: "280px",
      },
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
      <Box fontWeight="fontWeightBold" fontSize="h3.fontSize" fontFamily="Arial">HeapSort</Box>
        <div className={classes.canvas}><Canvas/></div>
        <Box className={classes.key}>
          <Box className={classes.unsorted} border={1}><Typography className={classes.label}>Unsorted Element</Typography></Box>
          <Box className={classes.parent} border={1}><Typography className={classes.label}>Parent Element</Typography></Box>
          <Box className={classes.sorted} border={1}><Typography className={classes.label}>Sorted Element</Typography></Box>
          <Box className={classes.children} border={1}><Typography className={classes.label}>Parent's Children</Typography></Box>
        </Box>
        
      </div>
    </body>

  );
}

export default HeapSort;