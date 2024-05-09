import React from 'react';
import { Collapse, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import classes from './errorAllert.module.css';
const ErrorAlert = ({ message, onClose, isOpen }) => (
    <Collapse in={isOpen}>
        {message.split('\n').map((errorMessage, index) => (
            <Alert key={index} severity="error" className={classes.alert} // применяем стили из класса alert
                   
                   action={
                       <CloseIcon
                           aria-label="close"
                           color="inherit"
                           size="small"
                           onClick={onClose}
                       />
                   }
            >
                {errorMessage}
            </Alert>
        ))}
    </Collapse>
);


export default ErrorAlert;
