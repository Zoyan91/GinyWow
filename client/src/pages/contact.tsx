import { Link } from 'wouter';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Send } from 'lucide-react';
import { SiFacebook, SiX, SiLinkedin, SiYoutube, SiPinterest } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Header from '@/components/header';
import Footer from '@/components/footer';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', data);
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Header currentPage="contact" />

      {/* Contact Content */}
      <main className="bg-background/50 backdrop-blur-sm container mx-auto px-4 sm:px-6 py-8 max-w-6xl relative z-10">
        <div 
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have a question or need support? We're here to help you succeed with your content creation journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div 
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl shadow-blue-500/10"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
                          data-testid="input-name"
                        />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Enter your email address" 
                          {...field} 
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What can we help you with?" 
                          {...field} 
                          data-testid="input-subject"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about your inquiry..."
                          className="min-h-[120px]"
                          {...field} 
                          data-testid="textarea-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Information */}
          <div 
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl shadow-blue-500/10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                    <p className="text-gray-600">For questions and support</p>
                    <a 
                      href="mailto:info@ginywow.com" 
                      className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                      data-testid="email-link"
                    >
                      info@ginywow.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Our Location</h3>
                    <p className="text-gray-600">
                      Alwar, Rajasthan, 301025<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl shadow-blue-500/10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Support</h2>
              <p className="text-gray-600 mb-4">
                Need immediate help? Check out our frequently asked questions or reach out directly.
              </p>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Response Time:</strong> We typically respond within 24 hours
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST
                </p>
              </div>

              <div className="mt-6">
                <Link href="/">
                  <Button variant="outline" className="w-full" data-testid="button-back-home">
                    ← Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}