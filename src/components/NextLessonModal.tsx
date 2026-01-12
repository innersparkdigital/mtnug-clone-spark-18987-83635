import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Video, 
  FileText, 
  Headphones, 
  Target, 
  Lightbulb, 
  Award,
  Clock,
  Trophy,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";

interface NextLessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLessonTitle: string;
  nextLesson: {
    title: string;
    type: string;
    duration: string;
    moduleTitle: string;
    isNewModule: boolean;
  } | null;
  courseId: string;
  nextModuleId: string;
  nextLessonId: string;
  isCourseComplete: boolean;
}

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video": return Video;
    case "slides": return FileText;
    case "audio": return Headphones;
    case "activity": return Target;
    case "quiz": return Lightbulb;
    case "certificate": return Award;
    default: return FileText;
  }
};

const NextLessonModal = ({
  open,
  onOpenChange,
  currentLessonTitle,
  nextLesson,
  courseId,
  nextModuleId,
  nextLessonId,
  isCourseComplete
}: NextLessonModalProps) => {
  const LessonIcon = nextLesson ? getLessonIcon(nextLesson.type) : BookOpen;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <Trophy className="w-5 h-5" />
            Lesson Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            You've completed: <span className="font-medium text-foreground">{currentLessonTitle}</span>
          </p>

          {isCourseComplete ? (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 text-center border border-yellow-200 dark:border-yellow-800">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                🎉 Course Completed!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Congratulations! You've finished all lessons. Your certificate is ready.
              </p>
              <Link to={`/learning/${courseId}/certificate`}>
                <Button className="w-full gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600">
                  <Award className="w-4 h-4" />
                  Get Your Certificate
                </Button>
              </Link>
            </div>
          ) : nextLesson ? (
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              {nextLesson.isNewModule && (
                <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
                  New Module
                </Badge>
              )}
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LessonIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Up Next</p>
                  <h4 className="font-semibold text-foreground mb-1 line-clamp-2">
                    {nextLesson.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {nextLesson.moduleTitle}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{nextLesson.duration}</span>
                    <span className="capitalize">• {nextLesson.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Back to Course
                </Button>
                <Link 
                  to={`/learning/${courseId}/module/${nextModuleId}/lesson/${nextLessonId}`}
                  className="flex-1"
                >
                  <Button className="w-full gap-2">
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NextLessonModal;