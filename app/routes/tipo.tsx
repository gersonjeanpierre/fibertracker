import { CubeIcon, DesktopIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Unplug } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Work() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">
        FiberTracker
      </h1>
      <div className="flex gap-4 mt-5">
        <Button>
          <CubeIcon className="mr-2 h-4 w-4" />
          HGU
        </Button>
        <Link to="/timbrado">
          <Button>
            <DesktopIcon className="mr-2 h-4 w-4" />
            Timbrado
          </Button>
        </Link>
        <Link to="/timba">
          <Button>
            <Unplug className="mr-2 h-4 w-4" />
            Timbrado
          </Button>
        </Link>
      </div>
    </div>
  );
}
