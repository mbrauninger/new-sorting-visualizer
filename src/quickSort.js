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
    this.placeIAndJ = this.placeIAndJ.bind(this);
    this.switchElements = this.switchElements.bind(this);
    this.returnIAndJ = this.returnIAndJ.bind(this);
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
    this.speedFactor = 25
    this.referenceNumber = 0 // final refresh number of whatever the previous state was, needed to determine when the next state finishes
    this.number = 0 // current number of screen refreshes, used to determine when current state ends
    this.state = "calculatingDistance" // first state that the program finds itself in
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

    // element generator creates and adds box elements to list
    this.sortedList = []
    this.ijList = []
    this.ijValueArray = null
    this.arrayStack = null
    this.iDistance = null
    this.jDistance = null
    this.iRunNumber = null
    this.jRunNumber = null
    this.referenceNumber = 0 // final refresh number of whatever the previous state was, needed to determine when the next state finishes
    this.number = 0 // current number of screen refreshes, used to determine when current state ends
    this.state = "calculatingDistance" // first state that the program finds itself in
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

    // i and j boxes are created
    this.ijList.push(new Box(this.x0Value, this.yValue + this.elementHeight, this.elementWidth, this.elementHeight, "i", this.elementColor))
    this.ijList.push(new Box(this.elementArray[this.elementArray.length - 1].x, this.yValue + this.elementHeight, this.elementWidth, this.elementHeight, "j", this.elementColor))
    {/*}
    var myReq
    */}

    this.ijValueArray = [0, this.elementArray.length - 1] // contains current positions of i and j, index 0 is i, index 1 is j
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

    placeIAndJ(array, speedFactor, oldNumber, number) {
      var initialIValue = this.ijValueArray[0] // initial i and j values are taken as variables
      var initialJValue = this.ijValueArray[1]
      if (this.state === "calculatingDistance") { // program begins in this state... distances to appropriate i and j indices are calculated
        for (var i = initialIValue; i < initialIValue + array.length; i++) {
          if (this.elementArray[i].value > array[0].value) { // distance to i index is found (where i index value > pivot value)
            this.iDistance = i - initialIValue
            break
          }
          if (i === initialIValue + array.length - 1) { // for case where i index is on last array element
            this.iDistance = array.length - 1
          }
        }
        for (var j = initialJValue; j >= initialJValue - array.length + 1; j--) {
          if (this.elementArray[j].value <= array[0].value) { // distance to j index is found (where j index value <= pivot value)
            this.jDistance = initialJValue - j
            break
          }
        }
        this.state = "movingIAndJ" // the behind the scenes work is done for this function, now the animation state is entered which uses the distances calculated above
      }
      if (oldNumber === 0) { // for the first animation state of the program
        // rise and runNumbers in this program are calculated by the number of screen refreshes it takes for the element to get to where it needs to be at the "speed" it is travelling at (pixels moved per screen refresh) 
        var iRunNumber = oldNumber + (this.elementWidth * this.iDistance / speedFactor)
        var jRunNumber = oldNumber + (this.elementWidth * this.jDistance / speedFactor)
      }
      else { // all other states of the program must account for number's (the variable) incrementation with each call to animate() later in the program
        iRunNumber = oldNumber + (this.elementWidth * this.iDistance / speedFactor) + 1
        jRunNumber = oldNumber + (this.elementWidth * this.jDistance / speedFactor) + 1
      }
      if (this.iDistance >= this.jDistance) { // the end of the state will be signaled by when i or j finishes travelling (whichever one has to travel farther)
        var endNumber = iRunNumber
      }
      else {
        var endNumber = jRunNumber
      }
      if (number < iRunNumber) {
        this.ijList[0].updateX(speedFactor, "right") // i moves right until it finds its position
      }
      if (number < jRunNumber) {
        this.ijList[1].updateX(speedFactor, "left") // j moves left until it fnds its position
      }
      // i and j values are incremented based upon their direction every time they pass an element
      if (this.ijList[0].x % this.elementWidth === 0 && number < iRunNumber) {
        this.ijValueArray[0] += 1
      }
      if (this.ijList[1].x % this.elementWidth === 0 && number < jRunNumber) {
        this.ijValueArray[1] -= 1
      }
      if (number === endNumber) {
        this.referenceNumber = number // reference number takes on value of current refresh number
        if (this.ijValueArray[0] < this.ijValueArray[1]) {
          this.state = "switching" // state to switch i and j elements
        }
        else {
          this.state = "sortingSwitch" // state to switch j and pivot elements
        }
      }
    }

    switchElements(array, speedFactor, oldNumber, number) {
      // left and right elements are selected based upon state
      if (this.state === "switching") {
        var leftElement = this.elementArray[this.ijValueArray[0]]
        var rightElement = this.elementArray[this.ijValueArray[1]]
      }
      if (this.state === "sortingSwitch") {
        leftElement = array[0]
        rightElement = this.elementArray[this.ijValueArray[1]]
      }
      var distance = this.elementArray.indexOf(rightElement) - this.elementArray.indexOf(leftElement) // number of elements each element must travel across
      var riseNumber = oldNumber + (this.elementHeight / speedFactor) + 1 // number that signals the end of the rising phase of the animation
      var runNumber = riseNumber + (this.elementWidth * distance / speedFactor) + 1 // number that signals the end of the running phase of the animation
      var dropNumber = runNumber + (this.elementHeight / speedFactor) + 1 // number that signals the end of the dropping phase of the animation
      if (distance === 0) { // when no switching animation is needed
        riseNumber = oldNumber + 1
        runNumber = oldNumber + 1
        dropNumber = oldNumber + 1
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
      if (number === dropNumber) { // once animation is finished, the element values are switched behind the scenes
        var temp1 = rightElement
        var temp2 = leftElement
        leftElement = temp1 // leftElement variable is changed to new left element
        rightElement = temp2 // rightElement variable is changed to new right element
        this.elementArray[this.elementArray.indexOf(temp1)] = temp2
        this.elementArray[this.elementArray.indexOf(temp2)] = temp1
        array[array.indexOf(temp1)] = temp2
        array[array.indexOf(temp2)] = temp1
        this.referenceNumber = number // reference number takes on value of current refresh number
        if (this.state === "switching") {
          this.state = "calculatingDistance" // goes back to find index of next i and j values
        }
        else {
          if (array.length === 2) { // both elements are sorted and no splicing needs to occur
            array[0].color = this.sortedColor // array[0] and array[1] are used here because rightElement could equal leftElement
            this.sortedList[this.elementArray.indexOf(array[0])] = "S"
            array[1].color = this.sortedColor
            this.sortedList[this.elementArray.indexOf(array[1])] = "S"
            this.arrayStack.splice(0, 1)
          }
          else {
            var arrayDuplicate = [...array] // duplicate array that will be mutated to get sub-array
            if (array.indexOf(rightElement) === 0) { // if the leftmost element gets sorted by not moving
              this.sortedList[this.elementArray.indexOf(leftElement)] = "S"
              rightElement.color = this.sortedColor
              this.arrayStack[0] = arrayDuplicate.splice(1, arrayDuplicate.length - 1)
            }
            else if (array.indexOf(rightElement) === 1 && array.indexOf(rightElement) === array.length - 2) {
              this.sortedList[this.elementArray.indexOf(rightElement)] = "S"
              rightElement.color = this.sortedColor
              this.sortedList[this.elementArray.indexOf(rightElement) - 1] = "S"
              this.elementArray[this.elementArray.indexOf(rightElement) - 1].color = this.sortedColor
              this.sortedList[this.elementArray.indexOf(rightElement) + 1] = "S"
              this.elementArray[this.elementArray.indexOf(rightElement) + 1].color = this.sortedColor
              this.arrayStack.splice(0, 1)
            }
            else if (array.indexOf(rightElement) === 1) { // if the element to the right of the leftmost element gets sorted
              this.sortedList[this.elementArray.indexOf(rightElement)] = "S"
              rightElement.color = this.sortedColor
              this.sortedList[this.elementArray.indexOf(rightElement) - 1] = "S"
              this.elementArray[this.elementArray.indexOf(rightElement) - 1].color = this.sortedColor
              this.arrayStack[0] = arrayDuplicate.splice(2, arrayDuplicate.length - 2)
            }
            else if (array.indexOf(rightElement) === array.length - 1) { // if the rightmost element gets sorted
              this.sortedList[this.elementArray.indexOf(rightElement)] = "S"
              rightElement.color = this.sortedColor
              this.arrayStack[0] = arrayDuplicate.splice(0, arrayDuplicate.length - 1)
            }
            else if (array.indexOf(rightElement) === array.length - 2) { // if the element to the left of the rightmost element gets sorted
              this.sortedList[this.elementArray.indexOf(rightElement)] = "S"
              rightElement.color = this.sortedColor
              this.sortedList[this.elementArray.indexOf(rightElement) + 1] = "S"
              this.elementArray[this.elementArray.indexOf(rightElement) + 1].color = this.sortedColor
              this.arrayStack[0] = arrayDuplicate.splice(0, arrayDuplicate.length - 2)
            }
            else { // if a middle element gets sorted and breaks into two sublists
              this.sortedList[this.elementArray.indexOf(rightElement)] = "S"
              rightElement.color = this.sortedColor
              var leftList = arrayDuplicate.splice(0, arrayDuplicate.indexOf(this.elementArray[this.ijValueArray[1]]))
              var rightList = arrayDuplicate.splice(1, arrayDuplicate.length)
              this.arrayStack[0] = leftList
              this.arrayStack.splice(1, 0, rightList)
            }
          }
          this.state = "resetIAndJ" // once this state finishes, i and j must reset themselves for the new array they will be working on
        }
      }
    }

    returnIAndJ(array, speedFactor, oldNumber, number) {
      if (number === oldNumber + 1) { // conditional is applied so distances are not continually calculated, which will mess up the program
        this.iDistance = this.elementArray.indexOf(array[0]) - this.ijValueArray[0]
        this.jDistance = this.elementArray.indexOf(array[array.length - 1]) - this.ijValueArray[1]
      }
      if (this.iDistance && this.jDistance < 0) { // if i and j must travel left
        this.iRunNumber = oldNumber + (this.elementWidth * (this.iDistance * -1) / speedFactor) + 1
        this.jRunNumber = oldNumber + (this.elementWidth * (this.jDistance * -1) / speedFactor) + 1
      }
      else { // if i and j must travel right
        this.iRunNumber = oldNumber + (this.elementWidth * this.iDistance / speedFactor) + 1
        this.jRunNumber = oldNumber + (this.elementWidth * this.jDistance / speedFactor) + 1
      }
      if (Math.abs(this.iDistance) >= Math.abs(this.jDistance)) { // end of state is triggered by whichever block has to travel farther
        var endNumber = this.iRunNumber
      }
      else {
        endNumber = this.jRunNumber
      }
      if (this.iDistance < 0 && this.jDistance < 0) { // when i and j must travel left
        if (number < this.iRunNumber) {
          this.ijList[0].updateX(speedFactor, "left")
        }
        if (number < this.jRunNumber) {
          this.ijList[1].updateX(speedFactor, "left")
        }
        if (number % (this.elementWidth / speedFactor) === 0 && number < this.iRunNumber) { // i and j values are incremented whenever they pass an element
          this.ijValueArray[0] -= 1
        }
        if (number % (this.elementWidth / speedFactor) === 0 && number < this.jRunNumber) {
          this.ijValueArray[1] -= 1
        }
      }
      else { // when i and j must travel right
        if (number < this.iRunNumber) {
          this.ijList[0].updateX(speedFactor, "right")
        }
        if (number < this.jRunNumber) {
          this.ijList[1].updateX(speedFactor, "right")
        }
        if (number % (this.elementWidth / speedFactor) === 0 && number < this.iRunNumber) { // i and j values are incremented whenever they pass an element
          this.ijValueArray[0] += 1
        }
        if (number % (this.elementWidth / speedFactor) === 0 && number < this.jRunNumber) {
          this.ijValueArray[1] += 1
        }
      }
      if (number === endNumber) {
        this.referenceNumber = number // reference number takes on value of current refresh number
        this.state = "calculatingDistance" // now ready to back to the first state, with the only difference being that the list the program is working with is smaller now
      }
    }

    partition(array, oldNumber, number, speedFactor) { // implementation of three above functions
      array[0].color = "#E0B0FF"
      if (this.state === "movingIAndJ" || this.state === "calculatingDistance") {
        this.placeIAndJ(array, speedFactor, oldNumber, number)
      }
      else if (this.state === "switching" || this.state === "sortingSwitch") {
        this.switchElements(array, speedFactor, oldNumber, number)
      }
      else if (this.state === "resetIAndJ") {
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
      if (this.arrayStack.length !== 0) {
        this.partition(this.arrayStack[0], this.referenceNumber, this.number, this.speedFactor)
      }
      else {
          cancelAnimationFrame(this.myReq)
          this.sortingFinished = true
          return
      }
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
          console.log(this.firstPress, this.sortingFinished)
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
              <canvas ref={this.canvasRef} width={this.canvasState.canvasWidth} height={this.canvasState.canvasHeight} className={classes.canvas}/>
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

function QuickSort() {

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
      <Box fontWeight="fontWeightBold" fontSize="h3.fontSize" fontFamily="Arial">QuickSort</Box>
        <div className={classes.canvas}><Canvas/></div>
        <Box className={classes.key}>
          <Box className={classes.unsorted} border={1}><Typography className={classes.label}>Unsorted Element</Typography></Box>
          <Box className={classes.pivot} border={1}><Typography className={classes.label}>Current Pivot</Typography></Box>
          <Box className={classes.sorted} border={1}><Typography className={classes.label}>Sorted Element</Typography></Box>
        </Box>
        
      </div>
    </body>

  );
}

export default QuickSort;