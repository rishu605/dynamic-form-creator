import React from "react"
import { Field } from "../types/FieldTypes"
import { Paper, TextField as MuiTextField, Checkbox, FormControlLabel, Button, Box } from "@mui/material"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface SortableItemProps {
    id: string
    field: Field
    index: number
    handleDelete: (id: string) => void
    handleEdit: (id: string) => void
}

const SortableItem: React.FC<SortableItemProps> = ({ id, field, index, handleDelete, handleEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }
    return (
        <Paper
            ref={setNodeRef}
            style={{ ...style, padding: '16px', marginBottom: '24px', cursor: 'move', position: 'relative' }}
            elevation={3}
            {...attributes}
            {...listeners}
        >
            <MuiTextField label="Title" value={field.title} InputProps={{ readOnly: true }} fullWidth variant="outlined" margin="normal" />
            <FormControlLabel control={<Checkbox checked={field.required} readOnly />} label="Required" />
            <FormControlLabel control={<Checkbox checked={field.hidden} readOnly />} label="Hidden" />
            <MuiTextField label="Helper Text" value={field.helperText} InputProps={{ readOnly: true }} fullWidth variant="outlined" margin="normal" />
            {field.options && field.options.map((option, index) => (
                <MuiTextField key={index} label={`Option ${index + 1}`} value={option} InputProps={{ readOnly: true }} fullWidth variant="outlined" margin="normal" />
            ))}
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained" color="primary" onPointerDown={(e) => {
                    e.stopPropagation()
                    handleEdit(field.id)
                }}>Edit</Button>
                <Button variant="contained" color="secondary" onPointerDown={(e) => {
                    e.stopPropagation()
                    handleDelete(field.id)
                }}>Delete</Button>
            </Box>
        </Paper>
    )
}

export default SortableItem