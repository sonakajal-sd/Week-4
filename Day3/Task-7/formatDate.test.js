const formatDate = require("./formatDate");

test("formats date as DD/MM/YYYY", () => {
    const date = new Date("2024-06-15");
    expect(formatDate(date, "DD/MM/YYYY")).toBe("15/06/2024");
});

test("formats date as YYYY-MM-DD", () => {
    const date = new Date("2024-06-15");
    expect(formatDate(date, "YYYY-MM-DD")).toBe("2024-06-15");
});

test("formats date as Month DD, YYYY", () => {
    const date = new Date("2024-06-15");
    expect(formatDate(date, "Month DD, YYYY")).toBe("June 15, 2024");
});

test("formats date as relative", () => {
    const date = new Date("2024-06-12");
    const now = new Date("2024-06-15");
    expect(formatDate(date, "relative", now)).toBe("3 days ago");
});

test("handles leap year February 29", () => {
    const date = new Date("2024-02-29");
    expect(formatDate(date, "DD/MM/YYYY")).toBe("29/02/2024");
});

test("handles December 31", () => {
    const date = new Date("2024-12-31");
    expect(formatDate(date, "YYYY-MM-DD")).toBe("2024-12-31");
});

test("formats January 1 correctly", () => {
    const date = new Date("2024-01-01");
    expect(formatDate(date, "Month DD, YYYY")).toBe("January 01, 2024");
});

test("throws error for invalid input", () => {
    expect(() => {
        formatDate("not a date", "DD/MM/YYYY");
    }).toThrow();
});