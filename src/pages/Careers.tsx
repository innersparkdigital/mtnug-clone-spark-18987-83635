import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Users, TrendingUp, Briefcase, CheckCircle2, Award } from "lucide-react";

const formSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  position: z.string().min(1, "Please select a position"),
  experience_years: z.string().min(1, "Please enter years of experience"),
  specialization: z.string().trim().max(200).optional(),
  linkedin_url: z.string().trim().url("Invalid URL").max(500).optional().or(z.literal("")),
  cover_letter: z.string().trim().min(50, "Cover letter must be at least 50 characters").max(2000),
});

export default function Careers() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      position: "",
      experience_years: "",
      specialization: "",
      linkedin_url: "",
      cover_letter: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("career_applications").insert({
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        position: values.position,
        experience_years: parseInt(values.experience_years),
        specialization: values.specialization || null,
        linkedin_url: values.linkedin_url || null,
        cover_letter: values.cover_letter,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });
      form.reset();
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

  const positions = [
    {
      title: "Licensed Clinical Therapist",
      type: "Full-time",
      description: "Provide virtual therapy sessions to clients dealing with mental health challenges.",
    },
    {
      title: "Child & Adolescent Therapist",
      type: "Full-time",
      description: "Specialize in supporting children and teenagers with mental health and emotional wellbeing.",
    },
    {
      title: "Trauma Counselor",
      type: "Full-time / Part-time",
      description: "Work with individuals who have experienced trauma and require specialized support.",
    },
    {
      title: "Corporate Wellness Therapist",
      type: "Contract",
      description: "Deliver mental health programs and workshops to corporate clients.",
    },
  ];

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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Help us transform mental health care in Uganda. Join a team of passionate professionals dedicated to making a difference.
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

          {/* Open Positions */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
                <p className="text-lg text-muted-foreground">
                  Explore our current therapist opportunities
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-16">
                {positions.map((position, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                          <CardDescription className="text-sm font-medium">{position.type}</CardDescription>
                        </div>
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{position.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Application Form */}
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
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select position" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="licensed-clinical-therapist">Licensed Clinical Therapist</SelectItem>
                                  <SelectItem value="child-adolescent-therapist">Child & Adolescent Therapist</SelectItem>
                                  <SelectItem value="trauma-counselor">Trauma Counselor</SelectItem>
                                  <SelectItem value="corporate-wellness-therapist">Corporate Wellness Therapist</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

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