import React, { useState, ChangeEvent, useEffect } from "react"
import { Field, FieldType } from "../types/FieldTypes"
import { Container, Typography, Box, Paper, TextField as MuiTextField, Checkbox, FormControlLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, SelectChangeEvent, Button } from "@mui/material"
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { v4 as uuidv4 } from 'uuid'
import { getFromLocalStorage, saveToLocalStorage } from "../api/forms"
import useFetch from "../custom-hooks/useFetch" // Import the custom hook
import { LoadingButton } from "@mui/lab" // Import LoadingButton

interface FormBuilderProps {}

const FormBuilder: React.FC<FormBuilderProps> = () => {
    const [showModal, setShowModal] = useState(false)
    const [fields, setFields] = useState<Field[]>([])
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [newField, setNewField] = useState<Field>({
        id: uuidv4(),
        type: FieldType.TEXT,
        title: "",
        required: false,
        hidden: false,
        helperText: "",
        options: []
    })
    const [formName, setFormName] = useState<string>("")
    const { data: savedSchemas } = useFetch('savedSchemas')
    const [isSaving, setIsSaving] = useState<boolean>(false) // State to manage loading indicator for save operation

    const handleAddFieldClick = () => {
        setShowModal(true)
        setEditIndex(null)
    }

    useEffect(() => {
        console.log("fields: ", fields)
    }, [fields])

    const handleFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement
        setNewField(prevState => ({
            ...prevState,
            [name!]: type === 'checkbox' ? checked : value
        }))
    }

    const handleFieldTypeChange = (e: SelectChangeEvent<FieldType>) => {
        setNewField(prevState => ({
            ...prevState,
            type: e.target.value as FieldType
        }))
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...newField.options || []]
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
                options: [...prevState.options || [], ""]
            }))
        }
    }

    const handleSaveField = () => {
        if (editIndex !== null) {
            setFields(prevState => prevState.map((field, index) => index === editIndex ? newField : field))
        } else {
            setFields(prevState => [...prevState, newField])
        }
        setShowModal(false)
        setNewField({
            id: uuidv4(),
            type: FieldType.TEXT,
            title: "",
            required: false,
            hidden: false,
            helperText: "",
            options: []
        })
        setEditIndex(null)
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id)
                const newIndex = items.findIndex(item => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleSaveForm = async () => {
        setIsSaving(true)
        try {
            const schemas = savedSchemas || []
            const newSchema = {
                name: formName.trim(),
                fields
            }
            schemas.push(newSchema)
            await saveToLocalStorage('savedSchemas', schemas)
            setFormName("")
            setFields([])
        } catch (error) {
            console.error("Error saving form:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const handleDeleteField = (id: string) => {
        console.log("id: ", id)
        setFields(prevState => prevState.filter(field => field.id !== id))
    }

    const handleEditField = (id: string) => {
        const fieldToEdit = fields.find(field => field.id === id)
        if (fieldToEdit) {
            setNewField(fieldToEdit)
            setEditIndex(fields.findIndex(field => field.id === id))
            setShowModal(true)
        }
    }

    const SortableItem = ({ id, field, index, handleDelete, handleEdit }: { id: string, field: Field, index: number, handleDelete: (id: string) => void, handleEdit: (id: string) => void }) => {
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

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Container maxWidth="md" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
                <Typography variant="h4" align="center" gutterBottom>New Form</Typography>
                <Box display="flex" alignItems="center" mb={2}>
                    <MuiTextField
                        label="Form Name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        onClick={handleSaveForm}
                        loading={isSaving}
                        style={{ marginLeft: '16px' }}
                    >
                        Save Form
                    </LoadingButton>
                </Box>
                <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                    {fields.map((field, index) => (
                        <SortableItem key={field.id} id={field.id} field={field} index={index} handleDelete={handleDeleteField} handleEdit={handleEditField} />
                    ))}
                </SortableContext>
                <Button variant="contained" color="primary" onClick={handleAddFieldClick} style={{ marginTop: '16px' }}>Add Field</Button>
                <Dialog open={showModal} onClose={() => setShowModal(false)}>
                    <DialogTitle>{editIndex !== null ? "Edit Field" : "Add New Field"}</DialogTitle>
                    <DialogContent>
                        <MuiTextField
                            label="Title"
                            name="title"
                            value={newField.title}
                            onChange={handleFieldChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                        />
                        <MuiTextField
                            label="Helper Text"
                            name="helperText"
                            value={newField.helperText}
                            onChange={handleFieldChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
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
                            margin="dense"
                        >
                            <MenuItem value={FieldType.TEXT}>Text</MenuItem>
                            <MenuItem value={FieldType.NUMBER}>Number</MenuItem>
                            <MenuItem value={FieldType.SELECT}>Select</MenuItem>
                        </Select>
                        {newField.type === FieldType.NUMBER && (
                            <Box mt={2}>
                                <Typography variant="h6">Number Constraints</Typography>
                                <MuiTextField
                                    label="Minimum Value"
                                    value={newField.minValue || ''}
                                    onChange={(e) => setNewField(prevState => ({ ...prevState, minValue: Number(e.target.value) }))}
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    type="number"
                                />
                                <MuiTextField
                                    label="Maximum Value"
                                    value={newField.maxValue || ''}
                                    onChange={(e) => setNewField(prevState => ({ ...prevState, maxValue: Number(e.target.value) }))}
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    type="number"
                                />
                            </Box>
                        )}
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
                        <Button onClick={handleSaveField} color="primary">{editIndex !== null ? "Save Changes" : "Save Field"}</Button>
                        <Button onClick={() => setShowModal(false)} color="secondary">Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </DndContext>
    )
}

export default FormBuilder