import React, { useState, useEffect, useContext } from 'react';
import Value from './Value';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import { RightContext, DescriptionContext } from '../utils/store';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto'
    },
    paper: {
        width: 400,
        height: 'auto',
        overflow: 'auto'
    },
    button: {
        margin: theme.spacing(0.5, 0)
    },
    textField: {
        height: 'auto'
    }
}));

function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1);
}

const FinalValues = () => {
    const classes = useStyles();
    // const [checked, setChecked] = useState([]);
    const [right, setRight] = useContext(RightContext);
    const [description, setDescription] = useContext(DescriptionContext);

    // const leftChecked = intersection(checked, left);
    // const rightChecked = intersection(checked, right);

    // const handleToggle = value => () => {
    //     const currentIndex = checked.indexOf(value);
    //     const newChecked = [...checked];

    //     if (currentIndex === -1) {
    //         newChecked.push(value);
    //     } else {
    //         newChecked.splice(currentIndex, 1);
    //     }

    //     setChecked(newChecked);
    // };

    useEffect(() => {
        const userId = localStorage.getItem('id');
        axiosWithAuth()
            .get(`/values/user/${userId}`)
            .then(res => {
                console.log('Final GET response', res);
                const result = res.data.filter(item => item.Top_Three == true);
                console.log('Result', result);
                setRight(result);
            })
            .catch(err => console.log('Final GET error', err));
    }, []);

    // const handleChange = e => {
    //     const target = e.target
    //     const value = target.value
    //     const name = target.name
    //     setDescription({ [name]: value });
    // };

    const customList = right => (
        <Paper className={classes.paper}>
            <List dense component='span' role='list'>
                {right.map(value => {
                    // const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem key={value.id} role='listitem'>
                            {/* <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon> */}
                            <ListItemText
                                primary={
                                    <>
                                        <Value name={value.Value_name} />
                                        <TextField
                                            name='description'
                                            value={value.description}
                                            classname={classes.textField}
                                            
                                            id='filled-basic'
                                            variant='filled'
                                            multiline
                                        />
                                    </>
                                }
                            />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    return (
        <Grid
            container
            spacing={2}
            justify='center'
            alignItems='center'
            className={classes.root}>
            <Grid item>{customList(right)}</Grid>
            <Grid item>
                <Grid container direction='column' alignItems='center'></Grid>
            </Grid>
        </Grid>
    );
};

export default FinalValues;

// const values = [
//     {
//         title: 'Nothing'
//     },
//     {
//         title: 'More nothing'
//     },
//     {
//         title: 'Even more nothing'
//     }
// ];
