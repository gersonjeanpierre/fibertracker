import { Outlet, useNavigate, useParams } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTimbrado } from "~/context/TimbaContetext";
import { useState, useEffect } from "react";

const Location = () => {
  const { data } = useTimbrado();
  const { fileId, location } = useParams();
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const listDepartment = Array.isArray(data)
    ? data.map((d) => d.department)
    : [];

  const handleSelect = (value: string) => {
    setSelectedDepartment(value);
    navigate(`${value}`);
  };

  useEffect(() => {
    if (fileId) {
      setSelectedDepartment(fileId);
    }
    if (location) {
      setSelectedDepartment(location);
    }
  }, [fileId, location]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Department Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedDepartment} onValueChange={handleSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {listDepartment?.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

export default Location;
