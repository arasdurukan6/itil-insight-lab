import type { Question } from "./types";

// Seed pool: hand-crafted questions in the PeopleCert style.
// Augmented at runtime by the AI-generated pool in `questions.generated.ts`.
export const SEED_QUESTIONS: Question[] = [
  {
    id: "svs-001",
    category: "Service Value System",
    difficulty: "easy",
    question: "Which of the following is NOT a component of the ITIL service value system?",
    choices: [
      "Guiding principles",
      "Service value chain",
      "Practices",
      "Four dimensions of service management",
    ],
    correctIndex: 3,
    explanation:
      "The four dimensions of service management surround and apply to the entire SVS, but are not themselves a component of the SVS. The SVS components are: guiding principles, governance, service value chain, practices, and continual improvement.",
    wrongExplanations: [
      "Guiding principles ARE a component of the SVS — they steer decisions and behaviour.",
      "The service value chain IS the operating model at the heart of the SVS.",
      "Practices ARE a component of the SVS — they provide the resources and capabilities.",
    ],
    trapExplanation:
      "Candidates often confuse the four dimensions with SVS components. The four dimensions are a separate model that ensures a holistic approach; they sit outside the SVS box in the official ITIL diagram.",
  },
  {
    id: "svs-002",
    category: "Service Value System",
    difficulty: "medium",
    question:
      "What is the MAIN purpose of the ITIL service value system?",
    choices: [
      "To ensure consistent execution of IT operations",
      "To enable an organization to co-create value with stakeholders through products and services",
      "To define the activities required to create products",
      "To provide an operating model for the service desk",
    ],
    correctIndex: 1,
    explanation:
      "The SVS describes how all the components and activities of the organization work together to enable value co-creation through IT-enabled products and services.",
    wrongExplanations: [
      "Operational consistency is a benefit but not the main purpose of the SVS.",
      "Defining activities is part of the service value chain, which is only one component of the SVS.",
      "The SVS spans the whole organization, not a single function such as the service desk.",
    ],
    trapExplanation:
      "PeopleCert favours wording about 'co-creation of value' with stakeholders. Answers limited to 'IT' or to a single function or activity are almost always traps.",
  },
  {
    id: "svc-001",
    category: "Service Value Chain",
    difficulty: "easy",
    question:
      "Which service value chain activity ensures that products and services continuously meet stakeholder expectations for quality, costs, and time-to-market?",
    choices: ["Deliver and support", "Improve", "Obtain/build", "Design and transition"],
    correctIndex: 3,
    explanation:
      "'Design and transition' ensures products and services continually meet stakeholder expectations for quality, costs, and time-to-market.",
    wrongExplanations: [
      "'Deliver and support' ensures services are delivered and supported according to agreed specifications.",
      "'Improve' ensures continual improvement of products, services, and practices.",
      "'Obtain/build' ensures service components are available when and where they are needed.",
    ],
    trapExplanation:
      "The phrase 'quality, costs, and time-to-market' belongs ONLY to design and transition. Memorise the exact one-line purpose statement of each value chain activity — PeopleCert uses them verbatim.",
  },
  {
    id: "svc-002",
    category: "Service Value Chain",
    difficulty: "trap",
    question:
      "A team identifies a recurring failure during a service review and wants to address it. Which value chain activity is PRIMARILY responsible for this work?",
    choices: ["Improve", "Continual improvement", "Engage", "Deliver and support"],
    correctIndex: 0,
    explanation:
      "The 'improve' activity of the service value chain is responsible for ensuring continual improvement of products, services, and practices.",
    wrongExplanations: [
      "'Continual improvement' is a PRACTICE and an SVS component, not a value chain activity. The question asks for the value chain activity.",
      "'Engage' interacts with stakeholders to understand needs, not to deliver the improvement work itself.",
      "'Deliver and support' delivers services; it is not the primary owner of improvement initiatives.",
    ],
    trapExplanation:
      "Classic PeopleCert trap: 'improve' (value chain activity) vs. 'continual improvement' (practice / SVS component). Read whether the question asks for a value chain activity, a practice, or an SVS component.",
  },
  {
    id: "gp-001",
    category: "Guiding Principles",
    difficulty: "easy",
    question:
      "Which guiding principle recommends standardising and streamlining manual tasks and using technology to perform them whenever possible?",
    choices: ["Optimize and automate", "Think and work holistically", "Keep it simple and practical", "Progress iteratively with feedback"],
    correctIndex: 0,
    explanation:
      "'Optimize and automate' recommends optimizing first, then using technology to automate where possible to maximize the value of human and technical resources.",
    wrongExplanations: [
      "'Think and work holistically' is about understanding how all parts of an organization work together as a whole.",
      "'Keep it simple and practical' is about eliminating steps that add no value, not about automation.",
      "'Progress iteratively with feedback' is about organizing work into smaller manageable sections.",
    ],
    trapExplanation:
      "'Optimize' must come BEFORE 'automate'. Choices that suggest automating first or only automating are wrong — you can automate waste and make it worse.",
  },
  {
    id: "gp-002",
    category: "Guiding Principles",
    difficulty: "medium",
    question:
      "A team plans to introduce a new tool. Which guiding principle suggests they should FIRST consider what is already available before procuring something new?",
    choices: ["Start where you are", "Focus on value", "Keep it simple and practical", "Collaborate and promote visibility"],
    correctIndex: 0,
    explanation:
      "'Start where you are' advises assessing the current state and reusing what is already available before introducing anything new.",
    wrongExplanations: [
      "'Focus on value' is about ensuring everything links back to value for stakeholders, not about reuse.",
      "'Keep it simple and practical' addresses removing unnecessary steps, not assessing existing assets.",
      "'Collaborate and promote visibility' addresses involving the right people and transparency.",
    ],
    trapExplanation:
      "The cue 'consider what is already available' is the signature of 'start where you are'. Don't confuse it with 'keep it simple', which is about eliminating waste, not reuse.",
  },
  {
    id: "gp-003",
    category: "Guiding Principles",
    difficulty: "hard",
    question:
      "Which statement BEST describes the guiding principle 'focus on value'?",
    choices: [
      "Every activity should contribute, directly or indirectly, to value for stakeholders",
      "Value should be defined and measured exclusively in financial terms",
      "Value is created only by the service provider",
      "Customers determine value; the service provider should not influence their perception",
    ],
    correctIndex: 0,
    explanation:
      "'Focus on value' means every activity, regardless of who performs it, should map directly or indirectly to value for stakeholders.",
    wrongExplanations: [
      "Value is not only financial; it includes perception, outcomes, and experience.",
      "Value is CO-CREATED by the service provider and the consumer.",
      "The service provider should actively influence and shape the consumer's perception of value through engagement.",
    ],
    trapExplanation:
      "ITIL 4 stresses value co-creation. Any choice that puts value creation on only one side (provider OR consumer) is a trap.",
  },
  {
    id: "pr-001",
    category: "Practices",
    difficulty: "easy",
    question:
      "Which practice has the purpose of minimizing the negative impact of incidents by restoring normal service operation as quickly as possible?",
    choices: ["Incident management", "Problem management", "Service desk", "Monitoring and event management"],
    correctIndex: 0,
    explanation:
      "Incident management's purpose is to minimize the negative impact of incidents by restoring normal service operation as quickly as possible.",
    wrongExplanations: [
      "Problem management focuses on reducing the LIKELIHOOD and IMPACT of incidents by identifying actual and potential causes.",
      "The service desk is the entry point and single point of contact, not the practice that restores normal operation.",
      "Monitoring and event management observes services and records and reports selected changes of state.",
    ],
    trapExplanation:
      "The phrase 'restore normal service operation as quickly as possible' is the verbatim incident management definition. Don't confuse the service desk (channel) with incident management (the practice).",
  },
  {
    id: "pr-002",
    category: "Practices",
    difficulty: "trap",
    question:
      "A user calls the service desk to request a new laptop. This is BEST handled by which practice?",
    choices: ["Service request management", "Incident management", "Change enablement", "Service desk"],
    correctIndex: 0,
    explanation:
      "A request for a standard, pre-approved item like a laptop is a service request, handled by service request management.",
    wrongExplanations: [
      "Incident management deals with unplanned interruptions or quality reductions — nothing is broken here.",
      "Change enablement assesses and authorises CHANGES to products and services; provisioning a standard laptop is a pre-approved service request.",
      "The service desk is the channel that receives the request; the practice handling it is service request management.",
    ],
    trapExplanation:
      "PeopleCert deliberately mixes 'service desk' (where the call arrives) with 'service request management' (the practice that fulfills it). The CHANNEL is never the answer for who 'handles' the request.",
  },
  {
    id: "pr-003",
    category: "Practices",
    difficulty: "medium",
    question:
      "What is the PRIMARY purpose of the 'relationship management' practice?",
    choices: [
      "To establish and nurture the links between the organization and its stakeholders at strategic and tactical levels",
      "To manage suppliers and contracts on behalf of the organization",
      "To handle complaints from customers about service quality",
      "To ensure customer satisfaction surveys are completed each quarter",
    ],
    correctIndex: 0,
    explanation:
      "Relationship management establishes and nurtures the links between the organization and its stakeholders at strategic and tactical levels.",
    wrongExplanations: [
      "Managing suppliers is the purpose of 'supplier management'.",
      "Complaint handling is part of service desk / service request, not relationship management's primary purpose.",
      "Surveys are a possible tool, not the practice's purpose.",
    ],
    trapExplanation:
      "Relationship management is about STRATEGIC and TACTICAL stakeholder links — not operational complaint handling and not supplier contracts (which is supplier management).",
  },
  {
    id: "ipc-001",
    category: "Incident vs Problem vs Change",
    difficulty: "easy",
    question:
      "Which of the following BEST describes a problem?",
    choices: [
      "A cause, or potential cause, of one or more incidents",
      "An unplanned interruption to a service",
      "A known error that has a workaround",
      "Any deviation from normal service operation",
    ],
    correctIndex: 0,
    explanation:
      "A problem is a cause, or potential cause, of one or more incidents.",
    wrongExplanations: [
      "An unplanned interruption is the definition of an INCIDENT.",
      "A known error is a problem that has been ANALYSED and not resolved — it is one possible state of a problem, not the definition.",
      "'Any deviation from normal service operation' is closer to the definition of an event/incident, not a problem.",
    ],
    trapExplanation:
      "Three definitions to memorise word-for-word: incident = unplanned interruption/reduction in quality; problem = cause or potential cause of incidents; known error = problem that has been analysed but not resolved.",
  },
  {
    id: "ipc-002",
    category: "Incident vs Problem vs Change",
    difficulty: "hard",
    question:
      "An organization repeatedly experiences the same database outage. The cause has been investigated, documented, and a workaround exists, but a permanent fix is not yet implemented. What is this BEST described as?",
    choices: ["A known error", "A problem", "An incident", "A standard change"],
    correctIndex: 0,
    explanation:
      "Once a problem has been analysed and is not yet resolved, it becomes a known error. A documented workaround is typical for a known error.",
    wrongExplanations: [
      "It started as a problem but has progressed past analysis — the more specific term 'known error' applies.",
      "Each outage is an incident, but the underlying recurring cause being described is a known error.",
      "A standard change is a pre-authorised low-risk change, unrelated to the description.",
    ],
    trapExplanation:
      "When BOTH 'problem' and 'known error' are offered, choose 'known error' if the cause has been analysed/documented. PeopleCert tests this distinction frequently.",
  },
  {
    id: "ipc-003",
    category: "Incident vs Problem vs Change",
    difficulty: "trap",
    question:
      "Which type of change is pre-authorised, low risk, well understood, and follows a documented procedure?",
    choices: ["Standard change", "Normal change", "Emergency change", "Major change"],
    correctIndex: 0,
    explanation:
      "Standard changes are low-risk, pre-authorised changes that follow a documented procedure and do not require additional risk assessment each time.",
    wrongExplanations: [
      "Normal changes must be scheduled, assessed, and authorised following a process — they are NOT pre-authorised.",
      "Emergency changes must be implemented as soon as possible (e.g. to resolve an incident) and follow an expedited process.",
      "'Major change' is not one of the three ITIL 4 change types. Distractor.",
    ],
    trapExplanation:
      "ITIL 4 recognises exactly THREE change types: standard, normal, emergency. 'Major change' is a common decoy. Standard = pre-authorised, normal = assessed each time, emergency = expedited.",
  },
  {
    id: "gov-001",
    category: "Governance",
    difficulty: "medium",
    question:
      "What is the MAIN role of governance in the service value system?",
    choices: [
      "To direct and control the organization through evaluation, direction, and monitoring",
      "To execute the day-to-day operational activities of the service provider",
      "To define the practices used by the organization",
      "To assess the performance of individual employees",
    ],
    correctIndex: 0,
    explanation:
      "Governance is the means by which an organization is directed and controlled. It involves evaluation, direction, and monitoring.",
    wrongExplanations: [
      "Daily operations are executed through the service value chain and practices, not governance.",
      "Defining practices is part of the SVS but not the role of governance itself.",
      "Performance assessment of individuals is an HR / workforce activity, not governance.",
    ],
    trapExplanation:
      "Governance = evaluate, direct, monitor. Anything operational ('execute', 'perform daily activities') is a wrong-level answer.",
  },
  {
    id: "ci-001",
    category: "Continual Improvement",
    difficulty: "medium",
    question:
      "In what order are the steps of the continual improvement model?",
    choices: [
      "What is the vision? → Where are we now? → Where do we want to be? → How do we get there? → Take action → Did we get there? → How do we keep the momentum going?",
      "Where are we now? → What is the vision? → How do we get there? → Take action → Where do we want to be? → Did we get there? → How do we keep the momentum going?",
      "What is the vision? → Where do we want to be? → Where are we now? → How do we get there? → Take action → How do we keep the momentum going? → Did we get there?",
      "Take action → Did we get there? → Where are we now? → Where do we want to be? → How do we get there? → What is the vision? → How do we keep the momentum going?",
    ],
    correctIndex: 0,
    explanation:
      "The seven steps of the continual improvement model, in order: 1) What is the vision? 2) Where are we now? 3) Where do we want to be? 4) How do we get there? 5) Take action 6) Did we get there? 7) How do we keep the momentum going?",
    wrongExplanations: [
      "'Where are we now?' cannot come before 'What is the vision?' — the vision frames the assessment.",
      "'Where do we want to be?' must come before 'how do we get there?'",
      "Action and validation cannot come before assessment and planning.",
    ],
    trapExplanation:
      "The vision ALWAYS comes first. 'Did we get there?' validates 'take action', so it must follow it. PeopleCert often swaps step 2 and 3 — 'Where are we now?' (step 2) precedes 'Where do we want to be?' (step 3).",
  },
  {
    id: "uw-001",
    category: "Utility vs Warranty",
    difficulty: "easy",
    question:
      "Which of the following BEST describes utility?",
    choices: [
      "Fitness for purpose; what the service does",
      "Fitness for use; how the service performs",
      "The functional and non-functional requirements combined",
      "The financial value generated by a service",
    ],
    correctIndex: 0,
    explanation:
      "Utility is 'fitness for purpose' — the functionality offered by a service to meet a particular need.",
    wrongExplanations: [
      "'Fitness for use' is the definition of WARRANTY.",
      "Combined requirements describe a service offering, not utility specifically.",
      "Financial value is not the definition of utility.",
    ],
    trapExplanation:
      "Remember: Utility = U-seful (purpose); Warranty = W-orks well (use). If the answer mentions availability, capacity, security, or continuity, it's warranty.",
  },
  {
    id: "uw-002",
    category: "Utility vs Warranty",
    difficulty: "trap",
    question:
      "A service guarantees 99.9% availability and 24/7 support. These guarantees are aspects of:",
    choices: ["Warranty", "Utility", "Service offering", "Service level agreement"],
    correctIndex: 0,
    explanation:
      "Availability, capacity, continuity, and security are warranty aspects — they describe how the service performs (fitness for use).",
    wrongExplanations: [
      "Utility is about what the service does (functionality), not performance guarantees.",
      "A service offering describes products and services provided, not specifically guarantees of performance.",
      "An SLA is a document; the guarantees themselves are warranty aspects regardless of where they are recorded.",
    ],
    trapExplanation:
      "SLA is a tempting wrong answer because performance guarantees are USUALLY documented in an SLA. But the question asks what the guarantees ARE (warranty), not where they are written down.",
  },
  {
    id: "sr-001",
    category: "Service Relationships",
    difficulty: "medium",
    question:
      "Which is a recognised type of service relationship in ITIL 4?",
    choices: [
      "Service provision and service consumption",
      "Service support and service operation",
      "Service strategy and service design",
      "Service catalogue and service portfolio",
    ],
    correctIndex: 0,
    explanation:
      "ITIL 4 defines the service relationship as consisting of service provision, service consumption, and service relationship management.",
    wrongExplanations: [
      "'Service support' and 'service operation' are ITIL v3 lifecycle stages — not service relationship types.",
      "'Strategy' and 'design' are ITIL v3 lifecycle stages, not ITIL 4 service relationship types.",
      "Catalogue and portfolio are management artifacts, not service relationship types.",
    ],
    trapExplanation:
      "Three components of a service relationship: service provision, service consumption, service relationship management. ITIL v3 terminology ('service operation', 'service strategy') is always wrong in ITIL 4 questions.",
  },
  {
    id: "gc-001",
    category: "General Concepts",
    difficulty: "easy",
    question:
      "How is a 'service' defined in ITIL 4?",
    choices: [
      "A means of enabling value co-creation by facilitating outcomes customers want to achieve, without the customer having to manage specific costs and risks",
      "A product delivered by an IT provider to a paying customer",
      "Any output produced by a service provider",
      "A set of activities performed to deliver value to a sponsor",
    ],
    correctIndex: 0,
    explanation:
      "ITIL 4 defines a service as a means of enabling value co-creation by facilitating outcomes that customers want to achieve, without the customer having to manage specific costs and risks.",
    wrongExplanations: [
      "Services are not limited to IT or to paying customers; the definition is broader.",
      "'Any output' is too vague — services facilitate outcomes, not produce arbitrary outputs.",
      "Services are about outcomes for customers, not activities for sponsors.",
    ],
    trapExplanation:
      "Memorise the exact wording: 'enabling value co-creation', 'facilitating outcomes', 'without managing specific costs and risks'. Any answer missing 'co-creation' or 'outcomes' is suspect.",
  },
  {
    id: "gc-002",
    category: "General Concepts",
    difficulty: "medium",
    question:
      "Which of the following are the four dimensions of service management?",
    choices: [
      "Organizations and people; information and technology; partners and suppliers; value streams and processes",
      "People; process; products; partners",
      "Strategy; design; transition; operation",
      "Plan; improve; engage; deliver",
    ],
    correctIndex: 0,
    explanation:
      "The four dimensions are: organizations and people; information and technology; partners and suppliers; value streams and processes.",
    wrongExplanations: [
      "'People, process, products, partners' are the FOUR P's from ITIL v3 service design — outdated terminology.",
      "Those are ITIL v3 lifecycle stages.",
      "Those are service value chain activities, not the four dimensions.",
    ],
    trapExplanation:
      "Don't confuse the four DIMENSIONS with the 4 P's (v3) or the six value chain activities. PeopleCert mixes these heavily.",
  },
  {
    id: "gc-003",
    category: "General Concepts",
    difficulty: "hard",
    question:
      "A service consumer can take on which of the following roles?",
    choices: [
      "Customer, user, and sponsor",
      "Customer, user, and stakeholder",
      "Customer, supplier, and user",
      "User, sponsor, and supplier",
    ],
    correctIndex: 0,
    explanation:
      "A service consumer is a generic role that includes the customer (defines requirements and takes responsibility for outcomes), the user (uses the service), and the sponsor (authorises budget).",
    wrongExplanations: [
      "'Stakeholder' is a broader term that includes the service provider — not exclusively a consumer role.",
      "'Supplier' is on the provider side, not the consumer side.",
      "Same issue: supplier is a provider-side role.",
    ],
    trapExplanation:
      "Service consumer = customer + user + sponsor. SUPPLIER is on the provider side. STAKEHOLDER is too broad. These three options are the standard trap set.",
  },
];
