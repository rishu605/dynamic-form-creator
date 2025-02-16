export type FormMode = "build" | "preview"

export enum FieldType {
    TEXT = "text",
    NUMBER = "number",
    SELECT = "select"
}

export interface Field {
    type: FieldType;
    title: string;
    required: boolean;
    hidden: boolean;
    helperText: string;
    options?: string[]
}