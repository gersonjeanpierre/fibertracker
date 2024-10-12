import { useState, useRef, useEffect } from "react";
import {
  FileIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  BoxIcon,
  MenuIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Outlet, useNavigate, useParams } from "@remix-run/react";

const transformData = (data: ArrayBuffer) => {
  // Mock implementation
  console.log("Transforming data:", data);
  return [];
};

const saveDataByKey = async (key: string, data: any) => {
  // Mock implementation
  console.log("Saving data:", key, data);
};

const getAllKeys = async () => {
  // Mock implementation
  return ["File 1", "File 2", "File 3"];
};

export default function Component() {
  const navigate = useNavigate();
  const params = useParams();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedCTO, setSelectedCTO] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const name = file.name.split(".")[0];
    const rawFileData = await file.arrayBuffer();

    try {
      const dataFile = transformData(rawFileData);
      await saveDataByKey(name, dataFile);
      setSelectedFile(name);
      // Update other state as needed
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboardIcon },
    { name: "File", icon: FileIcon },
    { name: "Departments", icon: MapPinIcon },
    { name: "CTOs", icon: BoxIcon },
  ];

  const activeNavContent = (name: string) => {
    setActiveNavItem(name);
    navigate(`${name}`);
  };
  console.log("params", params);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Timbrado Dashboard</h1>
          <nav>
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={activeNavItem === item.name ? "default" : "ghost"}
                className={`w-full justify-start mb-2 ${
                  activeNavItem === item.name
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() => activeNavContent(item.name)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MenuIcon className="h-4 w-4" />
        </Button>

        <Outlet />
      </div>
    </div>
  );
}
