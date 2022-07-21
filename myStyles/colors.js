const SUN_FLOWER = '#f1c40f';
const ASBESTOS = '#7f8c8d';
const MIDNIGHT_BLUE = '#2c3e50';
const EMERALD = '#2ecc71';
const ALIZARIN = '#e74c3c';
const CLOUDS = '#ecf0f1';
const SILVER = '#bdc3c7';

// THIS is my original color palete
const DARK_BLUE = "#1F3659";
const OLD_PAGE = "#E8DCB8";
const WHITE = "white";
const BLACK = "black";
const OTHER_BLUE = "#15243b"
const GRAY_BLUE = "#0b1420"
/////////////////
const BLUE_GREEN = "#1E352F";
const GREEN = "#BEEF9E";
const COFFEE = "#d6d6d6"

// Enterprise Color Palete
const ENTERPRISE_BLACK = "black";
const ENTERPRISE_GREEN = "#009570";
const ENTERPRISE_GRAY = "#BDC5CD";
const ENTERPRISE_WHITE = "#FFFF";

const common = {
 PRIMARY: SUN_FLOWER,
 SUCCESS: EMERALD,
 ERROR: ALIZARIN,
};

const light = {
 ...common,
 BACKGROUND: ENTERPRISE_WHITE,
 SECONDARY:ENTERPRISE_BLACK,
 ACCENT: ENTERPRISE_GREEN,
 THIRD : GRAY_BLUE,
 TEXT: WHITE,
 TEXT_SECONDARY: BLACK,
};

const dark = {
 ...common,
 BACKGROUND: MIDNIGHT_BLUE,
 SECONDARY:ENTERPRISE_BLACK,
 TEXT: CLOUDS,
 TEXT_SECONDARY: SILVER,
};

export const colors = {light, dark}