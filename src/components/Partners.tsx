import nationalIctHub from "@/assets/partners/national-ict-hub.png";
import awsLogo from "@/assets/partners/aws.png";

const partners = [
  { name: "National ICT Innovation Hub", logo: nationalIctHub },
  { name: "Amazon Web Services", logo: awsLogo },
];

const Partners = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Our Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with leading organizations to bring you the best mental health support
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {partners.map((partner) => (
            <div 
              key={partner.name}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
