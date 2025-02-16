import React, { useState } from "react"
import { Field } from "../types/FieldTypes"
import { TextField as MuiTextField, Typography, Box, Paper } from "@mui/material"

interface NumberFieldProps {
    fieldDetails: Field
}

const NumberField: React.FC<NumberFieldProps> = ({ fieldDetails }) => {
    const [value, setValue] = useState<string | number>('')
    const [error, setError] = useState<string>('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const numValue = parseFloat(newValue)

        if (fieldDetails.minValue !== undefined && numValue < fieldDetails.minValue) {
            setError(`Value should be greater than or equal to ${fieldDetails.minValue}`)
        } else if (fieldDetails.maxValue !== undefined && numValue > fieldDetails.maxValue) {
            setError(`Value should be less than or equal to ${fieldDetails.maxValue}`)
        } else {
            setError('')
        }

        setValue(newValue)
    }

    return (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px' }}>
            <Box mb={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{fieldDetails.title}</Typography>
            </Box>
            <MuiTextField
                label={fieldDetails.title}
                type="number"
                required={fieldDetails.required}
                placeholder={fieldDetails.helperText}
                fullWidth
                variant="outlined"
                margin="dense"
                value={value}
                onChange={handleChange}
                error={!!error}
                helperText={error || fieldDetails.helperText}
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' }, '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
            />
            <Box mt={2}>
                <MuiTextField
                    label="Minimum Value"
                    value={fieldDetails.minValue || ''}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    type="number"
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' }, '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                    disabled
                />
                <MuiTextField
                    label="Maximum Value"
                    value={fieldDetails.maxValue || ''}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    type="number"
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' }, '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                    disabled
                />
            </Box>
        </Paper>
    )
}

export default NumberField