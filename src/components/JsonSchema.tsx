import { Button, TextField, Typography, Box, Paper } from "@mui/material";
// import Grid2 from "@mui/material/Unstable_Grid2"; // ✅ Keeping Grid2 as per request
import { useEffect, useState } from "react";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { LoadingButton } from "@mui/lab";
import { saveToLocalStorage } from "../api/forms";
import useFetch from "../custom-hooks/useFetch"; // Import the custom hook

const JsonSchema = () => {
    const [json, setJson] = useState<any>([])
    const [schemaName, setSchemaName] = useState<string>("")
    const [disable, setDisable] = useState<boolean>(false)
    const [nullCheck, setNullCheck] = useState<boolean>(false)
    const [isSavingSchema, setIsSavingSchema] = useState<boolean>(false)
    const { data: savedSchemas, isLoading } = useFetch('savedSchemas')

    const sendJson = async () => {
        setIsSavingSchema(true);
        try {
            const schemas = savedSchemas || [];
            console.log("json: ", json);
            const newSchema = {
                name: schemaName.trim(),
                fields: json
            };

            schemas.push(newSchema);

            await saveToLocalStorage('savedSchemas', schemas);

            setIsSavingSchema(false);
        } catch (err) {
            console.log(err);
            setIsSavingSchema(false);
        }
    }

    useEffect(() => {
        setDisable(schemaName === "" || !json);
    }, [schemaName, json]);

    const handleSchemaName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSchemaName(e.target.value);
    }

    const handleSchema = (data: any) => {
        if (data.error) {
            return setDisable(true);
        } else {
            setDisable(false);
        }
        setNullCheck(data.json === "");
        setJson(data.jsObject);
    }

    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
                JSON Schema
            </Typography>
            <Box sx={{ width: '100%', maxWidth: '800px' }}>
                <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                    <Typography variant="h6" gutterBottom>New Schema</Typography>
                    <form noValidate autoComplete="off">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <TextField
                                label="Name"
                                value={schemaName}
                                onChange={handleSchemaName}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                placeholder="Enter Schema Name"
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                <Button variant="contained" size="small" color="primary" onClick={() => setJson({})} sx={{ marginRight: 2 }}>
                                    Clear Schema
                                </Button>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    onClick={sendJson}
                                    loading={isSavingSchema}
                                    disabled={disable || nullCheck}
                                    size="small"
                                >
                                    {isSavingSchema ? "Saving" : "Save Schema"}
                                </LoadingButton>
                            </Box>
                            <Box sx={{ textAlign: 'left', marginBottom: 2, marginTop: 2, width: '100%' }}>
                                <Typography variant="h6" className="form-label">Enter Schema</Typography>
                                {nullCheck && (
                                    <Typography variant="body2" color="error" sx={{ margin: "10px 0" }}>
                                        * Please enter valid JSON
                                    </Typography>
                                )}
                                <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', '@media (max-width: 600px)': { width: '100%' } }}>
                                    <JSONInput
                                        id='a_unique_id'
                                        placeholder={json}
                                        waitAfterKeyPress={2000}
                                        confirmGood={true}
                                        locale={locale}
                                        theme="light_mitsuketa_tribute"
                                        colors={{ default: "black" }}
                                        style={{
                                            contentBox: {
                                                color: "grey"
                                            }
                                        }}
                                        width="100%"
                                        height='500px'
                                        onChange={handleSchema}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Box>
    )
}

export default JsonSchema