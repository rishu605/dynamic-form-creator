import { Button, Divider, TextField, List, ListItem, ListItemText, Typography, CircularProgress, ButtonBase, Box } from "@mui/material";
import Grid from "@mui/material/Grid2"; // ✅ Keeping Grid2 as per request
import { useEffect, useState } from "react";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { LoadingButton } from "@mui/lab";
import path from "path"
import fs from "fs"

const JsonSchema = () => {
    const [json, setJson] = useState<any>([])
    const [schemaName, setSchemaName] = useState<string>("")
    const [schemaList, setSchemaList] = useState<string[]>([])
    const [disable, setDisable] = useState<boolean>(false)
    const [allData, setAllData] = useState<any[]>([])
    const [val, setVal] = useState<boolean>(false)
    const [nullCheck, setNullCheck] = useState<boolean>(false)
    const [isSavingSchema, setIsSavingSchema] = useState<boolean>(false)
    const [isDeletingSchema, setIsDeletingSchema] = useState<string[]>([])

    const sendJson = async (name: string) => {
        setIsSavingSchema(true);
        try {
            const savedSchemas = JSON.parse(localStorage.getItem('savedSchemas') || '[]');
            console.log("json: ", json);
            const newSchema = {
                name: schemaName.trim(),
                fields: json
            };

            savedSchemas.push(newSchema);

            localStorage.setItem('savedSchemas', JSON.stringify(savedSchemas));

            setIsSavingSchema(false);
            setVal(prevVal => !prevVal);
        } catch (err) {
            console.log(err);
            setIsSavingSchema(false);
        }
    }

    const getAllData = async () => {
        Promise.resolve()
            .then(async (data: any) => {
                setAllData(data);
                const listOfNames: string[] = data ? data.map((item: any) => item.name) : [];
                setSchemaList(listOfNames);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const deleteSchema = async (e: React.MouseEvent<HTMLButtonElement>, curr: string) => {
        setIsDeletingSchema(prevState => [...prevState, curr]);
        const currSchema = allData.find(item => item.name === curr);
        const id = currSchema?.id;
        try {
            Promise.resolve()
                .then(() => {
                    setIsDeletingSchema(prevState => prevState.filter(item => item !== curr));
                    setVal(prevVal => !prevVal);
                    setSchemaName("");
                    setJson({});
                });
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllData();
    }, [val]);

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

    const handleSchemaClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const schemaData = allData.find(el => el.name === (e.target as HTMLElement).innerText) || { name: "", dataBlob: "" };
        setJson(JSON.parse(schemaData.dataBlob || "{}"));
        setSchemaName(schemaData.name);
    }

    return (
        <div>
            <Typography variant="h2" gutterBottom>
                JSON Schema
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}> {/* ✅ Fix: Use correct Grid2 props */}
                    <Divider>Saved Schemas</Divider>
                    <List>
                        {schemaList.map((item) => (
                            <ListItem key={item}>
                                <ButtonBase component="div" onClick={handleSchemaClick} style={{ flexGrow: 1 }}>
                                    <ListItemText primary={item} />
                                </ButtonBase>
                                <Button onClick={(e) => deleteSchema(e, item)} color="secondary">
                                    {isDeletingSchema.includes(item) ? <><CircularProgress size={20} /> Deleting</> : "Delete"}
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}> {/* ✅ Fix: Use correct Grid2 props */}
                    <Divider>New Schema</Divider>
                    <form noValidate autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Name"
                                    value={schemaName}
                                    onChange={handleSchemaName}
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="Enter Schema Name"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Button variant="contained" color="primary" onClick={() => setJson({})} style={{ marginRight: '8px' }}>
                                    Clear Schema
                                </Button>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => sendJson(schemaName)}
                                    loading={isSavingSchema}
                                    disabled={disable || nullCheck}
                                >
                                    {isSavingSchema ? "Saving" : "Save Schema"}
                                </LoadingButton>
                            </Grid>
                        </Grid>
                        <Box sx={{ textAlign: 'left', marginBottom: 2, marginTop: 2 }}>
                            <Typography variant="h6" className="form-label">Enter Schema</Typography>
                            {nullCheck && (
                                <Typography variant="body2" color="error" sx={{ margin: "10px 0" }}>
                                    * Please enter valid JSON
                                </Typography>
                            )}
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
                    </form>
                </Grid>
            </Grid>
        </div>
    );
}

export default JsonSchema;
