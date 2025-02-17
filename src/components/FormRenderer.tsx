import React, { useState } from "react"
import { Field, FieldType, Schema } from "../types/FieldTypes"
import TextField from "./TextField"
import NumberField from "./NumberField"
import SelectField from "./SelectField"
import { Container, Typography, Box, Paper, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import useFetch from "../custom-hooks/useFetch" // Import the custom hook

const FormRenderer: React.FC = () => {
    const [selectedFields, setSelectedFields] = useState<Field[]>([])
    const [selectedForm, setSelectedForm] = useState<string>("")
    const { data: savedSchemas, isLoading } = useFetch('savedSchemas')

    const handleFormChange = (event: SelectChangeEvent<string>) => {
        const formName = event.target.value as string
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

    return (
        <Container maxWidth="md" sx={{ paddingTop: '32px', paddingBottom: '32px', width: '80vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ padding: '32px', marginBottom: '32px', width: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>Saved Forms</Typography>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                        <LoadingButton loading variant="outlined">
                            Loading
                        </LoadingButton>
                    </Box>
                ) : (
                    <FormControl fullWidth variant="outlined" sx={{ marginBottom: '16px' }}>
                        <InputLabel id="form-select-label">Select Form</InputLabel>
                        <Select
                            labelId="form-select-label"
                            value={selectedForm}
                            onChange={handleFormChange}
                            label="Select Form"
                        >
                            {savedSchemas.map((form: { name: string }) => (
                                <MenuItem key={form.name} value={form.name}>
                                    {form.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Paper>
            {selectedForm && (
                <Paper elevation={3} sx={{ padding: '32px', width: '100%' }}>
                    <Typography variant="h4" align="center" gutterBottom>{selectedForm}</Typography>
                    {renderFields()}
                </Paper>
            )}
        </Container>
    )
}

export default FormRenderer