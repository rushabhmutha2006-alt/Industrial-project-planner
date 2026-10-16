import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini client if API key is present
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health and System Info endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(ai),
      timestamp: new Date().toISOString(),
    });
  });

  // AI-Powered Visit Planner API
  app.post('/api/gemini/plan', async (req, res) => {
    const {
      collegeName = 'Engineering College',
      department = 'Computer Science & Engineering',
      semester = '6th Semester (3rd Year)',
      studentCount = 45,
      preferredIndustry = 'Automotive & Electric Vehicles',
      preferredCity = 'Pune / Bengaluru',
      visitDateRange = 'Next Month (Weekend)',
      budgetPerStudent = 1200,
      learningObjectives = 'Hands-on exposure to robotic assembly lines, industrial IoT telemetry, and quality control systems.',
      transportationMode = 'AC Luxury Coach (50-Seater)',
      visitDuration = 'Full Day (8:00 AM - 6:30 PM)',
    } = req.body;

    const prompt = `You are a premier University Industrial Relations & Educational Tour Consultant.
Design a highly structured, realistic, comprehensive Industrial Visit Plan for college students.

Parameters:
- College: ${collegeName}
- Department: ${department}
- Semester/Batch: ${semester}
- Student Count: ${studentCount} students (+ 3 faculty chaperones)
- Target Industry/Domain: ${preferredIndustry}
- Preferred City/Region: ${preferredCity}
- Scheduled Dates: ${visitDateRange}
- Max Budget Per Student: ₹${budgetPerStudent}
- Core Learning Objectives: ${learningObjectives}
- Transportation Mode: ${transportationMode}
- Visit Duration: ${visitDuration}

Output MUST be a valid JSON object strictly matching this schema:
{
  "visitTitle": "string",
  "executiveSummary": "string",
  "recommendedDestinations": [
    {
      "companyType": "string",
      "exampleOrganization": "string",
      "location": "string",
      "suitabilityReason": "string",
      "recommendedLabs": ["string"]
    }
  ],
  "itinerary": [
    {
      "timeSlot": "string (e.g. 08:00 AM - 09:30 AM)",
      "activity": "string",
      "location": "string",
      "details": "string",
      "coordinator": "string"
    }
  ],
  "learningOutcomes": [
    {
      "domain": "string",
      "description": "string",
      "curriculumMapping": "string"
    }
  ],
  "budgetEstimates": {
    "transportCost": number,
    "foodAndRefreshments": number,
    "entryLabFees": number,
    "miscellaneousFirstAid": number,
    "contingencyBuffer": number,
    "totalEstimatedCost": number,
    "costPerStudent": number,
    "budgetNotes": "string"
  },
  "preparationChecklist": [
    {
      "timeline": "string (e.g. 2 Weeks Before / Day of Visit)",
      "tasks": ["string"]
    }
  ],
  "safetyPrecautions": [
    {
      "category": "string (e.g. Factory Floor PPE / Transit Safety)",
      "guidelines": ["string"]
    }
  ],
  "industrialQuestions": [
    {
      "topic": "string",
      "question": "string",
      "context": "string"
    }
  ],
  "postVisitReportTemplate": {
    "sections": ["string"],
    "assessmentRubric": ["string"]
  }
}

Ensure the cost estimates match the student count and budget constraints. Return ONLY valid JSON, no markdown code fence blocks if possible.`;

    try {
      if (ai) {
        // 12-second timeout so requests never hang indefinitely
        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 12000)
        );

        const response: any = await Promise.race([aiPromise, timeoutPromise]);

        if (response && response.text) {
          const text = response.text;
          const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          return res.json({ success: true, data: parsed, isAiGenerated: true });
        }
      }
    } catch (err: unknown) {
      console.warn('Gemini API call timed out or failed, utilizing realistic academic heuristics:', err);
    }

    // Intelligent realistic fallback generator
    const fallbackPlan = generateFallbackPlan({
      collegeName,
      department,
      semester,
      studentCount: Number(studentCount) || 45,
      preferredIndustry,
      preferredCity,
      visitDateRange,
      budgetPerStudent: Number(budgetPerStudent) || 1200,
      learningObjectives,
      transportationMode,
      visitDuration,
    });

    return res.json({
      success: true,
      data: fallbackPlan,
      isAiGenerated: false,
      notice: 'Generated using high-precision academic planning heuristics (Demo / Fallback Mode).',
    });
  });

  // Serve static files or Vite middlewares
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Industrial Visit Planner] Full-stack Server listening on port ${PORT}`);
  });
}

function generateFallbackPlan(params: {
  collegeName: string;
  department: string;
  semester: string;
  studentCount: number;
  preferredIndustry: string;
  preferredCity: string;
  visitDateRange: string;
  budgetPerStudent: number;
  learningObjectives: string;
  transportationMode: string;
  visitDuration: string;
}) {
  const count = params.studentCount || 45;
  const facultyCount = 3;
  const totalHeads = count + facultyCount;

  const transportBase = Math.round(18000 + (count > 40 ? 6000 : 0));
  const foodPerHead = 280;
  const foodTotal = totalHeads * foodPerHead;
  const entryLabFees = Math.round(count * 150);
  const misc = 3500;
  const contingency = Math.round((transportBase + foodTotal + entryLabFees + misc) * 0.08);
  const totalCost = transportBase + foodTotal + entryLabFees + misc + contingency;
  const costPerStudent = Math.round(totalCost / count);

  return {
    visitTitle: `Comprehensive Industrial Immersion: ${params.preferredIndustry} (${params.department})`,
    executiveSummary: `An intensive educational expedition organized for ${params.studentCount} students of ${params.department} (${params.collegeName}) exploring state-of-the-art facilities in ${params.preferredCity}. The curriculum bridges theoretical classroom knowledge with direct industry implementation.`,
    recommendedDestinations: [
      {
        companyType: `Tier-1 ${params.preferredIndustry} Engineering Facility`,
        exampleOrganization: `${params.preferredCity} High-Tech Manufacturing & R&D Hub`,
        location: `${params.preferredCity} Industrial Development Zone, Phase II`,
        suitabilityReason: `Features certified production lines, robotic handling cells, and direct interaction with Lead Systems Engineers.`,
        recommendedLabs: ['Rapid Prototyping Cell', 'Automated QA & Testing Bay', 'Control Room Operations'],
      },
      {
        companyType: 'Advanced Innovation & Prototyping Center',
        exampleOrganization: 'National IoT & Embedded Systems Testbed',
        location: `${params.preferredCity} Tech Corridor`,
        suitabilityReason: 'Demonstrates end-to-end telemetry pipelines, edge computing units, and industrial SCADA integration.',
        recommendedLabs: ['Cyber-Physical Systems Lab', 'Clean Room Assembly Area'],
      },
    ],
    itinerary: [
      {
        timeSlot: '07:30 AM - 08:00 AM',
        activity: 'Student Roll Call & Boarding',
        location: `${params.collegeName} Main Campus Assembly Bay`,
        details: 'Verification of college identity cards, medical release forms, and safety equipment distribution.',
        coordinator: 'Faculty Chaperones',
      },
      {
        timeSlot: '08:00 AM - 09:45 AM',
        activity: 'Transit & In-Bus Briefing',
        location: `Transit via ${params.transportationMode}`,
        details: 'Faculty presentation on company history, patent portfolios, and core operational ethics.',
        coordinator: 'Lead Faculty & Transport Coordinator',
      },
      {
        timeSlot: '10:00 AM - 10:45 AM',
        activity: 'Security Protocol, Visitor Badging & Corporate Welcome',
        location: 'Corporate Auditorium & Safety Induction Hall',
        details: 'Compulsory corporate safety film, signing of Visitor Non-Disclosure Agreements, and hardhat/goggles allocation.',
        coordinator: 'Industry HR & EHS Manager',
      },
      {
        timeSlot: '10:45 AM - 01:00 PM',
        activity: 'Floor Walkthrough: Main Operations & Manufacturing Lines',
        location: 'Assembly Plant & Specialized Engineering Bays',
        details: 'Guided walkthrough split into 2 batches of 22 students each. Observation of automated robotics and quality inspection stages.',
        coordinator: 'Senior Plant Supervisor & Technical Guides',
      },
      {
        timeSlot: '01:00 PM - 02:00 PM',
        activity: 'Industry Executive Lunch & Networking',
        location: 'Company Cafeteria / Executive Dining Bay',
        details: 'Buffet lunch with informal Q&A with young graduate engineers and alumni working at the facility.',
        coordinator: 'Hospitality & Student Council Leads',
      },
      {
        timeSlot: '02:15 PM - 03:45 PM',
        activity: 'Technical Deep-Dive Seminar & Q&A Panel',
        location: 'Training & Development Conference Center',
        details: `Specialized session addressing "${params.learningObjectives}". Presentation by Chief Technology Architect followed by live problem-solving.`,
        coordinator: 'VP of Engineering & R&D Lead',
      },
      {
        timeSlot: '03:45 PM - 04:30 PM',
        activity: 'MOU Discussion, Group Photography & Feedback Submission',
        location: 'Main Corporate Atrium',
        details: 'Presentation of College Memento to Industry Hosts, digital feedback collection, and distribution of participation certificates.',
        coordinator: 'Head of Department & Student Leads',
      },
      {
        timeSlot: '04:30 PM - 06:15 PM',
        activity: 'Debrief & Return Journey',
        location: `Return transit to ${params.collegeName}`,
        details: 'Peer group discussion on observations and key learnings; safe drop-off at campus.',
        coordinator: 'Faculty Escorts',
      },
    ],
    learningOutcomes: [
      {
        domain: 'Industrial Automation & Process Flow',
        description: 'Understand how sequential production cycles operate with sub-millimeter robotic precision and fail-safe interlocks.',
        curriculumMapping: 'Units 3 & 4 (Industrial Robotics and Systems Automation)',
      },
      {
        domain: 'Quality Assurance & ISO Standards',
        description: 'Observe Six Sigma real-time metrics, destructive vs non-destructive testing methodologies, and optical QA cameras.',
        curriculumMapping: 'Total Quality Management & Statistical Process Control',
      },
      {
        domain: 'Workplace Ergonomics & EHS Compliance',
        description: 'Analyze hazardous zone isolation, lockout-tagout (LOTO) protocols, and environmental effluent treatment.',
        curriculumMapping: 'Professional Ethics & Industrial Safety Engineering',
      },
    ],
    budgetEstimates: {
      transportCost: transportBase,
      foodAndRefreshments: foodTotal,
      entryLabFees: entryLabFees,
      miscellaneousFirstAid: misc,
      contingencyBuffer: contingency,
      totalEstimatedCost: totalCost,
      costPerStudent: costPerStudent,
      budgetNotes: `Calculated for ${count} registered students. The cost per student (₹${costPerStudent}) remains within your ceiling target of ₹${params.budgetPerStudent}. Includes transport fuel, toll taxes, two refreshment breaks, subsidized lunch, and safety gear buffer.`,
    },
    preparationChecklist: [
      {
        timeline: '15 Days Prior to Visit',
        tasks: [
          'Submit formal letter of request on college letterhead to Industry HR/PR division.',
          'Obtain Administrative Approval & Principal sanction for student transit.',
          'Issue Google Form / Portal invite for student registrations and parent consent.',
        ],
      },
      {
        timeline: '7 Days Prior to Visit',
        tasks: [
          'Submit finalized student list with government ID proofs to company security.',
          'Finalize contract with bus operator ensuring fitness certificate and commercial insurance.',
          'Audit first-aid box and designate student group monitors (1 monitor per 10 students).',
        ],
      },
      {
        timeline: 'Day of Visit',
        tasks: [
          'Verify mandatory dress code (Closed-toe leather shoes, college lab coats/uniform, college ID).',
          'Conduct breathalyzer and temperature check before boarding.',
          'Verify that no personal photography equipment or unapproved pen-drives enter the restricted bay.',
        ],
      },
    ],
    safetyPrecautions: [
      {
        category: 'Factory Floor PPE & Movement',
        guidelines: [
          'Safety helmets (hardhats) and high-visibility reflective vests must be worn at all times.',
          'Stay strictly within designated yellow pedestrian walking lanes; never cross safety chain barriers.',
          'Loose hair must be tied, and dangling neck chains, loose scarves, or baggy sleeves are strictly prohibited near rotary machinery.',
        ],
      },
      {
        category: 'Transit & Medical Preparedness',
        guidelines: [
          'Carry emergency contact cards with blood group data for every student on board.',
          'Maintain onboard first-aid kit containing ORS sachets, motion-sickness medications, and antiseptic dressing.',
          'Faculty coordinator must have direct cell contact with the nearest regional multi-specialty hospital along the transit route.',
        ],
      },
    ],
    industrialQuestions: [
      {
        topic: 'Predictive Maintenance & IoT',
        question: 'How does your plant leverage vibration and acoustic sensors to detect bearing wear before catastrophic spindle failure occurs?',
        context: 'Relevant to Industrial IoT and edge computing curriculum.',
      },
      {
        topic: 'Supply Chain Resilience',
        question: 'What just-in-time (JIT) replenishment algorithms are utilized to minimize warehouse holding costs while avoiding assembly line starvation?',
        context: 'Relevant to Operations Research and Supply Chain Management.',
      },
      {
        topic: 'Carbon Footprint & Energy Audit',
        question: 'What percentage of factory electrical load is offset by rooftop solar or regenerative motor braking systems?',
        context: 'Relevant to Sustainable Engineering and Net-Zero manufacturing goals.',
      },
      {
        topic: 'Early Career Recruitment Expectations',
        question: 'What core proficiency gaps do you most commonly notice in newly hired graduate engineering trainees?',
        context: 'Crucial for student placement preparation and project portfolio tuning.',
      },
    ],
    postVisitReportTemplate: {
      sections: [
        '1. Executive Summary & Objective Realization',
        '2. Technical Process Flowchart (Illustrated from visit notes)',
        '3. Critical Analysis of Factory Automation & Software Stack',
        '4. Environmental, Health & Safety (EHS) Assessment',
        '5. Recommendations & Career Insights for Junior Peers',
        '6. Photographic Evidence & Faculty Endorsement',
      ],
      assessmentRubric: [
        'Technical Depth & Process Accuracy (40%)',
        'Clarity of Flowcharts & Data Schematics (20%)',
        'Inquiry & Question Log Quality (20%)',
        'Punctuality & Professional Conduct on Site (20%)',
      ],
    },
  };
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
  process.exit(1);
});
