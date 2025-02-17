import { useEffect, useState } from "react"
import FormBuilder from "../components/FormBuilder"
import FormRenderer from "../components/FormRenderer"
import { Field, FormMode } from "../types/FieldTypes"
import { Container, Button, Box } from "@mui/material"
import JsonSchema from "../components/JsonSchema"

const Home = () => {
    const [mode, setMode] = useState<FormMode>("build")
    const [fields, setFields] = useState<Field[]>([])

    useEffect(() => {
        console.log("fields: ", fields)
    }, [fields])

    return (
        <Container maxWidth="md" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
            <Box display="flex" justifyContent="center" mb={4}>
                <Button variant="contained" color="primary" onClick={() => setMode("build")} style={{ marginRight: '8px' }}>
                    Build
                </Button>
                <Button variant="contained" color="secondary" onClick={() => setMode("preview")} style={{ marginRight: '8px' }}>
                    Preview
                </Button>
                <Button variant="contained" color="secondary" onClick={() => setMode("json")}>
                    JSOn
                </Button>
            </Box>

            {mode === "build" && <FormBuilder setFields={setFields} fields={fields} />}
            {mode === "preview" && <FormRenderer fields={fields} />}
            {mode === "json" && <JsonSchema/>}
        </Container>
    )
}

export default Home