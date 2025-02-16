import React from "react"
import { Field } from "../types/FieldTypes"
import { TextField as MuiTextField, MenuItem, Typography, Box, Paper } from "@mui/material"

interface SelectFieldProps {
    fieldDetails: Field
}

const SelectField: React.FC<SelectFieldProps> = ({ fieldDetails }) => {
    return (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
            <Box mb={2}>
                <Typography variant="h6">{fieldDetails.title}</Typography>
            </Box>
            <MuiTextField
                select
                label={fieldDetails.title}
                required={fieldDetails.required}
                fullWidth
                variant="outlined"
                margin="normal"
            >
                {fieldDetails.options?.map((option, index) => (
                    <MenuItem key={index} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </MuiTextField>
            {fieldDetails.helperText && (
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                    {fieldDetails.helperText}
                </Typography>
            )}
        </Paper>
    )
}

export default SelectField