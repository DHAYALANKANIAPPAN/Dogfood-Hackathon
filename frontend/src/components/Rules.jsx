import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Rules() {
  const rules = [
    "Design mockups, Figma files, or a frontend with hardcoded data behind it",
    "Anything that needs a cloud account, a hosted database, or an auth provider to start",
    "An authentication demo that stops at the login screen (the login page should not be at the starting page)",
    "A gallery with no judging, or judging with no gallery, this is one product",
    "Role checks that live only in the frontend, if I can curl another judge's scores it is not isolation",
    "LLM dumps with no architecture document and nobody able to defend the schema in writing",
    "Closed source, or a license that is not OSI-approved",
    "Anything requiring custom hardware, GUI toolchains, or proprietary services, keep it laptop-friendly",
    "A rewrite of an existing open-source platform with the name changed"
  ];

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">What NOT to Submit</h2>
        <p className="text-slate-600">Please ensure your project does not violate any of the following rules:</p>
      </div>

      <div className="space-y-3">
        {rules.map((rule, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-red-200 transition-colors group"
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <X className="w-4 h-4 text-red-600" strokeWidth={3} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono font-bold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {rule}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
