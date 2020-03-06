import React from 'react'
import { Button } from '@material-ui/core'

const SignOut = props => {
    const logout = () => {
        localStorage.clear('token')
    }

    return <React.Fragment><Button onClick={logout()}>Sign Out</Button></React.Fragment>
}

export default SignOut
