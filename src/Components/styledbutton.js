import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    styled_button: {
        borderRadius: "0.5em",
        fontWeight: 'bold',
        height: '50px',
        width: '100px',
        marginRight: '25px',
        marginBottom: '25px',
        backgroundColor: '#2C2C2C',
        color: 'white',
        '&:hover': {
          backgroundColor: '#2C2C2C',
          color: "#1d7cdb"
       },
    },
  }));

export default function StyledButton(props) {
  const classes = useStyles();

  return (
    <Button className={classes.styled_button} onClick={ props.function }>{props.text}</Button>
  );
}
