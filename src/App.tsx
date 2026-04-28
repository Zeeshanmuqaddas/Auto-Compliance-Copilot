import { useState } from 'react';
import { analyzeBusinessIdea, type Region } from './lib/api';
import { ReportViewer } from './components/ReportViewer';
import { Building2, ShieldCheck, Scale, Loader2, Sparkles, Globe, Briefcase, Brain } from 'lucide-react';
import { cn } from './lib/utils';

const AVAILABLE_REGIONS: Region[] = [
  'Global Defaults (PK, US, EU)',
  'United States',
  'European Union',
  'United Kingdom',
  'Pakistan',
  'Canada',
  'Australia'
];

export default function App() {
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<Region[]>(['Global Defaults (PK, US, EU)']);
  const [report, setReport] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleRegion = (region: Region) => {
    if (region === 'Global Defaults (PK, US, EU)') {
      setSelectedRegions(['Global Defaults (PK, US, EU)']);
      return;
    }
    
    setSelectedRegions(prev => {
      const next = prev.filter(r => r !== 'Global Defaults (PK, US, EU)');
      if (next.includes(region)) {
        const removed = next.filter(r => r !== region);
        return removed.length === 0 ? ['Global Defaults (PK, US, EU)'] : removed;
      }
      return [...next, region];
    });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setReport("");

    try {
      const result = await analyzeBusinessIdea({
        idea,
        industry,
        regions: selectedRegions
      });
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">Auto Compliance Copilot</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">AI Legal & Business Decision Agent</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-300">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Processing</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Input Form */}
          <div className="xl:col-span-4 xl:sticky xl:top-24 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <form onSubmit={handleAnalyze} className="space-y-6">
                
                {/* Idea Input */}
                <div className="space-y-2">
                  <label htmlFor="idea" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Describe your Business Idea
                  </label>
                  <textarea
                    id="idea"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="e.g. A SaaS platform connecting freelance doctors with rural clinics..."
                    className="w-full h-32 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                {/* Industry Input */}
                <div className="space-y-2">
                   <label htmlFor="industry" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    Industry / Domain <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="industry"
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Fintech, Healthcare, E-commerce, EdTech"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Regions Selection */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    Target Regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_REGIONS.map(region => {
                      const isSelected = selectedRegions.includes(region);
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => toggleRegion(region)}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-all border",
                            isSelected 
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                          )}
                        >
                          {region}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Select the markets you intend to operate in.</p>
                </div>

                {/* Submit Area */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAnalyzing || !idea.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Risks & Compliance...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-5 h-5" />
                        Run Agent Analysis
                      </>
                    )}
                  </button>
                </div>
                
                {/* Error Banner */}
                {error && (
                  <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200 flex flex-col gap-1">
                    <span className="font-semibold">Analysis Failed</span>
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-800 space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4" /> About the Copilot
                </h4>
                <p>
                  This multi-agent reasoning system evaluates your business from <strong>four key dimensions:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-blue-900/80">
                  <li>Legal Risk Assessment</li>
                  <li>Business Viability & Feasibility</li>
                  <li>Compliance & Licensing</li>
                  <li>Strategic Recommendations</li>
                </ul>
            </div>
          </div>

          {/* Right Column - Report View */}
          <div className="xl:col-span-8">
            <ReportViewer content={report} />
          </div>

        </div>
      </main>
    </div>
  );
}

