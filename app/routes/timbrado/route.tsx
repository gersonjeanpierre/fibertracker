import { useState, useRef, useEffect } from "react";
import {
  FileIcon,
  LayoutDashboardIcon,
  MenuIcon,
  DatabaseIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Outlet, useNavigate, useParams } from "@remix-run/react";

export default function Component() {
  const navigate = useNavigate();
  const params = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    { name: "Up Data OLT", icon: DatabaseIcon },
    // { name: "CTOs", icon: BoxIcon },
  ];

  const activeNavContent = (name: string) => {
    setActiveNavItem(name);
    navigate(`${name}`);
  };
  console.log("params", params);
  return (
    <div className="flex h-full w-full bg-gray-100">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={` afixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="p-4 h-screen">
          <div className="sticky top-0">
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
                  onClick={() =>
                    activeNavContent(item.name.split(" ").join(""))
                  }
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-5 ">
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
