export type FormMode = "build" | "preview" | "json"

export enum FieldType {
    TEXT = "text",
    NUMBER = "number",
    SELECT = "select"
}

export interface Field {
    type: FieldType
    title: string
    required: boolean
    hidden: boolean
    helperText: string
    options?: string[]
    minValue?: number
    maxValue?: number
}

export interface Schema {
    name: string
    fields: Field[]
}