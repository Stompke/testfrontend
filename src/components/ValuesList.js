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
import Paper from '@material-ui/core/Paper';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import { RightContext } from '../utils/store';

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
    }
}));

function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1);
}


const ValuesList = () => {
    useEffect(() => {
        axiosWithAuth()
            .get('/values')
            .then(res => {
                console.log('GET response', res);
                setLeft(res.data);
            })
            .catch(err => `GET error: ${err}`);
    }, []);

    const classes = useStyles();
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useContext(RightContext);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    // const handleAllRight = () => {
    //     setRight(right.concat(left));
    //     setLeft([]);
    // };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        // assignValues(checked);
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };
    console.log('Checked', checked);
    // const handleAllLeft = () => {
    //     setLeft(left.concat(right));
    //     setRight([]);
    // };

    // const assignValues = checked => {
    //     const userId = localStorage.getItem('id');
    //     checked.map(item => {
    //         axiosWithAuth()
    //         .post(`/values/user/${userId}`, {
    //             value_id: item.id
    //         })
    //         .then(res => {
    //             console.log(res);
    //         })
    //         .catch(err => {
    //             console.log('POST error', err);
    //         });
    //     })
    // };
    

    const customList = left => (
        <Paper className={classes.paper}>
            <List dense component='span' role='list'>
                {left.map(value => {
                    const labelId = `transfer-list-item-${value}-label`;
                    return (
                        <ListItem
                            key={value.id}
                            role='listitem'
                            button
                            onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                id={labelId}
                                primary={
                                    <Value
                                        name={value.name}
                                        description={value.description}
                                    />
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
            <Grid item>{customList(left)}</Grid>
            <Grid item>
                <Grid container direction='column' alignItems='center'>
                    {/* <Button
                        variant='outlined'
                        size='small'
                        className={classes.button}
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label='move all right'>
                        ≫
                    </Button> */}
                    <Button
                        variant='outlined'
                        size='small'
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label='move selected right'>
                        &gt;
                    </Button>
                    <Button
                        variant='outlined'
                        size='small'
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label='move selected left'>
                        &lt;
                    </Button>
                    {/* <Button
                        variant='outlined'
                        size='small'
                        className={classes.button}
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label='move all left'>
                        ≪
                    </Button> */}
                </Grid>
            </Grid>
            <Grid item>{customList(right)}</Grid>
        </Grid>
    );
};

export default ValuesList;

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
