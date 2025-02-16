import React from "react"
import { Field } from "../types/FieldTypes"
import { TextField as MuiTextField, Typography, Box, Paper } from "@mui/material"

interface TextFieldProps {
    fieldDetails: Field
}

const TextField: React.FC<TextFieldProps> = ({ fieldDetails }) => {
    return (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
            <Box mb={2}>
                <Typography variant="h6">{fieldDetails.title}</Typography>
            </Box>
            <MuiTextField
                label={fieldDetails.title}
                required={fieldDetails.required}
                placeholder={fieldDetails.helperText}
                fullWidth
                variant="outlined"
                margin="normal"
            />
            {fieldDetails.helperText && (
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                    {fieldDetails.helperText}
                </Typography>
            )}
        </Paper>
    )
}

export default TextField