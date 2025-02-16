import React, { useState, ChangeEvent } from "react"
import { Field, FieldType } from "../types/FieldTypes"
import { Container, Typography, Box, Paper, Button, TextField as MuiTextField, Checkbox, FormControlLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface FormBuilderProps {
    setFields: React.Dispatch<React.SetStateAction<Field[]>>
    fields: Field[]
}

const FormBuilder: React.FC<FormBuilderProps> = ({ setFields, fields }) => {
    const [showModal, setShowModal] = useState(false)
    const [newField, setNewField] = useState<Field>({
        type: FieldType.TEXT,
        title: "",
        required: false,
        hidden: false,
        helperText: "",
        options: []
    })

    const handleAddFieldClick = () => {
        setShowModal(true)
    }

    const handleFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement
        setNewField(prevState => ({
            ...prevState,
            [name!]: type === 'checkbox' ? checked : value
        }))
    }

    const handleFieldTypeChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
        setNewField(prevState => ({
            ...prevState,
            type: e.target.value as FieldType
        }))
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...newField.options]
        newOptions[index] = value
        setNewField(prevState => ({
            ...prevState,
            options: newOptions
        }))
    }

    const handleAddOption = () => {
        if (newField.options && newField.options.length < 5) {
            setNewField(prevState => ({
                ...prevState,
                options: [...prevState.options, ""]
            }))
        }
    }

    const handleSaveField = () => {
        setFields(prevState => [...prevState, newField])
        setShowModal(false)
        setNewField({
            type: FieldType.TEXT,
            title: "",
            required: false,
            hidden: false,
            helperText: "",
            options: []
        })
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex(item => item.title === active.id)
                const newIndex = items.findIndex(item => item.title === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const SortableItem = ({ id, field }: { id: string, field: Field }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
        const style = {
            transform: CSS.Transform.toString(transform),
            transition
        }
        return (
            <Paper
                ref={setNodeRef}
                style={{ ...style, padding: '16px', marginBottom: '24px', cursor: 'move' }}
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
            </Paper>
        )
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Container maxWidth="md" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
                <Typography variant="h4" align="center" gutterBottom>New Form</Typography>
                <SortableContext items={fields.map((field, index) => `${field.title}-${index}`)} strategy={verticalListSortingStrategy}>
                    {fields.map((field, index) => (
                        <SortableItem key={`${field.title}-${index}`} id={`${field.title}-${index}`} field={field} />
                    ))}
                </SortableContext>
                <Button variant="contained" color="primary" onClick={handleAddFieldClick} style={{ marginTop: '16px' }}>Add Field</Button>
                <Dialog open={showModal} onClose={() => setShowModal(false)}>
                    <DialogTitle>Add New Field</DialogTitle>
                    <DialogContent>
                        <MuiTextField
                            label="Title"
                            name="title"
                            value={newField.title}
                            onChange={handleFieldChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
                        <MuiTextField
                            label="Helper Text"
                            name="helperText"
                            value={newField.helperText}
                            onChange={handleFieldChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
                        <FormControlLabel
                            control={<Checkbox name="required" checked={newField.required} onChange={handleFieldChange} />}
                            label="Required"
                        />
                        <FormControlLabel
                            control={<Checkbox name="hidden" checked={newField.hidden} onChange={handleFieldChange} />}
                            label="Hidden"
                        />
                        <Select
                            name="type"
                            value={newField.type}
                            onChange={handleFieldTypeChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        >
                            <MenuItem value={FieldType.TEXT}>Text</MenuItem>
                            <MenuItem value={FieldType.NUMBER}>Number</MenuItem>
                            <MenuItem value={FieldType.SELECT}>Select</MenuItem>
                        </Select>
                        {newField.type === FieldType.SELECT && (
                            <Box mt={2}>
                                <Typography variant="h6">Options</Typography>
                                {newField.options?.map((option, index) => (
                                    <MuiTextField
                                        key={index}
                                        label={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                    />
                                ))}
                                {newField.options && newField.options.length < 5 && (
                                    <Button variant="contained" color="secondary" onClick={handleAddOption} style={{ marginTop: '8px' }}>Add Option</Button>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSaveField} color="primary">Save Field</Button>
                        <Button onClick={() => setShowModal(false)} color="secondary">Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </DndContext>
    )
}

export default FormBuilder