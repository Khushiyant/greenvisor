import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";

const NotFound: React.FC = () => {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-background p-4"
      )}
    >
      <div className="text-center space-y-6">
        <Icons.alertCircle className="w-16 h-16 mx-auto text-destructive" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg">
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
