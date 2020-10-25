import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import LooksThreeIcon from '@material-ui/icons/Looks3';
import LooksFourIcon from '@material-ui/icons/Looks4';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
    color: 'white'
  },
  nested: {
    position: "relative",
    left: 25
  }
});

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, true)}
    >
      <List>
        <ListItemLink button key={'Home'} href='/'><ListItemIcon><HomeIcon /></ListItemIcon><ListItemText primary={'Home'} /></ListItemLink>
        <ListItemLink button key={'QuickSort'} href='/quickSort'><ListItemIcon><LooksOneIcon /></ListItemIcon><ListItemText primary={'QuickSort'} /></ListItemLink>
        <ListItemLink button key={'HeapSort'} href='/heapSort'><ListItemIcon><LooksTwoIcon /></ListItemIcon><ListItemText primary={'HeapSort'} /></ListItemLink>
        <ListItemLink button key={'InsertionSort'} href='/insertionSort'><ListItemIcon><LooksThreeIcon /></ListItemIcon><ListItemText primary={'InsertionSort'} /></ListItemLink>
        <ListItemLink button key={'BubbleSort'} href='/bubbleSort'><ListItemIcon><LooksFourIcon /></ListItemIcon><ListItemText primary={'BubbleSort'} /></ListItemLink>
      </List>
    </div>
  );

  return (
    <div>
      {[''].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton className={classes.menuButton} onClick={toggleDrawer(anchor, true)}>{anchor}<MenuIcon /></IconButton>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}