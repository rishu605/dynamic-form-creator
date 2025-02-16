import React, { useEffect } from "react"
import { Field, FieldType } from "../types/FieldTypes"
import TextField from "./TextField"
import NumberField from "./NumberField"
import SelectField from "./SelectField"
import { Container, Typography, Box, Paper } from "@mui/material"

interface FormRendererProps {
    fields: Field[]
}

const FormRenderer: React.FC<FormRendererProps> = ({ fields }) => {

    const renderFields = fields.map((field, index) => {
        if (field.hidden) return null

        switch (field.type) {
            case FieldType.TEXT:
                return (
                    <Box key={index} mb={2}>
                        <TextField fieldDetails={field} />
                    </Box>
                )
            case FieldType.NUMBER:
                return (
                    <Box key={index} mb={2}>
                        <NumberField fieldDetails={field} />
                    </Box>
                )
            case FieldType.SELECT:
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
        console.log("fields: ", fields)
    }, [fields])

    return (
        <Container maxWidth="md" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
            <Paper elevation={3} style={{ padding: '32px' }}>
                <Typography variant="h4" align="center" gutterBottom>Preview Form</Typography>
                {renderFields}
            </Paper>
        </Container>
    )
}

export default FormRenderer