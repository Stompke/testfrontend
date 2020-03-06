import React, { useState, useEffect } from 'react';
import { axiosWithAuth } from '../utils/axiosWithAuth';

import { ClipLoader } from "react-spinners";


// M-UI CARD
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Fab from '@material-ui/core/Fab';

// select modal
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 400
  },
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    padding: 20
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  valueRemoveContainer: {
      display: 'flex',
      justifyContent: 'flex-end'
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
});

const TopThree = () => {
    const classes = useStyles();

    const [ topThreeValues, setTopThreeValues ] = useState([]);
    const [ loading, setLoading ] = useState(false)
    const [ listOfValues, setListOfValues ] = useState([])
    const [open, setOpen] = React.useState(false);
    const [newValue, setNewValue] = useState({});

    const handleChange = event => {
        setNewValue({value_id: event.target.value, top_three: true});
        console.log('new value set', newValue)
      };
    
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    if(topThreeValues.length < 3) {
        setTopThreeValues(
           [ ...topThreeValues,
                {addValue: true}
            ]

        )
    }

    useEffect(() => {
        axiosWithAuth()
        .get('https://buildweek-essentialism.herokuapp.com/api/values/')
        .then(res => {
            console.log('all values', res)
            setListOfValues(res.data)
        })
        .catch(err => {
            console.log(err)
        })
        // setListOfValues()
    },[])

    useEffect(() => {
        setLoading(true)
        axiosWithAuth()
        .get(`https://buildweek-essentialism.herokuapp.com/api/values/user/2`)
        .then(res => {
            console.log('your top three values', res.data.filter(item => item.Top_Three === true))
            setTopThreeValues(res.data.filter(item => item.Top_Three === true))
            console.log('all your values', res.data)
            setLoading(false)

        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        })
    },[])

    const changeTopThree = (valueId) => {
        console.log(valueId)
        let send = {
            value_id: valueId,
            top_three: false
        }
        setLoading(true)
        axiosWithAuth()
        .delete(`https://buildweek-essentialism.herokuapp.com/api/values/delete/${valueId}`)
        .then(res => {
            console.log(res)
            axiosWithAuth()

            .get(`https://buildweek-essentialism.herokuapp.com/api/values/user/2`)
            .then(res => {
                console.log(res.data.filter(item => item.Top_Three === true))
                setTopThreeValues(res.data.filter(item => item.Top_Three === true))
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
        })
        .catch( err => {
            console.log(err)
            setLoading(false)
        })
    }

    const addValueToUser = () => {
        setLoading(true)

        axiosWithAuth()
        .post('https://buildweek-essentialism.herokuapp.com/api/values/user/1', newValue)
        .then(res => {
            console.log(res)
            setOpen(false);
            axiosWithAuth()

            .get(`https://buildweek-essentialism.herokuapp.com/api/values/user/2`)
            .then(res => {
                console.log(res.data.filter(item => item.Top_Three === true))
                setTopThreeValues(res.data.filter(item => item.Top_Three === true))
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
            
        })
        .catch(err => {
            console.log(err)
            setLoading(false)

        })
    }



    return (
        <div>
            <h1>Your Top 3 Values</h1>
            {!loading ? 
            <div className={classes.container}>
                {topThreeValues.map(item => 
                    <Card key={item.Value_Id} className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        
                        </Typography>
                        <Typography variant="h5" component="h2">
                        {item.Value_name}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                        
                        </Typography>
                        <Typography variant="body2" component="p">
                        {item.Value_description}
                        </Typography>
                    </CardContent>
                    {!item.addValue ?
                    <CardActions className={classes.valueRemoveContainer}>
                        
                        <Fab onClick={() => changeTopThree(item.Value_Id)} color="secondary" aria-label="add">
                            <HighlightOffIcon   />
                        </Fab>
                    </CardActions>
                    :
                    // <ul>
                    //     {listOfValues.map(item => <li>{item.name}</li>)}
                    // </ul>
                    <div>
      <Button onClick={handleClickOpen}>Select New Value</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Choose Value</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">New Value</InputLabel>
              <Select
                native
                value={newValue.value_id}
                onChange={handleChange}
                input={<Input id="demo-dialog-native" />}
              >

                <option value="" />
                {listOfValues.map(item => <option value={item.id}>{item.name}</option>)}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addValueToUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
                    }
                    </Card>

                    // :
                    //     <p>some other stuff</p>

                    )}
                
            </div>
            :
            <ClipLoader
        //   css={override}
          size={150}
          //size={"150px"} this also works
          color={"#123abc"}
          loading={loading}
        />
}
        </div>

    )
}

export default TopThree;