import { useEffect, useState } from "react"
import FormBuilder from "../components/FormBuilder"
import FormRenderer from "../components/FormRenderer"
import { Field, FormMode } from "../types/FieldTypes"
import { Container, Button, Box } from "@mui/material"
import JsonSchema from "../components/JsonSchema"

const Home = () => {
    const [mode, setMode] = useState<FormMode>("build")

    return (
        <Container maxWidth="md" style={{ paddingTop: '32px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box display="flex" justifyContent="center" mb={4} width="100%">
                <Button variant="contained" color="secondary" onClick={() => setMode("build")} style={{ marginRight: '8px' }}>
                    Build
                </Button>
                <Button variant="contained" color="secondary" onClick={() => setMode("preview")} style={{ marginRight: '8px' }}>
                    Preview
                </Button>
                <Button variant="contained" color="secondary" onClick={() => setMode("json")}>
                    JSON
                </Button>
            </Box>

            <Box width="100%">
                {mode === "build" && <FormBuilder />}
                {mode === "preview" && <FormRenderer />}
                {mode === "json" && <JsonSchema />}
            </Box>
        </Container>
    )
}

export default Home