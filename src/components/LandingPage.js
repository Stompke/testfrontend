import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import { Button } from '@material-ui/core';
import Login from './Login'
import Register from './Register'
import SignOut from './SignOut'

const LandingPage = () => {
    return (
        <Card style={{width: "400px", margin: "20px auto"}}>
            <Link to='/login' component={Login}><Button>Login</Button></Link>
            <Link to='/register' component={Register}><Button>Sign Up</Button></Link>
            <Link to='/signout'  component={SignOut}><Button>Sign Out</Button></Link>
        </Card>
    );
};

export default LandingPage;
