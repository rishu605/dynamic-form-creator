import React, { useEffect, useState } from "react"
import { Field, FieldType, Schema } from "../types/FieldTypes"
import TextField from "./TextField"
import NumberField from "./NumberField"
import SelectField from "./SelectField"
import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from "@mui/material"

const FormRenderer: React.FC = () => {
    const [selectedFields, setSelectedFields] = useState<Field[]>([])
    const [selectedForm, setSelectedForm] = useState<string>("")
    const [savedSchemas, setSavedSchemas] = useState<Schema[]>([])

    useEffect(() => {
        const schemas = JSON.parse(localStorage.getItem('savedSchemas') || '[]')
        setSavedSchemas(schemas)
        console.log("schemas: ", schemas)
    }, [])

    const handleFormClick = (formName: string) => {
        const form = savedSchemas.find((f: { name: string }) => f.name === formName)
        console.log("form: ", form)
        if (form) {
            setSelectedFields(form.fields)
            setSelectedForm(formName)
        }
    }

    const renderFields = () => selectedFields.map((field, index) => {
        console.log("field: ", field)
        if (field.hidden) return null

        switch (field.type) {
            case "text":
                return (
                    <Box key={index} mb={2}>
                        <TextField fieldDetails={field} />
                    </Box>
                )
            case "number":
                return (
                    <Box key={index} mb={2}>
                        <NumberField fieldDetails={field} />
                    </Box>
                )
            case "select":
                return (
                    <Box key={index} mb={2}>
                        <SelectField fieldDetails={field} />
                    </Box>
                )
            default:
                return null
        }
    })

    useEffect(() => {
        console.log("selectedFields: ", selectedFields)
        console.log("renderFields: ", renderFields())
    }, [selectedFields])

    return (
        <Container maxWidth="md" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
            <Paper elevation={3} style={{ padding: '32px', marginBottom: '32px' }}>
                <Typography variant="h4" align="center" gutterBottom>Saved Forms</Typography>
                <List>
                    {savedSchemas.map((form: { name: string }) => (
                        <ListItem component="button" key={form.name} onClick={() => handleFormClick(form.name)}>
                            <ListItemText primary={form.name} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            {selectedForm && (
                <Paper elevation={3} style={{ padding: '32px' }}>
                    <Typography variant="h4" align="center" gutterBottom>{selectedForm}</Typography>
                    {renderFields()}
                </Paper>
            )}
        </Container>
    )
}

export default FormRenderer