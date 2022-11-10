import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

export default makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent",
    borderRadius: 15,

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 50px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  heading: {
    marginTop: "12px",
    textDecoration: "none",
    fontSize: "1.8em",
    fontFamily: "serif",
    fontWeight: 500,
  },
  logout: {
    marginLeft: "4px",
  },
  image: {
    marginTop: "10px",
    marginLeft: "10px",
    maxHeight: "45px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "flex-start",
    minWidth: "200px",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  profile: {
    marginRight: "20px",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  userName: {
    marginLeft: "4px",
    marginRight: "4px",
    alignItems: "center",
    textAlign: "start",
  },
  brandContainer0: {
    display: "flex",
    alignItems: "start",
  },
  brandContainer: {
    display: "flex",
    alignItems: "start",
  },
  purple: {
    color: theme.palette.getContrastText(grey[600]),
    backgroundColor: grey[600],
  },
}));
