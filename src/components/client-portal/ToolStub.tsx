import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface Props {
  toolName: string;
  description: string;
  onBack: () => void;
}

const ToolStub = ({ toolName, description, onBack }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" /> {toolName}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="text-sm text-muted-foreground">
        This tool is being finalised and will be available in your space very soon. Your therapist will let you know when it's ready.
      </p>
      <Button variant="outline" onClick={onBack}>Back to my space</Button>
    </CardContent>
  </Card>
);

export default ToolStub;