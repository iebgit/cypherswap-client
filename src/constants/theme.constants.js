const SOUND_TYPE_URL = require("../components/assets/sounds/type.mp3");
const SOUND_CLICK_URL = require("../components/assets/sounds/click.mp3");
const SOUND_ASSEMBLE_URL = require("../components/assets/sounds/assemble.mp3");

const FONT_FAMILY_ROOT = 'serif';

const audioSettings = { common: { volume: 0.15 } };

const playersSettings = {
  assemble: { src: [SOUND_ASSEMBLE_URL], loop: true },
  type: { src: [SOUND_TYPE_URL], loop: true },
  click: { src: [SOUND_CLICK_URL] },
};

const bleepsSettings = {
  assemble: { player: "assemble" },
  type: { player: "type" },
  click: { player: "click" },
};

const alphabetColors = {
  "a": "#C0392B",
  "b": "#E74C3C",
  "c": "#9B59B6", 
  "d": "#8E44AD",
  "e": "#2980B9",
  "f": "#3498DB", 
  "g": "#1ABC9C",
  "h": "#16A085",
  "i": "#27AE60", 
  "j": "#2ECC71",
  "k": "#F1C40F",
  "l": "#F39C12", 
  "m": "#E67E22",
  "n": "#D35400",
  "o": "#ECF0F1", 
  "p": "#CD6155",
  "q": "#EC7063",
  "r": "#AF7AC5", 
  "s": "#5499C7",
  "t": "#5DADE2",
  "u": "#48C9B0", 
  "v": "#52BE80",
  "w": "#58D68D",
  "x": "#F4D03F",
  "y": "#F5B041",
  "z": "#EB984E",
}



const animatorGeneral = {
  duration: { enter: 200, exit: 200, stagger: 30 },
};

const customStyles = {
  dropdownIndicator: (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen && "rotate(180deg)",
    transition: "0.2s ease-in-out",
    color: state.selectProps.isDisabled ? "#e24a0f" : "#ffa76c",
    "&:hover": {
      color: "#7efcf6",
    },
  }),

  input: (provided, state) => ({
    ...provided,
    width: "100%",
    border: "none",

    color: state.selectProps.isDisabled ? "#e24a0f" : "#ffa76c",
    cursor: "text",
  }),

  menu: (provided, state) => ({
    ...provided,
    width: "100%",
    border: "1px solid #ffa76c",
    "&:hover": {
      border: "1px solid #7efcf6",
    },
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
  }),

  singleValue: (provided, state) => ({
    ...provided,
    color: state.selectProps.isDisabled ? "#e24a0f" : "#ffa76c",
  }),

  control: (provided, state) => ({
    ...provided,
    // This line disable the blue border
    height: "40px",
    borderRadius: "0px",
    border: "1px solid #ffa76c",
    border: state.selectProps.isDisabled
      ? "1px solid #e24a0f"
      : "1px solid #ffa76c",
    boxShadow: "none",
    "&:hover": {
      border: "1px solid #7efcf6",
    },
    borderColor: state.isFocused ? "#ffa76c" : "#7efcf6",
    cursor: "pointer",
    backgroundColor: "inherit",
  }),

  option: (provided, state) => ({
    ...provided,

    color: state.isFocused ? "#ffa76c" : "#7efcf6",
    cursor: state.isFocused ? "pointer" : "default",
    backgroundColor: state.isFocused ? "rgba(0, 0, 0, 0.5)" : "inherit",
  }),
};

export {
  audioSettings,
  playersSettings,
  bleepsSettings,
  animatorGeneral,
  customStyles,
  FONT_FAMILY_ROOT,
  alphabetColors,
};
