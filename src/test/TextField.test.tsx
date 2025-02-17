import React from "react"
import { render, screen } from "@testing-library/react"
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import TextField from "../components/TextField"
import { Field, FieldType } from "../types/FieldTypes"

const fieldDetails: Field = {
    id: "1",
    type: FieldType.TEXT,
    title: "Name",
    required: true,
    hidden: false,
    helperText: "Enter your name"
}

describe("TextField Component", () => {
    it("renders TextField component", () => {
        render(<TextField fieldDetails={fieldDetails} />)
        expect(screen.getByLabelText("Name")).toBeInTheDocument()
    })

    it("displays helper text", () => {
        render(<TextField fieldDetails={fieldDetails} />)
        expect(screen.getByText("Enter your name")).toBeInTheDocument()
    })

    it("displays required label", () => {
        render(<TextField fieldDetails={fieldDetails} />)
        expect(screen.getByLabelText("Name")).toBeRequired()
    })
})