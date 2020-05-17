import { createMuiTheme } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

export const lightTheme = createMuiTheme({
  palette: {
    primary: { main: red[800], dark: "#8a1c1c", light: "#d15353" },
    secondary: undefined,
    success: undefined,
    error: undefined,
    info: undefined,
    warning: undefined,
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: red,
    secondary: undefined,
    success: undefined,
    error: undefined,
    info: undefined,
    warning: undefined,
  },
});
