import React, { useState, ChangeEvent, useEffect } from "react"
import { Field, FieldType } from "../types/FieldTypes"
import { Container, Typography, Box, Button, TextField as MuiTextField, SelectChangeEvent, Snackbar, Alert } from "@mui/material"
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { v4 as uuidv4 } from 'uuid'
import { saveToLocalStorage } from "../api/forms"
import useFetch from "../custom-hooks/useFetch" // Import the custom hook
import { LoadingButton } from "@mui/lab" // Import LoadingButton
import FieldDialog from "./FieldDialog"
import SortableItem from "./SortableItem"

const FormBuilder: React.FC = () => {
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
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false) // State to manage Snackbar visibility

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
            setOpenSnackbar(true) // Show Snackbar on successful save
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

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
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
                        size="small"
                        style={{ marginLeft: '16px', marginTop: "6px" }}
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
                <FieldDialog
                    open={showModal}
                    field={newField}
                    editIndex={editIndex}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveField}
                    onFieldChange={handleFieldChange}
                    onFieldTypeChange={handleFieldTypeChange}
                    onOptionChange={handleOptionChange}
                    onAddOption={handleAddOption}
                />
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Saved Form
                    </Alert>
                </Snackbar>
            </Container>
        </DndContext>
    )
}

export default FormBuilder