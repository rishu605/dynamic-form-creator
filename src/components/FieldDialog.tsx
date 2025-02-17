import React, { ChangeEvent } from "react"
import { Field, FieldType } from "../types/FieldTypes"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField as MuiTextField, Checkbox, FormControlLabel, Select, MenuItem, Button, Box, Typography, SelectChangeEvent } from "@mui/material"

interface FieldDialogProps {
    open: boolean
    field: Field
    editIndex: number | null
    onClose: () => void
    onSave: () => void
    onFieldChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => void
    onFieldTypeChange: (e: SelectChangeEvent<FieldType>) => void
    onOptionChange: (index: number, value: string) => void
    onAddOption: () => void
}

const FieldDialog: React.FC<FieldDialogProps> = ({ open, field, editIndex, onClose, onSave, onFieldChange, onFieldTypeChange, onOptionChange, onAddOption }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{editIndex !== null ? "Edit Field" : "Add New Field"}</DialogTitle>
            <DialogContent>
                <MuiTextField
                    label="Title"
                    name="title"
                    value={field.title}
                    onChange={onFieldChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                />
                <MuiTextField
                    label="Helper Text"
                    name="helperText"
                    value={field.helperText}
                    onChange={onFieldChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                />
                <FormControlLabel
                    control={<Checkbox name="required" checked={field.required} onChange={onFieldChange} />}
                    label="Required"
                />
                <FormControlLabel
                    control={<Checkbox name="hidden" checked={field.hidden} onChange={onFieldChange} />}
                    label="Hidden"
                />
                <Select
                    name="type"
                    value={field.type}
                    onChange={onFieldTypeChange}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                >
                    <MenuItem value={FieldType.TEXT}>Text</MenuItem>
                    <MenuItem value={FieldType.NUMBER}>Number</MenuItem>
                    <MenuItem value={FieldType.SELECT}>Select</MenuItem>
                </Select>
                {field.type === FieldType.NUMBER && (
                    <Box mt={2}>
                        <Typography variant="h6">Number Constraints</Typography>
                        <MuiTextField
                            label="Minimum Value"
                            value={field.minValue || ''}
                            onChange={(e) => onFieldChange({ target: { name: 'minValue', value: Number(e.target.value) } })}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            type="number"
                        />
                        <MuiTextField
                            label="Maximum Value"
                            value={field.maxValue || ''}
                            onChange={(e) => onFieldChange({ target: { name: 'maxValue', value: Number(e.target.value) } })}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            type="number"
                        />
                    </Box>
                )}
                {field.type === FieldType.SELECT && (
                    <Box mt={2}>
                        <Typography variant="h6">Options</Typography>
                        {field.options?.map((option, index) => (
                            <MuiTextField
                                key={index}
                                label={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => onOptionChange(index, e.target.value)}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                            />
                        ))}
                        {field.options && field.options.length < 5 && (
                            <Button variant="contained" color="secondary" onClick={onAddOption} style={{ marginTop: '8px' }}>Add Option</Button>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onSave} color="primary">{editIndex !== null ? "Save Changes" : "Save Field"}</Button>
                <Button onClick={onClose} color="secondary">Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default FieldDialog