import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, FileText, Camera } from "lucide-react";
import TrainingsManager from "./content/TrainingsManager";
import BlogsManager from "./content/BlogsManager";
import EventsManager from "./content/EventsManager";

const ContentTab = () => {
  return (
    <Tabs defaultValue="trainings" className="space-y-4">
      <TabsList>
        <TabsTrigger value="trainings" className="gap-2"><GraduationCap className="h-4 w-4" /> Trainings</TabsTrigger>
        <TabsTrigger value="blogs" className="gap-2"><FileText className="h-4 w-4" /> Blogs</TabsTrigger>
        <TabsTrigger value="events" className="gap-2"><Camera className="h-4 w-4" /> Events</TabsTrigger>
      </TabsList>
      <TabsContent value="trainings"><TrainingsManager /></TabsContent>
      <TabsContent value="blogs"><BlogsManager /></TabsContent>
      <TabsContent value="events"><EventsManager /></TabsContent>
    </Tabs>
  );
};

export default ContentTab;