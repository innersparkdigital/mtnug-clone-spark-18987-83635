import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  CheckCircle, 
  Star, 
  ArrowRight,
  AlertCircle,
  Users,
  Bell,
  RefreshCw
} from "lucide-react";
import { AssessmentResult } from "@/contexts/AssessmentContext";
import { findMatchingTherapist, MatchedTherapist, getRecommendedSpecialistType } from "@/lib/therapistMatching";
import { getSpecialistImage } from "@/lib/specialistImages";

interface TherapistRecommendationCardProps {
  assessmentResult: AssessmentResult;
  onProceedWithTherapist: () => void;
  onJoinSupportGroup: () => void;
}

const TherapistRecommendationCard = ({
  assessmentResult,
  onProceedWithTherapist,
  onJoinSupportGroup,
}: TherapistRecommendationCardProps) => {
  const [loading, setLoading] = useState(true);
  const [therapist, setTherapist] = useState<MatchedTherapist | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState({
    generalTherapist: false,
    supportGroup: true,
    waitlist: false
  });

  const fetchTherapist = async () => {
    setLoading(true);
    const result = await findMatchingTherapist(assessmentResult.assessmentType);
    setTherapist(result.therapist);
    setFallbackMessage(result.fallbackMessage);
    setAlternatives(result.alternativeOptions);
    setLoading(false);
  };

  useEffect(() => {
    fetchTherapist();
  }, [assessmentResult.assessmentType]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Minimal": return "bg-green-100 text-green-700 border-green-200";
      case "Mild": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Moderate": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Moderately Severe": return "bg-red-100 text-red-600 border-red-200";
      case "Severe": return "bg-red-200 text-red-800 border-red-300";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const recommendedType = getRecommendedSpecialistType(assessmentResult.assessmentType);

  if (loading) {
    return (
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Assessment Summary */}
      <div className="bg-muted/50 rounded-lg p-4 border space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm font-medium text-foreground">Assessment Result</span>
          <Badge className={`${getSeverityColor(assessmentResult.severity)} border`}>
            {assessmentResult.severity}
          </Badge>
        </div>
        
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Condition:</span>
            <span className="font-medium text-foreground">{assessmentResult.assessmentLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recommended Specialist:</span>
            <span className="font-medium text-primary">{recommendedType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-medium text-foreground">{assessmentResult.recommendedFormat}</span>
          </div>
        </div>
      </div>

      {/* Therapist Card or Fallback */}
      {therapist ? (
        <div className="bg-card rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Assigned Therapist
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-xs"
              onClick={fetchTherapist}
            >
              <RefreshCw className="w-3 h-3" />
              Reassign
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 shrink-0">
              {therapist.image_url || getSpecialistImage(therapist.name, null) ? (
                <img 
                  src={getSpecialistImage(therapist.name, therapist.image_url)}
                  alt={therapist.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground">{therapist.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{therapist.type}</p>
              <p className="text-xs text-primary mt-1">{therapist.matchReason}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/50 rounded p-2">
              <span className="text-muted-foreground block text-xs">Experience</span>
              <span className="font-medium">{therapist.experience_years} years</span>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <span className="text-muted-foreground block text-xs">Session Rate</span>
              <span className="font-medium">{formatPrice(therapist.price_per_hour)}/hr</span>
            </div>
          </div>

          {therapist.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {therapist.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {therapist.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{therapist.specialties.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button className="flex-1 gap-2" onClick={onProceedWithTherapist}>
              Continue Booking
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link to={`/specialists/${therapist.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      ) : fallbackMessage ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">No Specialist Available</h4>
              <p className="text-sm text-amber-800">{fallbackMessage}</p>
            </div>
          </div>

          <div className="grid gap-2">
            {alternatives.generalTherapist && (
              <Button 
                variant="default" 
                className="w-full gap-2"
                onClick={onProceedWithTherapist}
              >
                <User className="w-4 h-4" />
                Continue with General Therapist
              </Button>
            )}
            
            {alternatives.supportGroup && (
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={onJoinSupportGroup}
              >
                <Users className="w-4 h-4" />
                Join a Support Group
              </Button>
            )}

            {alternatives.waitlist && (
              <Button variant="ghost" className="w-full gap-2">
                <Bell className="w-4 h-4" />
                Notify Me When Available
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TherapistRecommendationCard;
