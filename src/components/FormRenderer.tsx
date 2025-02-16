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
                    <Paper key={index} elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
                        <Typography variant="h6" gutterBottom>{field.title}</Typography>
                        <TextField fieldDetails={field} />
                    </Paper>
                )
            case FieldType.NUMBER:
                return (
                    <Paper key={index} elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
                        <Typography variant="h6" gutterBottom>{field.title}</Typography>
                        <NumberField fieldDetails={field} />
                    </Paper>
                )
            case FieldType.SELECT:
                return (
                    <Paper key={index} elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
                        <Typography variant="h6" gutterBottom>{field.title}</Typography>
                        <SelectField fieldDetails={field} />
                    </Paper>
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
            <Typography variant="h4" align="center" gutterBottom>Preview Form</Typography>
            {renderFields}
        </Container>
    )
}

export default FormRenderer