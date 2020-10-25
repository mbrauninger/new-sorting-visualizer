import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Navbar from './Components/navbar.js'
import Box from '@material-ui/core/Box';
import {makeStyles, ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

export default function Home() {

    const theme = createMuiTheme({
        breakpoints: {
          values: {
            xs: 0,
            sm: 650,
            md: 960,
            lg: 1280,
            xl: 1920
          }
        }
      });

    const useStyles = makeStyles(() => ({
      container: {
          width: "90%",
          margin: "auto"
      },
      header: {
        marginBottom: "25px"
      },
      innerContainer: {
          width: "850px"
      },
      text: {
          width: "60%",
          fontSize: "17.5px",
          fontFamily: "Arial",
          [theme.breakpoints.down('xs')]: {
            width: "100%"
          }
      },
      separator: {
        width: "10%",
        [theme.breakpoints.down('xs')]: {
            width: "0%"
          }
      },
      image: {
          width: "40%",
          [theme.breakpoints.down('xs')]: {
            width: "100%"
          }
      },
      smallScreenImage: {
          marginTop: "25px"
      }
    }));
  
    const classes = useStyles()
  
    return (
        <body style={{margin: 0}}>
        <Navbar />
        <ThemeProvider theme={theme}>
        <div className={classes.container}>
            <Box display="flex" width={"100%"} className={classes.header}>
                <Box m="auto" fontWeight="fontWeightBold" fontSize="h3.fontSize" fontFamily="Arial" textAlign="center">
                Welcome to Mike's Sorting Visualizer!
                </Box>
            </Box>
            <Box display="flex" width={"100%"}>
                <Box m="auto" display="flex" className={classes.innerContainer}>
                    <Box className={classes.text} >
                    Hello! My name is Mike Brauninger, and I'm a computer engineering major at UMass Amherst with a passion for programming. I wanted to take on a project that would allow me to build upon what I've learned through my coursework in a visual sense, and a sorting algorithm visualizer of this nature seemed like the perfect opportunity to do so.

                    <br></br>
                    <br></br>
                    <br></br>

                    To operate the visualizer, simply click on any of the sorting algorithms listed in the header of this page, choose a sorting speed, and then click the "Sort" button. To make the array size larger or smaller, make your brower wider or narrower and refresh the page. It is also worth noting that you must reset the array via the "Reset" button before you change speeds.
                    
                    <br></br>
                    <br></br>
                    <br></br>

                    What makes this visualizer unique, in my opinion, is that it utilizes HTML Canvas as a means of achieving a dynamic animation interface. With this type of setup, I was capable of displaying the array index by index in a fashion that allowed me to fluidly show which elements are changing, and where. Thanks for visiting this project, and I hope you enjoy my work!
                    </Box>
                    <Box className={classes.separator}></Box>
                    <Hidden xsDown>
                        <Box className={classes.image}>
                            <img src="./ProfilePicture.png" alt="picture" width={"90%"} />
                        </Box>
                    </Hidden>
                </Box> 
            </Box>
            <Hidden smUp>
            <Box display="flex" width={"100%"} className={classes.smallScreenImage}>
                <Box m="auto" textAlign="center">
                    <img src="./ProfilePicture.png" alt="picture" width={"80%"} />
                </Box>
            </Box>
            </Hidden>
        </div>
        </ThemeProvider>
        </body>
    )
  }