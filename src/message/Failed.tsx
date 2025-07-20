import { Alert } from "@mui/material";
interface Props {
  errorMessage: string;
}
const Failed = ({ errorMessage }: Props) => {
  return (
    <Alert variant="filled" severity="error">
      {errorMessage}
    </Alert>
  );
};

export default Failed;
