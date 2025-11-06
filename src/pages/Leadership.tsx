import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Card, CardContent } from "@/components/ui/card";
import talemwaRaymond from "@/assets/talemwa-raymond.jpg";
import hellenAturo from "@/assets/hellen-aturo.jpg";
import mutebiReagan from "@/assets/mutebi-reagan.jpg";
import jamesNiwamanya from "@/assets/james-niwamanya.jpg";

const Leadership = () => {
  const leaders = [
    {
      name: "Talemwa Raymond",
      position: "Founder and CEO",
      image: talemwaRaymond,
    },
    {
      name: "Hellen Aturo",
      position: "Co-founder and Business Development & Partnership Manager",
      image: hellenAturo,
    },
    {
      name: "Mutebi Reagan",
      position: "Therapist and Director Virtual Therapy",
      image: mutebiReagan,
    },
    {
      name: "James Niwamanya",
      position: "Brand Digital Marketing Lead",
      image: jamesNiwamanya,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Leadership Team
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Meet the passionate individuals leading Inner Spark's mission to transform 
                mental health and wellness across Uganda.
              </p>
            </div>

            {/* Leadership Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leaders.map((leader, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {leader.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {leader.position}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mission Statement */}
            <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="bg-primary/5 rounded-lg p-8 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Our Commitment
                </h2>
                <p className="text-lg text-muted-foreground">
                  Together, our leadership team is committed to making mental health support 
                  accessible, affordable, and effective for everyone in Uganda. We believe in 
                  the power of compassion, innovation, and community to transform lives.
                </p>
              </div>
            </div>
          </div>
        </section>

        <AppDownload />
        <Footer />
    </div>
  );
};

export default Leadership;
