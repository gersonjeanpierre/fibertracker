import { Outlet, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useTimbrado } from "~/context/TimbradoContext";

const DepartmentContent = () => {
  const { data } = useTimbrado();
  const navigate = useNavigate();

  const handleDepartmentClick = (selectedDepartment: string) => {
    navigate(`./${selectedDepartment}`);
  };

  return (
    <>
      {/* Renderizamos los botones de departamentos */}
      <div className="flex gap-2 my-2">
        {data
          ?.map((d) => d.department)
          .map((department: string, index: number) => (
            <Button
              key={index}
              onClick={() => handleDepartmentClick(department)}
            >
              {department}
            </Button>
          ))}
      </div>
      <Outlet />
    </>
  );
};

export default DepartmentContent;
