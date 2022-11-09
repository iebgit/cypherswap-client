
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),

  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  
  },
  fileInput: {
    width: '95%',
    margin: '10px 0',
  },
  buttons: {
    flexWrap: "nowrap",
    display: "flex",
  },
  button: {
    width: "120px",
    marginLeft: "22px",
    marginRight: "22px",
  },
  fileUploader: {
    cursor: "pointer",

  },
  submit: {
    marginBottom: "10px"
  },
}));
