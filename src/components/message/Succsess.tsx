import { Alert } from "@mui/material";
interface Props {
  seccsessfulMessage: string;
}
const Succsess = ({ seccsessfulMessage }: Props) => {
  return (
    <Alert variant="filled" severity="success">
      {seccsessfulMessage}
    </Alert>
  );
};

export default Succsess;
