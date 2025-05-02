// Room objects
const rooms = [
  {
    name: "Living Room",
    currTemp: 32,
    coldPreset: 20,
    warmPreset: 32,
    image: "./assets/living-room.jpg",
    airConditionerOn: false,
    startTime: "16:30",
    endTime: "20:00",

    setCurrTemp(temp) {
      this.currTemp = temp;
    },

    setColdPreset(newCold) {
      this.coldPreset = newCold;
    },

    setWarmPreset(newWarm) {
      this.warmPreset = newWarm;
    },

    decreaseTemp() {
      this.currTemp--;
    },

    increaseTemp() {
      this.currTemp++;
    },
    toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    },
  },
  {
    name: "Kitchen",
    currTemp: 29,
    coldPreset: 20,
    warmPreset: 32,
    image: "./assets/kitchen.jpg",
    airConditionerOn: false,
    startTime: "16:30",
    endTime: "20:00",

    setCurrTemp(temp) {
      this.currTemp = temp;
    },

    setColdPreset(newCold) {
      this.coldPreset = newCold;
    },

    setWarmPreset(newWarm) {
      this.warmPreset = newWarm;
    },

    decreaseTemp() {
      this.currTemp--;
    },

    increaseTemp() {
      this.currTemp++;
    },
    toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    },
  },
  {
    name: "Bathroom",
    currTemp: 30,
    coldPreset: 20,
    warmPreset: 32,
    image: "./assets/bathroom.jpg",
    airConditionerOn: false,
    startTime: "16:30",
    endTime: "20:00",

    setCurrTemp(temp) {
      this.currTemp = temp;
    },

    setColdPreset(newCold) {
      this.coldPreset = newCold;
    },

    setWarmPreset(newWarm) {
      this.warmPreset = newWarm;
    },

    decreaseTemp() {
      this.currTemp--;
    },

    increaseTemp() {
      this.currTemp++;
    },
    toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    },
  },
  {
    name: "Bedroom",
    currTemp: 31,
    coldPreset: 20,
    warmPreset: 32,
    image: "./assets/bedroom.jpg",
    airConditionerOn: false,
    startTime: "16:30",
    endTime: "20:00",

    setCurrTemp(temp) {
      this.currTemp = temp;
    },

    setColdPreset(newCold) {
      this.coldPreset = newCold;
    },

    setWarmPreset(newWarm) {
      this.warmPreset = newWarm;
    },

    decreaseTemp() {
      this.currTemp--;
    },

    increaseTemp() {
      this.currTemp++;
    },
    toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    },
  },
];

class Room {
  constructor(name, currentTemp, roomImage, startTime, endTime) {
    this.name = name;
    this.currTemp = currentTemp;
    this.image = roomImage;
    this.currTemp = currentTemp;
    this.airConditionerOn = false;
    this.coldPreset = null;
    this.warmPreset = null;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  toggleAircon() {
    this.airConditionerOn = !this.airConditionerOn;
  }

  setCurrTemp(newTemp) {
    this.currTemp = newTemp;
  }

  setWarmPreset(newWarm) {
    this.warmPreset = newWarm;
  }

  setColdPreset(newCool) {
    this.coldPreset = newCool;
  }

  setSchedule(startTime, endTime) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  resetSchedule() {
    this.startTime = null;
    this.endTime = null;
  }

  increaseTemp() {
    this.currTemp++;
  }

  decreaseTemp() {
    this.currTemp--;
  }
}

// DOM Elements
const modal = document.querySelector(".modal");
const modalForm = document.querySelector("#modal-form");
const closeBtn = document.querySelector(".close-modal");
const addRoomBtn = document.querySelector("#add-room");
const roomSelect = document.getElementById("rooms");
const currentTemp = document.getElementById("temp");
const coolBtn = document.getElementById("cool");
const warmBtn = document.getElementById("warm");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("reduce");
const newPresetBtn = document.getElementById("newPreset");
const closePresetBtn = document.getElementById("close");
const saveTempBtn = document.getElementById("saveTemp");
const saveTimeBtn = document.querySelector("#saveTime");
const inputsDiv = document.querySelector(".inputs");
const errorSpan = document.querySelector(".error");
const timePresetError = document.querySelector(".timePresetError");
const svgPoint = document.querySelector(".point");
const masterToggler = document.querySelector("#masterToggler");
const roomsControlContainer = document.querySelector(".rooms-control");

// Constants
const coolOverlay = `linear-gradient(to bottom, rgba(141, 158, 247, 0.2), rgba(194, 197, 215, 0.1))`;
const warmOverlay = `linear-gradient(to bottom, rgba(236, 96, 98, 0.2), rgba(248, 210, 211, 0.13))`;

// State
let selectedRoom = rooms[0].name;
let coolPresetTrigger = false;
let warmPresetTrigger = false;

// Utility Functions
const setOverlay = (room) => {
  document.querySelector(".room").style.backgroundImage = `${
    room.currTemp < 25 ? coolOverlay : warmOverlay
  }, url('${room.image}')`;
};

const calculatePointPosition = (currTemp) => {
  const angleOffset = 86;
  const normalizedTemp = (currTemp - 10) / (32 - 10);
  const angle = normalizedTemp * 180 + angleOffset;
  const radians = (angle * Math.PI) / 180;
  const radius = 116;

  return {
    translateX: radius * Math.cos(radians),
    translateY: radius * Math.sin(radians),
  };
};

const setIndicatorPoint = (currTemp) => {
  const position = calculatePointPosition(currTemp);
  svgPoint.style.transform = `translate(${position.translateX}px, ${position.translateY}px)`;
};

const displayTime = (room) => {
  return `
    <div class="time-display">
      <span class="time">${room.startTime}</span>
      <div class="bars">
        ${Array(32).fill('<span class="bar"></span>').join("")}
      </div>
      <span class="time">${room.endTime}</span>
    </div>
  `;
};

// Core Functions
const setSelectedRoom = (selectedRoomParam) => {
  const room = rooms.find((currRoom) => currRoom.name === selectedRoomParam);

  if (coolPresetTrigger) {
    setIndicatorPoint(room.coldPreset);
  } else if (warmPresetTrigger) {
    setIndicatorPoint(room.warmPreset);
  } else {
    setIndicatorPoint(room.currTemp);
  }

  selectedRoom = selectedRoomParam;
  currentTemp.textContent = `${room.currTemp}°`;
  setOverlay(room);
  document.querySelector(".room-name").innerText = selectedRoom;
  document.querySelector(".currentTemp").innerText = `${room.currTemp}°`;
  generateRooms();
};

const generateRooms = () => {
  let roomsHTML = rooms
    .map(
      (room) => `
    <div class="room-control" id="${room.name}">
      <div class="top">
        <h3 class="room-name">${room.name} - ${room.currTemp}°</h3>
        <button class="switch">
          <ion-icon name="power-outline" class="${
            room.airConditionerOn ? "powerOn" : ""
          }"></ion-icon>
        </button>
      </div>
      ${displayTime(room)}
      <span class="room-status" style="display: ${
        room.airConditionerOn ? "" : "none"
      }">
        ${room.currTemp < 25 ? "Cooling room to: " : "Warming room to: "}${
        room.currTemp
      }°
      </span>
    </div>
  `
    )
    .join("");

  roomsControlContainer.innerHTML = roomsHTML;

  const allOn = rooms.every((room) => room.airConditionerOn);
  masterToggler.name = allOn ? "toggle" : "toggle-outline";
};

// Event Handlers
const handleRoomSelectChange = (e) => {
  selectedRoom = e.target.options[e.target.selectedIndex].text;
  setSelectedRoom(selectedRoom);
};

const handleIncreaseTemp = () => {
  const room = rooms.find((currRoom) => currRoom.name === selectedRoom);
  if (room.currTemp < 32) {
    room.increaseTemp();
    updateRoomTemperatureUI(room);
  }
};

const handleDecreaseTemp = () => {
  const room = rooms.find((currRoom) => currRoom.name === selectedRoom);
  if (room.currTemp > 10) {
    room.decreaseTemp();
    updateRoomTemperatureUI(room);
  }
};

const updateRoomTemperatureUI = (room) => {
  setIndicatorPoint(room.currTemp);
  currentTemp.textContent = `${room.currTemp}°`;
  generateRooms();
  setOverlay(room);
  warmBtn.style.backgroundColor = "#d9d9d9";
  coolBtn.style.backgroundColor = "#d9d9d9";
  document.querySelector(".currentTemp").innerText = `${room.currTemp}°`;
};

const handleCoolPreset = () => {
  const room = rooms.find((currRoom) => currRoom.name === selectedRoom);
  const coldPreset = room.coldPreset || room.currTemp;
  room.setCurrTemp(coldPreset);
  setSelectedRoom(room.name);
};

const handleWarmPreset = () => {
  const room = rooms.find((currRoom) => currRoom.name === selectedRoom);
  const warmPreset = room.warmPreset || room.currTemp;
  room.setCurrTemp(warmPreset);
  setSelectedRoom(room.name);
};

const validateTemperatureInputs = (coolInput, warmInput) => {
  if (coolInput.value && (coolInput.value < 10 || coolInput.value > 24)) {
    errorSpan.style.display = "block";
    errorSpan.innerText = "Enter valid cooling temperatures (10° - 24°)";
    return false;
  }

  if (warmInput.value && (warmInput.value < 25 || warmInput.value > 32)) {
    errorSpan.style.display = "block";
    errorSpan.innerText = "Enter valid warming temperatures (25° - 32°)";
    return false;
  }

  if (!coolInput.value && !warmInput.value) {
    errorSpan.style.display = "block";
    errorSpan.innerText = "Temperatures value required!";
    return false;
  }

  errorSpan.style.display = "none";
  return true;
};

const handleSaveTempPreset = () => {
  const coolInput = document.getElementById("coolInput");
  const warmInput = document.getElementById("warmInput");

  if (!validateTemperatureInputs(coolInput, warmInput)) return;

  const currRoom = rooms.find((room) => room.name === selectedRoom);
  if (coolInput.value) currRoom.setColdPreset(coolInput.value);
  if (warmInput.value) currRoom.setWarmPreset(warmInput.value);

  coolInput.value = "";
  warmInput.value = "";
};

const handleSaveTimePreset = () => {
  const startTime = document.getElementById("startTime");
  const endTime = document.getElementById("endTime");
  const currRoom = rooms.find((room) => room.name === selectedRoom);

  if (!startTime.value && !endTime.value) {
    timePresetError.textContent = "Preset time required!";
    timePresetError.style.display = "block";
    return;
  } else if (!startTime.value) {
    timePresetError.textContent = "Start time required!";
    timePresetError.style.display = "block";
    return;
  } else if (!endTime.value) {
    timePresetError.textContent = "End time required!";
    timePresetError.style.display = "block";
    return;
  }

  currRoom.startTime = startTime.value;
  currRoom.endTime = endTime.value;
  timePresetError.style.display = "none";

  startTime.value = "";
  endTime.value = "";

  generateRooms();
};

const autoToggleAircon = () => {
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  rooms.forEach((room) => {
    if (room.startTime == currentTime) {
      !room.airConditionerOn && room.toggleAircon();
      generateRooms();
    } else if (room.endTime == currentTime) {
      room.airConditionerOn && room.toggleAircon();
      generateRooms();
    }
  });
};

const toggleAllAircon = () => {
  rooms.forEach((room) => {
    !room.airConditionerOn && room.toggleAircon();
  });
  generateRooms();
};

const handleRoomControlClick = (e) => {
  if (e.target.classList.contains("switch")) {
    const room = rooms.find(
      (room) => room.name === e.target.parentNode.parentNode.id
    );
    room.toggleAircon();
    generateRooms();
    setSelectedRoom(room.name);
  }
};

const handleModalSubmit = (e) => {
  e.preventDefault();
  const roomName = e.target["room-name"].value;
  const currentTemp = e.target["default-temp"].value;
  const image = e.target["room-image"].files[0];
  const roomImageUrl = URL.createObjectURL(image);

  if (rooms.some((room) => room.name === roomName)) {
    alert("Room name already exists");
    return;
  } else if (!roomName) {
    alert("Room name required");
    return;
  } else if (!currentTemp) {
    alert("Default temperature required");
    return;
  } else if (!image) {
    alert("Room image required");
    return;
  } else if (currentTemp < 10 || currentTemp > 32) {
    alert("Default temperature must be between 10 and 32");
    return;
  }

  const startTime = e.target["start-time"].value || "00:00";
  const endTime = e.target["end-time"].value || "00:00";
  const room = new Room(
    roomName,
    currentTemp,
    roomImageUrl,
    startTime,
    endTime
  );
  rooms.push(room);
  const option = document.createElement("option");
  option.value = room.name;
  option.textContent = room.name;
  roomSelect.appendChild(option);
  roomSelect.value = room.name;
  setSelectedRoom(room.name);
  generateRooms();

  e.target.reset();
  modal.style.display = "none";
};

// Initialize
const init = () => {
  // Set initial state
  setSelectedRoom(rooms[0].name);

  // Populate room select
  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room.name;
    option.textContent = room.name;
    roomSelect.appendChild(option);
  });

  // Set up event listeners
  roomSelect.addEventListener("change", handleRoomSelectChange);
  increaseBtn.addEventListener("click", handleIncreaseTemp);
  decreaseBtn.addEventListener("click", handleDecreaseTemp);
  coolBtn.addEventListener("click", handleCoolPreset);
  warmBtn.addEventListener("click", handleWarmPreset);
  saveTempBtn.addEventListener("click", handleSaveTempPreset);
  saveTimeBtn.addEventListener("click", handleSaveTimePreset);
  roomsControlContainer.addEventListener("click", handleRoomControlClick);
  masterToggler.addEventListener("click", toggleAllAircon);
  modalForm.addEventListener("submit", handleModalSubmit);

  // Modal controls
  addRoomBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  newPresetBtn.addEventListener("click", () => {
    inputsDiv.classList.contains("hidden") &&
      inputsDiv.classList.remove("hidden");
  });

  closePresetBtn.addEventListener("click", () => {
    inputsDiv.classList.add("hidden");
    errorSpan.style.display = "none";
    timePresetError.style.display = "none";
  });

  // Auto toggle interval
  setInterval(autoToggleAircon, 60000);
};

// Start the application
init();
