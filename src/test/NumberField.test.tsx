import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import NumberField from "../components/NumberField"
import { Field, FieldType } from "../types/FieldTypes"

const fieldDetails: Field = {
    id: "1",
    type: FieldType.NUMBER,
    title: "Age",
    required: true,
    hidden: false,
    helperText: "Enter your age",
    minValue: 18,
    maxValue: 60
}

describe("NumberField Component", () => {
    it("renders NumberField component", () => {
        render(<NumberField fieldDetails={fieldDetails} />)
        expect(screen.getByLabelText("Age")).toBeInTheDocument()
    })

    it("displays helper text", () => {
        render(<NumberField fieldDetails={fieldDetails} />)
        expect(screen.getByText("Enter a number between 18 and 60")).toBeInTheDocument()
    })

    it("shows error when value is less than minValue", () => {
        render(<NumberField fieldDetails={fieldDetails} />)
        const input = screen.getByLabelText("Age")
        fireEvent.change(input, { target: { value: "17" } })
        expect(screen.getByText("Value should be greater than or equal to 18")).toBeInTheDocument()
    })

    it("shows error when value is greater than maxValue", () => {
        render(<NumberField fieldDetails={fieldDetails} />)
        const input = screen.getByLabelText("Age")
        fireEvent.change(input, { target: { value: "61" } })
        expect(screen.getByText("Value should be less than or equal to 60")).toBeInTheDocument()
    })

    it("does not show error when value is within range", () => {
        render(<NumberField fieldDetails={fieldDetails} />)
        const input = screen.getByLabelText("Age")
        fireEvent.change(input, { target: { value: "30" } })
        expect(screen.queryByText("Value should be greater than or equal to 18")).not.toBeInTheDocument()
        expect(screen.queryByText("Value should be less than or equal to 60")).not.toBeInTheDocument()
    })

    it("displays required error when input is empty and required", () => {
        render(<NumberField fieldDetails={fieldDetails} />)
        const input = screen.getByLabelText("Age")
        fireEvent.change(input, { target: { value: "" } })
        fireEvent.blur(input)
        expect(screen.getByText("Value should be greater than or equal to 18")).toBeInTheDocument()
    })
})