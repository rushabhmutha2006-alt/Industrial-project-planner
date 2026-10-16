import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AiGeneratedPlan } from '../types';
import {
  Sparkles,
  Send,
  Loader2,
  Calendar,
  Building,
  Users,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit3,
  Save,
  Printer,
  Copy,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  FileText,
  Briefcase,
  Check,
} from 'lucide-react';

export const AiPlannerView: React.FC = () => {
  const { currentUser, createVisit, showToast, viewVisitDetails } = useApp();

  // Form parameters
  const [collegeName, setCollegeName] = useState(currentUser.collegeName || 'Apex Institute of Technology & Engineering');
  const [department, setDepartment] = useState(currentUser.department || 'Mechanical & Automation Engineering');
  const [semester, setSemester] = useState('6th Semester (3rd Year)');
  const [studentCount, setStudentCount] = useState<number>(45);
  const [preferredIndustry, setPreferredIndustry] = useState('Automotive & Electric Vehicles');
  const [preferredCity, setPreferredCity] = useState('Pune, Maharashtra');
  const [visitDateRange, setVisitDateRange] = useState('Next Month (Weekend)');
  const [budgetPerStudent, setBudgetPerStudent] = useState<number>(1200);
  const [learningObjectives, setLearningObjectives] = useState(
    'Hands-on exposure to robotic welding lines, EV high-voltage battery assembly, and SCADA automation.'
  );
  const [transportationMode, setTransportationMode] = useState('AC Deluxe Bus (50-Seater)');
  const [visitDuration, setVisitDuration] = useState('Full Day (8:00 AM - 6:30 PM)');

  // Plan generation state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<AiGeneratedPlan | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState<'itinerary' | 'budget' | 'checklist' | 'questions' | 'rubric'>('itinerary');

  // Check if opened from Company Directory prefill
  useEffect(() => {
    const raw = sessionStorage.getItem('ivp_prefill_ai_planner');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.preferredIndustry) setPreferredIndustry(data.preferredIndustry);
        if (data.preferredCity) setPreferredCity(data.preferredCity);
        if (data.learningObjectives) setLearningObjectives(data.learningObjectives);
        if (data.studentCount) setStudentCount(data.studentCount);
        sessionStorage.removeItem('ivp_prefill_ai_planner');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Loading animation stages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeName,
          department,
          semester,
          studentCount,
          preferredIndustry,
          preferredCity,
          visitDateRange,
          budgetPerStudent,
          learningObjectives,
          transportationMode,
          visitDuration,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setGeneratedPlan(result.data);
        showToast(
          result.isAiGenerated
            ? 'Plan generated successfully with Gemini AI!'
            : 'Plan synthesized with academic tour algorithms.',
          'success'
        );
      } else {
        throw new Error(result.error || 'Failed to synthesize plan');
      }
    } catch (err) {
      console.error(err);
      showToast('Error synthesizing plan. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToVisits = () => {
    if (!generatedPlan) return;

    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    const visitDateStr = nextMonth.toISOString().split('T')[0];

    const dest = generatedPlan.recommendedDestinations[0];
    const companyName = dest ? dest.exampleOrganization : preferredIndustry;

    const newVisitId = createVisit({
      title: generatedPlan.visitTitle,
      companyId: `comp_ai_${Date.now()}`,
      companyName,
      companySector: preferredIndustry,
      companyLocation: dest?.location || preferredCity,
      department,
      semester,
      visitDate: visitDateStr,
      returnDate: visitDateStr,
      departureTime: '07:30 AM',
      returnTime: '06:30 PM',
      assemblyPoint: `${collegeName} Central Bay`,
      studentCapacity: Number(studentCount) || 45,
      registrationDeadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'Draft',
      notes: `AI Generated plan: ${generatedPlan.executiveSummary}`,
      budgetEstimate: {
        transportCost: generatedPlan.budgetEstimates.transportCost,
        foodCost: generatedPlan.budgetEstimates.foodAndRefreshments,
        entryFee: generatedPlan.budgetEstimates.entryLabFees,
        accommodationCost: 0,
        miscCost: generatedPlan.budgetEstimates.miscellaneousFirstAid,
        facultyDA: 2500,
        studentCount: Number(studentCount) || 45,
        contingencyPercent: 10,
        contingencyCost: generatedPlan.budgetEstimates.contingencyBuffer,
        totalCost: generatedPlan.budgetEstimates.totalEstimatedCost,
        costPerStudent: generatedPlan.budgetEstimates.costPerStudent,
        collegeSubsidy: Math.round(generatedPlan.budgetEstimates.totalEstimatedCost * 0.25),
        studentPayable: Math.round(generatedPlan.budgetEstimates.costPerStudent * 0.75),
      },
      facultyCoordinatorId: currentUser.id,
      facultyCoordinatorName: currentUser.name,
      facultyCoordinatorEmail: currentUser.email,
      facultyCoordinatorPhone: currentUser.phone,
      transportationDetails: {
        vehicleType: transportationMode,
        vehicleNumber: 'Pending Booking',
        seatingCapacity: Math.round(studentCount * 1.15),
        agencyName: 'Institutional Travels Corp',
        driverName: 'To be assigned',
        driverPhone: 'N/A',
        distanceKm: 65,
        estimatedTravelTime: '1 hr 30 min',
        routeSummary: `${collegeName} -> Highway -> ${preferredCity} Tech Zone`,
        pickupPoints: [{ name: 'Campus Gate 1', time: '07:30 AM', studentCount }],
      },
      itinerary: generatedPlan.itinerary,
      learningObjectives: generatedPlan.learningOutcomes.map((l) => `${l.domain}: ${l.description}`),
      safetyGuidelines: generatedPlan.safetyPrecautions.flatMap((s) => s.guidelines),
      preparationChecklist: generatedPlan.preparationChecklist,
      industrialQuestions: generatedPlan.industrialQuestions,
      postVisitReportTemplate: generatedPlan.postVisitReportTemplate,
    });

    viewVisitDetails(newVisitId);
  };

  const handleCopyMarkdown = () => {
    if (!generatedPlan) return;
    const md = `# ${generatedPlan.visitTitle}
${generatedPlan.executiveSummary}

## Recommended Destinations
${generatedPlan.recommendedDestinations.map((d) => `- **${d.exampleOrganization}** (${d.location}): ${d.suitabilityReason}`).join('\n')}

## Proposed Itinerary
${generatedPlan.itinerary.map((i) => `- **${i.timeSlot}**: ${i.activity} (${i.location}) - ${i.details}`).join('\n')}

## Budget Estimates
- Total Estimated: ₹${generatedPlan.budgetEstimates.totalEstimatedCost.toLocaleString()}
- Cost Per Student: ₹${generatedPlan.budgetEstimates.costPerStudent}
${generatedPlan.budgetEstimates.budgetNotes}

## Curriculum Learning Outcomes
${generatedPlan.learningOutcomes.map((l) => `- **${l.domain}**: ${l.description} (${l.curriculumMapping})`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setIsCopied(true);
    showToast('Plan copied as Markdown to clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const loadingStepsText = [
    'Analyzing engineering curriculum & domain requirements...',
    'Matching accredited industry plants and research centers...',
    'Synthesizing timed minute-by-minute itinerary...',
    'Estimating transportation, meals & safety contingency budgets...',
    'Compiling preparation checklists & technical interview questions...',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI-Powered Visit Planner
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Gemini 3.8 Flash Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Generate curriculum-aligned industrial itineraries, student safety protocols, and realistic cost breakdowns.
          </p>
        </div>

        {generatedPlan && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors no-print"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors no-print"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleSaveToVisits}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105 no-print"
            >
              <Save className="w-3.5 h-3.5" /> Save as Active Visit
            </button>
          </div>
        )}
      </div>

      {/* Academic Disclaimer Card */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5 no-print">
        <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Institutional Planning Advisory:</span> AI-generated itineraries,
          estimated tolls, entry passes, and timetables are advisory templates. Always confirm commercial
          agreements, security badging, and bus fitness directly with suppliers before finalizing student tours.
        </div>
      </div>

      {/* Main Grid: Form Left, Plan Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Column (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 no-print">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" /> Tour Requirements
            </h3>
            <button
              type="button"
              onClick={() => {
                setPreferredIndustry('Automotive & Electric Vehicles');
                setPreferredCity('Pune, Maharashtra');
                setStudentCount(45);
                setBudgetPerStudent(1200);
                setLearningObjectives('Hands-on exposure to robotic assembly lines and EV battery integration.');
              }}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
            >
              Load Sample
            </button>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">College / Institution</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-xs"
                >
                  <option value="Mechanical & Automation Engineering">Mechanical & Auto</option>
                  <option value="Computer Science & Engineering">Computer Science</option>
                  <option value="Robotics & Mechatronics">Robotics / Mechatronics</option>
                  <option value="Electronics & Communication">Electronics & Comm</option>
                  <option value="Civil & Structural Engineering">Civil Engineering</option>
                  <option value="Chemical & Biotechnology">Chemical / Biotech</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Semester / Year</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-xs"
                >
                  <option value="4th Semester (2nd Year)">2nd Year (Sem 4)</option>
                  <option value="5th Semester (3rd Year)">3rd Year (Sem 5)</option>
                  <option value="6th Semester (3rd Year)">3rd Year (Sem 6)</option>
                  <option value="7th Semester (4th Year)">4th Year (Sem 7)</option>
                  <option value="8th Semester (Final Year)">Final Year (Sem 8)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Number of Students</label>
                <input
                  type="number"
                  min={10}
                  max={120}
                  required
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Budget / Student (₹)</label>
                <input
                  type="number"
                  min={200}
                  step={50}
                  required
                  value={budgetPerStudent}
                  onChange={(e) => setBudgetPerStudent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Industry / Domain</label>
              <input
                type="text"
                required
                placeholder="e.g. Automotive, Cloud Data Center, Defense Robotics"
                value={preferredIndustry}
                onChange={(e) => setPreferredIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred City or Region</label>
              <input
                type="text"
                required
                placeholder="e.g. Pune, Bengaluru, Gurugram, Chennai"
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Transit Mode</label>
                <select
                  value={transportationMode}
                  onChange={(e) => setTransportationMode(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-xs"
                >
                  <option value="AC Deluxe Bus (50-Seater)">AC Deluxe Bus</option>
                  <option value="College Institutional Bus">College Own Bus</option>
                  <option value="Intercity Express Train">Intercity Train</option>
                  <option value="Self-Arranged Transit">Self Transit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration</label>
                <select
                  value={visitDuration}
                  onChange={(e) => setVisitDuration(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-xs"
                >
                  <option value="Full Day (8:00 AM - 6:30 PM)">Full Day</option>
                  <option value="Half Day (9:00 AM - 2:00 PM)">Half Day</option>
                  <option value="2-Day Overnight Study Tour">2-Day Tour</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Specific Learning Objectives</label>
              <textarea
                rows={3}
                placeholder="Key equipment, processes, or curriculum units you want covered..."
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Academic Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Complete Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Plan Display Column (8 cols on lg) */}
        <div className="lg:col-span-8">
          {isLoading && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-teal-600 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Gemini AI is Structuring Your Industrial Visit
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {loadingStepsText[loadingStep]}
              </p>
              <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${((loadingStep + 1) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {!isLoading && !generatedPlan && (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                No Plan Generated Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Fill in your departmental constraints on the left, or click “Generate Complete Plan” to synthesize a realistic itinerary with budget and checklist.
              </p>
              <button
                onClick={() => handleGeneratePlan()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Quick Demo Generate
              </button>
            </div>
          )}

          {!isLoading && generatedPlan && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6">
              {/* Plan Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                    Comprehensive Academic Dossier
                  </span>
                  <div className="text-xs text-slate-300 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span>{studentCount} Students</span>
                    <span>•</span>
                    <IndianRupee className="w-3.5 h-3.5 text-teal-400" />
                    <span>₹{generatedPlan.budgetEstimates.costPerStudent} / student</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black mt-3 leading-tight">
                  {generatedPlan.visitTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {generatedPlan.executiveSummary}
                </p>

                {/* Sub-tabs inside Plan */}
                <div className="flex items-center gap-1.5 mt-6 overflow-x-auto pt-2 border-t border-white/10 no-print">
                  {[
                    { id: 'itinerary', label: '1. Itinerary & Timeline' },
                    { id: 'budget', label: '2. Budget & Costs' },
                    { id: 'checklist', label: '3. Checklist & Safety' },
                    { id: 'questions', label: '4. Questions for Engineers' },
                    { id: 'rubric', label: '5. Post-Visit Template' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActivePlanTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activePlanTab === tab.id
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1: Itinerary & Destinations */}
              {activePlanTab === 'itinerary' && (
                <div className="p-6 space-y-6">
                  {/* Recommended Destinations */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" /> Recommended Host Facilities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {generatedPlan.recommendedDestinations.map((dest, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                            {dest.companyType}
                          </div>
                          <div className="text-sm font-bold text-slate-900">{dest.exampleOrganization}</div>
                          <div className="text-xs text-slate-500">{dest.location}</div>
                          <p className="text-xs text-slate-600 mt-1">{dest.suitabilityReason}</p>
                          {dest.recommendedLabs && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dest.recommendedLabs.map((lab, li) => (
                                <span
                                  key={li}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
                                >
                                  {lab}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timed Itinerary */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" /> Proposed Time-Slot Itinerary
                    </h3>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {generatedPlan.itinerary.map((item, idx) => (
                        <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-start gap-3">
                          <div className="w-36 shrink-0 font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md self-start">
                            {item.timeSlot}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-slate-900 text-sm">{item.activity}</h4>
                              {item.coordinator && (
                                <span className="text-[10px] font-semibold text-slate-400">
                                  Lead: {item.coordinator}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">{item.location}</div>
                            <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Curriculum Learning Outcomes
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {generatedPlan.learningOutcomes.map((lo, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-1">
                          <div className="text-xs font-bold text-emerald-950">{lo.domain}</div>
                          <p className="text-xs text-slate-600 leading-relaxed">{lo.description}</p>
                          <div className="text-[10px] font-semibold text-emerald-700 pt-1">
                            Mapped to: {lo.curriculumMapping}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Budget Breakdown */}
              {activePlanTab === 'budget' && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-xs font-bold text-blue-700 uppercase">Total Estimated Outlay</span>
                      <div className="text-2xl font-black text-blue-950 mt-1">
                        ₹{generatedPlan.budgetEstimates.totalEstimatedCost.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-blue-600">Calculated for {studentCount} students</span>
                    </div>

                    <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                      <span className="text-xs font-bold text-teal-700 uppercase">Cost Per Student</span>
                      <div className="text-2xl font-black text-teal-950 mt-1">
                        ₹{generatedPlan.budgetEstimates.costPerStudent}
                      </div>
                      <span className="text-[11px] text-teal-600">Within ceiling of ₹{budgetPerStudent}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-bold text-slate-600 uppercase">Safety Contingency</span>
                      <div className="text-2xl font-black text-slate-900 mt-1">
                        ₹{generatedPlan.budgetEstimates.contingencyBuffer.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-slate-500">First-aid & medical buffer</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                        <tr>
                          <th className="p-3">Expense Head</th>
                          <th className="p-3">Description</th>
                          <th className="p-3 text-right">Estimated Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3 font-semibold text-slate-900">Vehicle Transportation</td>
                          <td className="p-3 text-slate-500">Commercial bus hire, fuel, toll taxes, driver allowance</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            ₹{generatedPlan.budgetEstimates.transportCost.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-900">Food & Refreshments</td>
                          <td className="p-3 text-slate-500">Morning breakfast, subsidized cafeteria lunch, evening tea</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            ₹{generatedPlan.budgetEstimates.foodAndRefreshments.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-900">Lab / Entry Passes</td>
                          <td className="p-3 text-slate-500">Specialized R&D demo pass & industrial badge fee</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            ₹{generatedPlan.budgetEstimates.entryLabFees.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-900">Miscellaneous & First Aid</td>
                          <td className="p-3 text-slate-500">Emergency medicine kit, mementos for host engineers</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            ₹{generatedPlan.budgetEstimates.miscellaneousFirstAid.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-900">Contingency Buffer (8-10%)</td>
                          <td className="p-3 text-slate-500">Unforeseen detour fuel or transit delay backup</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            ₹{generatedPlan.budgetEstimates.contingencyBuffer.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                        <tr>
                          <td className="p-3 text-slate-900" colSpan={2}>
                            Net Estimated Expenditure
                          </td>
                          <td className="p-3 text-right font-mono text-sm text-blue-700">
                            ₹{generatedPlan.budgetEstimates.totalEstimatedCost.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold">Budget Note:</span> {generatedPlan.budgetEstimates.budgetNotes}
                  </div>
                </div>
              )}

              {/* Tab 3: Checklist & Safety */}
              {activePlanTab === 'checklist' && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" /> Preparation Timeline Checklist
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {generatedPlan.preparationChecklist.map((group, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                            {group.timeline}
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {group.tasks.map((task, ti) => (
                              <li key={ti} className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold shrink-0">▫</span>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" /> Mandatory Safety Protocols & PPE
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedPlan.safetyPrecautions.map((safe, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-2">
                          <span className="text-xs font-bold text-rose-900 uppercase">
                            {safe.category}
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {safe.guidelines.map((g, gi) => (
                              <li key={gi} className="flex items-start gap-2">
                                <span className="text-rose-500 font-bold shrink-0">!</span>
                                <span>{g}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Questions for Industry Engineers */}
              {activePlanTab === 'questions' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Curated Questions for Industrial Professionals
                      </h3>
                      <p className="text-xs text-slate-500">
                        Encourage students to inquire into these topics during Q&A and plant debriefs
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedPlan.industrialQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {q.topic}
                        </span>
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          "{q.question}"
                        </p>
                        <p className="text-[11px] text-slate-500">Context: {q.context}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Post-Visit Report Template */}
              {activePlanTab === 'rubric' && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-2">
                      Required Student Dissertation / Report Sections
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Students must submit this report within 7 days of visit completion for academic credit.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {generatedPlan.postVisitReportTemplate.sections.map((sec, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {i + 1}
                          </span>
                          <span>{sec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-2">
                      Faculty Assessment Rubric
                    </h3>
                    <div className="space-y-2">
                      {generatedPlan.postVisitReportTemplate.assessmentRubric.map((rub, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-teal-50/50 border border-teal-200/80 text-xs font-semibold text-teal-950"
                        >
                          {rub}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer action bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
                <button
                  onClick={() => handleGeneratePlan()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Regenerate Options
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Markdown
                  </button>
                  <button
                    onClick={handleSaveToVisits}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                  >
                    <Save className="w-4 h-4" /> Save as Official Visit Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
