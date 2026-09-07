/**
 * @jest-environment jsdom
 */

const { initDarkMode } = require("./darkMode");
const weatherAPI = require("./weatherAPI");
const { getWeatherData } = require("./app");

jest.mock("./weatherAPI");

describe("Task 4", () => {

    // -----------------------------
    // BEFORE EACH TEST
    // -----------------------------

    beforeEach(() => {
        document.body.innerHTML =
            '<div id="app"></div>';
    });


    // -----------------------------
    // AFTER EACH TEST
    // -----------------------------

    afterEach(() => {
        jest.restoreAllMocks();
    });


    // -----------------------------
    // TEST 1
    // localStorage
    // -----------------------------

    test("dark mode reads preference from localStorage", () => {

        const getItemSpy =
            jest.spyOn(Storage.prototype, "getItem");

        getItemSpy.mockReturnValue("true");

        initDarkMode();

        expect(getItemSpy)
            .toHaveBeenCalledWith("darkMode");

        expect(document.body.classList.contains("dark"))
            .toBe(true);
    });


    // -----------------------------
    // TEST 2
    // weather API
    // -----------------------------

    test("weather API is called with correct URL", async () => {

        weatherAPI.getWeather
            .mockResolvedValue({
                temperature: 30
            });

        await getWeatherData("Chennai");

        expect(weatherAPI.getWeather)
            .toHaveBeenCalledWith(
                "https://api.weather.com/current?city=Chennai"
            );
    });

});