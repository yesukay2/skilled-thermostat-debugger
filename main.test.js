/**
 * @jest-environment jsdom
 */

// import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

// Load your HTML file
const html = readFileSync(resolve(__dirname, "index.html"), "utf8");
// const { window } = new JSDOM(html, { runScripts: "dangerously" });
global.document = window.document;
global.window = window;

// Import your main code
import {
  Room,
  rooms,
  setSelectedRoom,
  handleIncreaseTemp,
  handleDecreaseTemp,
  toggleAllAircon,
  handleModalSubmit,
  generateRooms,
} from "./main.js";

describe("Thermostat Core Functionality", () => {
  beforeEach(() => {
    // Reset rooms to initial state
    rooms.length = 4;
    rooms.forEach((room) => {
      room.currTemp = 32;
      room.airConditionerOn = false;
    });
  });

  test("Initial room setup", () => {
    expect(rooms.length).toBe(4);
    expect(rooms[0].name).toBe("Living Room");
  });

  test("Temperature controls", () => {
    setSelectedRoom("Living Room");

    // Test increase
    handleIncreaseTemp();
    expect(rooms[0].currTemp).toBe(33);

    // Test decrease
    handleDecreaseTemp();
    expect(rooms[0].currTemp).toBe(32);
  });

  test("AC toggle master control", () => {
    toggleAllAircon();
    expect(rooms.every((room) => room.airConditionerOn)).toBe(true);

    toggleAllAircon();
    expect(rooms.every((room) => room.airConditionerOn)).toBe(false);
  });

  test("Room selection updates UI", () => {
    setSelectedRoom("Kitchen");
    const displayedTemp = document.getElementById("temp").textContent;
    expect(displayedTemp).toContain("29");
  });

  test("Add new room via form", () => {
    const mockEvent = {
      preventDefault: jest.fn(),
      target: {
        "room-name": { value: "Home Office" },
        "default-temp": { value: "22" },
        "room-image": { files: [{}] },
        "start-time": { value: "08:00" },
        "end-time": { value: "18:00" },
        reset: jest.fn(),
      },
    };

    handleModalSubmit(mockEvent);

    expect(rooms.length).toBe(5);
    expect(rooms[4].name).toBe("Home Office");
    expect(document.getElementById("rooms").options.length).toBe(5);
  });

  test("Temperature limits", () => {
    setSelectedRoom("Living Room");

    // Set to max
    rooms[0].currTemp = 32;
    handleIncreaseTemp();
    expect(rooms[0].currTemp).toBe(32); // Shouldn't go over

    // Set to min
    rooms[0].currTemp = 10;
    handleDecreaseTemp();
    expect(rooms[0].currTemp).toBe(10); // Shouldn't go under
  });
});

describe("DOM Interactions", () => {
  test("Initial render", () => {
    expect(document.querySelector(".room-name").textContent).toBe(
      "Living Room"
    );
    expect(document.getElementById("temp").textContent).toContain("32");
  });

  test("Update temperature display", () => {
    rooms[0].currTemp = 25;
    setSelectedRoom("Living Room");
    expect(document.getElementById("temp").textContent).toContain("25");
  });

  test("Toggle AC status display", () => {
    rooms[0].airConditionerOn = true;
    generateRooms();
    const statusElement = document.querySelector(".room-status");
    expect(statusElement.style.display).toBe("");
  });
});
