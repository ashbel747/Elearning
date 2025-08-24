import React, { useEffect, useState } from "react";
import type { Testimonial } from "../types/Testimonial";

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("https://elearning-backend-4hxa.onrender.com/api/testimonials");
        const data = await res.json();
        setTestimonials(data.data); // backend returns { success, data: [...] }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading testimonials...</p>;

  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-800 w-screen h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">What Our Users Say</h2>

      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t._id}
            className="bg-amber-200 dark:bg-gray-700 shadow-lg rounded-2xl p-6 flex flex-col hover:shadow-xl transition mt-10"
          >
            <div>
                <p className="mt-4 text-gray-700 dark:text-white">"{t.review}"</p>
            </div>
            
            <div className="mt-4 text-left">
                <h3 className="text-sm font-medium dark:text-white">{t.name}</h3>
                <p className="text-sm text-gray-900 dark:text-white">{t.role}</p>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
