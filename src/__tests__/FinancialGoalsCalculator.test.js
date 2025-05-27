import { cleanup, fireEvent, render } from "@testing-library/react"
import { formatCurrency } from "../helpers";


test("Валидация значения валюты", () => {

    expect(formatCurrency(50)).toBe("50,00 ₽")
})