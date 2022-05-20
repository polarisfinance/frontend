import React, { useState } from 'react';
import { Alert } from '@material-ui/lab';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    bar: {
        "& .MuiAlert-icon": {
            fontSize: 22
        },
        fontSize: 16,
        padding: 0.1,
        paddingLeft: 10,
        paddingRight: 15,
        backgroundColor: '#b43387'
    }
});

const PhishingWarning = () => {
    const [displayWarning, setDisplayWarning] = useState(true);
    const classes = useStyles();
    
    const handleClose = () => {
        setDisplayWarning(false);
        localStorage.setItem('closedPhishingWarning', '1');
    }

    return (
        <div>
            { displayWarning && !localStorage.getItem('closedPhishingWarning') && 
            <Alert onClose={handleClose} className={classes.bar} variant="filled" severity="warning">
                <b>
                    Always make sure the URL is polarisfinance.io - bookmark it to be safe.
                </b>
            </Alert>
            }
        </div>
    );
}

export default PhishingWarning;
