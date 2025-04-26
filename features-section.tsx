import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      icon: "fas fa-robot",
      title: "AI-Powered Recommendations",
      description: "Our advanced AI algorithm analyzes your vehicle specs to recommend the perfect parts."
    },
    {
      icon: "fas fa-search-dollar",
      title: "Price Comparison",
      description: "Find the best deals across multiple retailers with our automatic price comparisons."
    },
    {
      icon: "fas fa-car",
      title: "Extensive Vehicle Database",
      description: "Access parts for nearly any vehicle with our comprehensive database of makes and models."
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-montserrat text-center mb-12">Why Choose Yalla Tiers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-light-gray rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className={`${feature.icon} text-secondary text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold font-montserrat mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
