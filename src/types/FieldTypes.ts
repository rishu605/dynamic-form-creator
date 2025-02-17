export type FormMode = "build" | "preview" | "json"

export enum FieldType {
    TEXT = "text",
    NUMBER = "number",
    SELECT = "select"
}

export interface Field {
    id: string
    type: FieldType
    title: string
    required: boolean
    hidden: boolean
    helperText: string
    options?: string[] | undefined
    minValue?: number
    maxValue?: number
}

export interface Schema {
    name: string
    fields: Field[]
}