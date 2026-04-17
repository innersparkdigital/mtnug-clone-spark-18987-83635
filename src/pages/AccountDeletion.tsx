import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  reason: z.string().max(100).optional().or(z.literal("")),
  comments: z.string().max(1000).optional().or(z.literal("")),
  confirm: z.literal(true, {
    errorMap: () => ({ message: "You must confirm this action is permanent" }),
  }),
});

type FormValues = z.infer<typeof schema>;

const reasons = [
  "No longer using the service",
  "Privacy concerns",
  "Created a duplicate account",
  "Found an alternative service",
  "Other",
];

const AccountDeletion = () => {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      reason: "",
      comments: "",
      confirm: false as unknown as true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const id = crypto.randomUUID();
      const { error } = await supabase.from("account_deletion_requests").insert({
        id,
        full_name: values.full_name,
        email: values.email,
        phone: values.phone || null,
        reason: values.reason || null,
        comments: values.comments || null,
      });
      if (error) throw error;

      // Send confirmation email (non-blocking)
      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "account-deletion-request",
            recipientEmail: values.email,
            idempotencyKey: `acct-deletion-${id}`,
            templateData: { name: values.full_name },
          },
        })
        .catch(() => {});

      setSubmitted(true);
      toast.success("Your deletion request has been submitted.");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Could not submit your request. Please try again or email us.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Account Deletion Request | Innerspark Africa</title>
        <meta
          name="description"
          content="Request permanent deletion of your Innerspark Africa account and personal data. Submitted requests are processed within 7 days."
        />
        <link rel="canonical" href="https://www.innersparkafrica.com/account-deletion" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Account Deletion Request
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            At Innerspark, we respect your privacy and give you full control over your data.
            If you would like to delete your account and all associated personal information,
            you can submit a request using the form below.
          </p>
        </header>

        <Card className="mb-8 border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <h2 className="text-lg font-semibold">Important Information</h2>
            </div>
            <ul className="list-disc pl-8 space-y-2 text-sm text-foreground/90">
              <li>Account deletion is permanent and cannot be undone</li>
              <li>All personal data will be deleted after verification</li>
              <li>Some data may be retained where required by law</li>
              <li>Requests are processed within 7 days</li>
            </ul>
          </CardContent>
        </Card>

        {submitted ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-3 text-primary">Request Received</h2>
              <p className="text-muted-foreground mb-4">
                Thank you. We've received your account deletion request and will process it
                within 7 days. A confirmation has been sent to your email.
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Submit another request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
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
                        <FormLabel>Email Address (used in the app) *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+256 ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Deletion (optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reasons.map((r) => (
                              <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Comments (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Anything else you'd like us to know"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            I understand this action is permanent
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Submitting..."
                      : "Request Account Deletion"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <section className="mt-10 p-6 rounded-lg bg-muted/50 border">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="font-semibold mb-1">Prefer email?</h2>
              <p className="text-sm text-muted-foreground">
                You can also request account deletion by emailing{" "}
                <a
                  href="mailto:support@innersparkafrica.com?subject=Account%20Deletion%20Request"
                  className="text-primary hover:underline font-medium"
                >
                  support@innersparkafrica.com
                </a>
                <br />
                Subject: <em>Account Deletion Request</em>
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">What happens after submission</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-foreground/90">
            <li>Your account will be permanently deleted</li>
            <li>Personal data will be removed from our systems</li>
            <li>Active sessions will be terminated</li>
          </ul>
        </section>

        <p className="mt-10 text-sm text-muted-foreground text-center border-t pt-6">
          If you have any questions, contact us at{" "}
          <a
            href="mailto:support@innersparkafrica.com"
            className="text-primary hover:underline"
          >
            support@innersparkafrica.com
          </a>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default AccountDeletion;
