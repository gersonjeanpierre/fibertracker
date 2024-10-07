import { useTimbrado } from "~/context/TimbradoContext";

const DepartmentContent = () => {
  const { filename, data } = useTimbrado();
  console.log("DATA DEPARTMENT CONTENT #####################", data);
  return (
    <>
      <div>DepartmentContent {filename}</div>
    </>
  );
};

export default DepartmentContent;
