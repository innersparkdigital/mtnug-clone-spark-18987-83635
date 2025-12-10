import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import { T } from "@/components/Translate";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Users, TrendingUp, Briefcase, CheckCircle2, Award, Upload } from "lucide-react";

const formSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  position: z.string().trim().min(2, "Position must be at least 2 characters").max(100),
  country: z.string().trim().min(2, "Country is required").max(100),
  experience_years: z.string().min(1, "Please enter years of experience"),
  specialization: z.string().trim().max(200).optional(),
  linkedin_url: z.string().trim().url("Invalid URL").max(500).optional().or(z.literal("")),
  resume: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, "Resume must be less than 5MB")
    .refine((file) => ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type), "Only PDF and DOC/DOCX files are allowed"),
  cover_letter: z.string().trim().min(50, "Cover letter must be at least 50 characters").max(2000),
});

export default function Careers() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      position: "",
      country: "Uganda",
      experience_years: "",
      specialization: "",
      linkedin_url: "",
      cover_letter: "",
      resume: undefined as unknown as File,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Upload resume to Supabase Storage
      const fileExt = values.resume.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, values.resume);

      if (uploadError) throw uploadError;

      // Get public URL for the resume
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // Insert application data
      const { error } = await supabase.from("career_applications").insert({
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        position: values.position,
        country: values.country,
        experience_years: parseInt(values.experience_years),
        specialization: values.specialization || null,
        linkedin_url: values.linkedin_url || null,
        resume_url: publicUrl,
        cover_letter: values.cover_letter,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });
      form.reset();
      setResumeFile(null);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: Heart, title: "Meaningful Work", description: "Make a real difference in people's lives every day" },
    { icon: Users, title: "Supportive Team", description: "Work with passionate professionals who care" },
    { icon: TrendingUp, title: "Growth Opportunities", description: "Continuous learning and professional development" },
    { icon: Briefcase, title: "Flexible Schedule", description: "Remote work options and flexible hours" },
    { icon: CheckCircle2, title: "Competitive Pay", description: "Fair compensation and performance bonuses" },
    { icon: Award, title: "Impact", description: "Be part of Uganda's mental health revolution" },
  ];

  return (
    <>
      <Helmet>
        <title>Careers - Join Our Team | Inner Spark</title>
        <meta name="description" content="Join Inner Spark and help transform mental health care in Uganda. Explore therapist positions and career opportunities." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6"><T>Join Our Mission</T></h1>
              <p className="text-xl text-muted-foreground mb-8">
                <T>Help us transform mental health care in Uganda. Join a team of passionate professionals dedicated to making a difference.</T>
              </p>
            </div>
          </section>

          {/* Company Culture */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Culture</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  At Inner Spark, we believe in creating a supportive environment where therapists can thrive while making a meaningful impact on mental health in Uganda.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={index} className="text-center">
                      <CardHeader>
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{benefit.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Application Form */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">Apply Now</CardTitle>
                  <CardDescription>
                    Fill out the form below to submit your application. We'll review it and get back to you within 5 business days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+256 700 000 000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <FormControl>
                                <Input placeholder="Uganda" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="resume"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Resume/CV * (PDF or DOC, max 5MB)</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  {...field}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setResumeFile(file);
                                      onChange(file);
                                    }
                                  }}
                                />
                                {resumeFile && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Upload className="w-4 h-4" />
                                    <span>{resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position Applying For *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Licensed Clinical Therapist" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="experience_years"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years of Experience *</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" placeholder="3" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="specialization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specialization</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., CBT, Family Therapy" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="linkedin_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cover_letter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cover Letter *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us why you want to join Inner Spark and what makes you a great fit for this role..."
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}