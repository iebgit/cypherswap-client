import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent",
    borderRadius: 15,
    marginLeft: '30px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 50px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  heading: {
    marginTop: '12px',
    textDecoration: 'none',
    fontSize: '1.8em',
    fontFamily: "serif",
    fontWeight: 500,
  },
  logout: {
    marginLeft: "4px"
  },
  image: {
    marginTop: '10px',
    marginLeft: '10px',
    maxHeight: '45px',
  
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '200px',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  profile: {
    display: 'flex',
    width: '400px',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  userName: {
    marginLeft: "4px",
    marginRight: "4px",
    alignItems: 'center',
    textAlign: 'start',
  },
  brandContainer0: {
    display: 'flex',
    alignItems: 'start',
    marginLeft: '100px',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'start',
  },
  purple: {
    marginRight: "32px",
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));