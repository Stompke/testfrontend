import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ValuesList from './ValuesList';
import CuratedValues from './CuratedValues';
import FinalValues from './FinalValues';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import { DescriptionContext, RightContext } from '../utils/store';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    actionsContainer: {
        marginBottom: theme.spacing(2)
    },
    resetContainer: {
        padding: theme.spacing(3)
    }
}));

function getSteps() {
    return ['Select Values', 'Refine values', 'Think about your values'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return <ValuesList />;
        case 1:
            return <CuratedValues />;
        case 2:
            return <FinalValues />;

        default:
            return 'Unknown step';
    }
}

const ValuesForm = () => {
    const [right] = useContext(RightContext);
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [description, setDescription] = useContext(DescriptionContext)
    const steps = getSteps();

    const assignValues = () => {
        const userId = localStorage.getItem('id');
        right.map(item => {
            axiosWithAuth()
                .post(`/values/user/${userId}`, {
                    value_id: item.id
                })
                .then(res => {
                    console.log('POST response', res);
                })
                .catch(err => {
                    console.log('POST error', err);
                });
        });
    };

    const setTopThree = () => {
        const userId = localStorage.getItem('id');
        right.map(item => {
            console.log('Item', item);
            axiosWithAuth()
                .put(`/values/user/${userId}`, {
                    value_id: item.Value_Id,
                    top_three: true
                })
                .then(res => {
                    console.log('PUT response', res);
                })
                .catch(err => console.log('PUT error', err));
        });
    };

    const sendDescription = () => {
        const userId = localStorage.getItem('id');
        right.map(item => {
            axiosWithAuth()
                .put(`/values/user/${userId}`, {
                    value_id: item.Value_Id,
                    description: item.description
                })
                .then(res => console.log('Description PUT response', res))
                .catch(err => console.log('Description PUT error', err));
        });
    };

    const handleNext = () => {
        if (activeStep === 0) {
            assignValues(right);
        } else if (activeStep === 1) {
            setTopThree(right);
        }
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation='vertical'>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <Typography component='span'>
                                {getStepContent(index)}
                            </Typography>
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.button}>
                                        Back
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={handleNext}
                                        className={classes.button}>
                                        {activeStep === steps.length - 1
                                            ? 'Finish'
                                            : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Typography>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Link to='/dashboard' style={{ textDecoration: 'none' }}>
                        <Button
                            className={classes.button}
                            color='primary'
                            variant='contained'>
                            Dashboard
                        </Button>
                    </Link>
                    <Button onClick={handleReset} className={classes.button}>
                        Reset
                    </Button>
                </Paper>
            )}
        </div>
    );
};

export default ValuesForm;
