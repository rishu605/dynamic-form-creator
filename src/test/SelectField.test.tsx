import React from "react"
import { render, screen } from "@testing-library/react"
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import SelectField from "../components/SelectField"
import { Field, FieldType } from "../types/FieldTypes"

const fieldDetails: Field = {
    id: "1",
    type: FieldType.SELECT,
    title: "Favorite Fruit",
    required: true,
    hidden: false,
    helperText: "Select your favorite fruit",
    options: ["Apple", "Banana", "Cherry"]
}

describe("SelectField Component", () => {
    it("renders SelectField component", () => {
        render(<SelectField fieldDetails={fieldDetails} />)
        expect(screen.getByLabelText("Favorite Fruit")).toBeInTheDocument()
    })

    it("displays helper text", () => {
        render(<SelectField fieldDetails={fieldDetails} />)
        expect(screen.getByText("Select your favorite fruit")).toBeInTheDocument()
    })

    it("renders all options", () => {
        render(<SelectField fieldDetails={fieldDetails} />)
        fieldDetails.options?.forEach(option => {
            expect(screen.getByText(option)).toBeInTheDocument()
        })
    })

    it("displays required label", () => {
        render(<SelectField fieldDetails={fieldDetails} />)
        expect(screen.getByLabelText("Favorite Fruit")).toBeRequired()
    })
})