import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '../backend/.env' });

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    skills: [{ type: String, required: true }],
    experienceLevel: { type: String, required: true },
    salaryRange: { type: String, required: true },
    jobType: { type: String, required: true },
    industry: { type: String, required: true },
    postedDate: { type: Date, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', JobSchema);

const cities = [
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Delhi',
  'Mumbai',
  'Chennai',
  'Gurgaon',
  'Noida',
  'Kolkata',
  'Ahmedabad'
];

/** Must match frontend FiltersSidebar skillsOptions so filters always hit jobs. */
const skillsPool = [
  'Machine Learning',
  'Python',
  'TensorFlow',
  'PyTorch',
  'NLP',
  'Data Science',
  'SQL',
  'Deep Learning',
  'Computer Vision',
  'Pandas',
  'NumPy',
  'Scikit-learn',
  'MLOps',
  'Flask',
  'FastAPI',
  'Statistics',
  'Big Data',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Spark',
  'Kafka',
  'Git',
  'PySpark',
  'Tableau',
  'MongoDB',
  'Redis',
  'Airflow',
  'Transformers',
  'OpenCV',
  'XGBoost',
  'LightGBM',
  'Java',
  'Scala',
  'REST API',
  'Feature Engineering',
  'Model Deployment'
];

const experienceLevels = ['0-1 years', '1-3 years', '3-5 years', '5+ years'];

const jobTypes = ['Full Time', 'Internship', 'Remote', 'Contract'];

const industries = [
  'Information Technology',
  'E-commerce',
  'Healthcare',
  'Finance',
  'EdTech',
  'Consulting',
  'SaaS',
  'Analytics'
];

const salaryRanges = [
  '3-5 LPA',
  '5-8 LPA',
  '8-12 LPA',
  '12-18 LPA',
  '18-25 LPA',
  '25+ LPA'
];

const companies = [
  'Infosys',
  'TCS',
  'Wipro',
  'HCL Technologies',
  'Accenture',
  'Cognizant',
  'IBM India',
  'Capgemini India',
  'Tech Mahindra',
  'LTIMindtree',
  'Mphasis',
  'Persistent Systems',
  'Flipkart',
  'Amazon India',
  'Google India',
  'Microsoft India',
  'Adobe India',
  'Oracle India',
  'SAP Labs India',
  'VMware India',
  'Ola',
  'Swiggy',
  'Zomato',
  'Paytm',
  'PhonePe',
  "Byju's",
  'Freshworks',
  'Zoho',
  'Razorpay',
  'Meesho',
  'Nykaa',
  'Policybazaar',
  'Dream11',
  'CRED',
  'Groww',
  'Udaan',
  'PharmEasy',
  'Delhivery',
  'Lenskart',
  'Ola Electric',
  'Ather Energy',
  'Myntra',
  'Jio Platforms',
  'Fractal Analytics',
  'Mu Sigma',
  'Tiger Analytics',
  'LatentView',
  'Thoughtworks',
  'Publicis Sapient',
  'Nagarro',
  'Globant',
  'EPAM Systems',
  'Dunnhumby India',
  'AbInBev GCC',
  'Walmart Global Tech India',
  'Target India',
  'Goldman Sachs India',
  'JP Morgan India',
  'Deutsche Bank India',
  'American Express India',
  'Siemens Healthineers',
  'GE Healthcare',
  'Philips Innovation',
  'Siemens Technology',
  'Samsung R&D Bangalore',
  'Qualcomm India',
  'NVIDIA India',
  'Intel India',
  'AMD India',
  'LinkedIn India',
  'Uber India',
  'Booking.com India',
  'Atlassian India',
  'ServiceNow India',
  'Snowflake India',
  'Databricks India',
  'Salesforce India',
  'Elastic India',
  'MongoDB India',
  'Confluent India',
  'Postman',
  'RazorpayX',
  'CRED Mint',
  'Zeta Suite',
  'BharatPe',
  'Slice',
  'Groww Wealth',
  'Angel One',
  'Kotak Securities Tech',
  'ICICI Tech',
  'HDFC Bank IT',
  'Axis Bank Analytics',
  'SBI Cards Analytics',
  'Max Healthcare Analytics',
  'Apollo Hospitals IT',
  'Practo',
  '1mg',
  'Netmeds',
  'Cure.fit',
  'HealthifyMe',
  'NoBroker',
  'Housing.com',
  'Square Yards',
  'Licious',
  'Country Delight',
  'Eruditus',
  'UpGrad',
  'Scaler',
  'Newton School',
  'Great Learning',
  'Simplilearn',
  'PwC India',
  'EY India',
  'KPMG India',
  'Deloitte India',
  'McKinsey Digital India',
  'BCG GAMMA India',
  'Bain Capability Network',
  'ZS Associates',
  'IQVIA India',
  'Novartis Analytics',
  'Dr. Reddy’s Labs IT',
  'Biocon Biologics',
  'Tata Motors Digital',
  'Mahindra Tech',
  'Reliance JioMart',
  'BigBasket',
  'Blinkit',
  'Dunzo',
  'Zepto',
  'Shiprocket',
  'Rivigo',
  'BlackBuck',
  'Locus.sh',
  'GreyOrange',
  'Addverb Technologies',
  'Suki AI',
  'Yellow.ai',
  'Haptik',
  'Gupshup',
  'Exotel',
  'Plivo',
  'Acko Tech',
  'Digit Insurance Tech',
  'Navi Finserv',
  'Jupiter Money',
  'Fi Money',
  'Open Financial',
  'Setu',
  'Perfios',
  'Lentra',
  'HighRadius',
  'Chargebee',
  'Postman API',
  'Hasura',
  'Razorpay Payroll',
  'Gojek Tech India',
  'Gojek (GoTo)',
  'Grab India Engineering',
  'Swiggy Instamart Tech',
  'Zepto Cafe Tech',
  'Meesho Supply Chain ML',
  'Udaan B2B Data',
  'OfBusiness Tech',
  'Infra.Market Tech',
  'Blackbuck Freight ML',
  'Porter Tech',
  'Shadowfax Tech',
  'Xpressbees Analytics',
  'Delhivery Robotics',
  'GreyOrange AI',
  'Locus Route AI',
  'FarEye Tech',
  'FourKites India',
  'Project44 India',
  'ClearTax',
  'Vymo',
  'Leadsquared',
  'Freshdesk Analytics',
  'Zoho Analytics',
  'ChargePoint India',
  'Ather Grid Data',
  'Ola Maps',
  'MapmyIndia',
  'TomTom India',
  'HERE Technologies India',
  'Esri India',
  'Crayon Data',
  'Manthan',
  'Manthan (Alibaba)',
  'Algonomy',
  'Vue.ai',
  'Murf AI',
  'Sarvam AI',
  'Krutrim',
  'Suki (voice)',
  'Uniphore',
  'Observe.AI',
  'Gong India',
  'Amplitude India',
  'Mixpanel India',
  'Heap Analytics India',
  'Segment India',
  'RudderStack India',
  'Fivetran India',
  'dbt Labs India',
  'Monte Carlo India',
  'Bigeye India',
  'Metaplane India',
  'Collibra India',
  'Alation India',
  'Atlan India',
  'CastorDoc India',
  'Secoda India',
  'ThoughtSpot India',
  'Looker India',
  'Mode Analytics India',
  'Sigma Computing India',
  'Hex Technologies India',
  'Deepnote India',
  'Weights & Biases India',
  'Neptune.ai India',
  'Comet ML India',
  'MLflow OSS Contributors',
  'Kubeflow Community',
  'Seldon India',
  'BentoML India',
  'Ray (Anyscale) India',
  'Modal Labs India',
  'Replicate India',
  'Hugging Face India',
  'Cohere Partner India',
  'OpenAI Partner India',
  'Anthropic Partner India',
  'Stability AI India',
  'Runway ML India',
  'Midjourney Community India',
  'Labelbox India',
  'Scale AI India',
  'Snorkel AI India',
  'SuperAnnotate India',
  'V7 Labs India',
  'Roboflow India',
  'Ultralytics India',
  'Deci AI India',
  'Neural Magic India',
  'Groq India',
  'SambaNova India',
  'Cerebras India',
  'Graphcore India',
  'Tenstorrent India',
  'Sambanova Systems India'
];

const titles = [
  'Machine Learning Engineer',
  'Senior Machine Learning Engineer',
  'Data Scientist',
  'Senior Data Scientist',
  'Staff Data Scientist',
  'NLP Engineer',
  'Senior NLP Engineer',
  'Computer Vision Engineer',
  'Deep Learning Engineer',
  'Data Analyst',
  'Senior Data Analyst',
  'AI Research Engineer',
  'Applied Scientist',
  'Research Scientist — ML',
  'Business Data Analyst',
  'Junior ML Engineer',
  'MLOps Engineer',
  'Senior MLOps Engineer',
  'Data Engineer',
  'Analytics Engineer',
  'BI Developer',
  'ML Platform Engineer',
  'AI Software Engineer',
  'Python Backend Engineer — ML',
  'Recommendation Systems Engineer',
  'Search & Ranking Engineer',
  'Forecasting & Time Series Analyst',
  'Generative AI Engineer',
  'LLM Application Engineer',
  'AI Product Analyst',
  'Data Science Manager',
  'Head of Data Science',
  'Principal ML Engineer',
  'Computer Vision Researcher',
  'Speech & Audio ML Engineer',
  'Data Science Intern',
  'ML Engineering Intern',
  'Quantitative Analyst',
  'Risk Model Developer',
  'Fraud Detection ML Engineer',
  'Customer Analytics Lead',
  'Marketing Data Scientist',
  'Supply Chain Data Scientist',
  'Clinical ML Scientist',
  'Bioinformatics Data Scientist',
  'Autonomous Systems ML Engineer',
  'Edge AI Engineer',
  'Embedded ML Engineer',
  'Data Quality Engineer',
  'Feature Store Engineer',
  'Experimentation / Causal Analyst',
  'Growth Data Scientist',
  'Pricing & Revenue Science',
  'Personalization Engineer',
  'Ads ML Engineer',
  'Content Understanding ML',
  'Video ML Engineer',
  'Multimodal AI Engineer',
  'AI Safety & Eval Engineer',
  'Responsible AI Analyst',
  'Data Annotator Lead',
  'ML Solutions Architect',
  'Technical Lead — AI',
  'Engineering Manager — ML',
  'Staff Engineer — Data Platform'
];

const randomFrom = (arr, rng) => arr[Math.floor(rng() * arr.length)];

/** Seeded PRNG for reproducible datasets (mulberry32). */
const createRng = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const randomSkillsSubset = (rng) => {
  const min = 4;
  const max = 8;
  const size = min + Math.floor(rng() * (max - min + 1));
  const shuffled = [...skillsPool].sort(() => rng() - 0.5);
  return shuffled.slice(0, size);
};

const randomPostedDate = (rng) => {
  const daysAgo = Math.floor(rng() * 120);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

const buildDescription = (title, company, skills, industry, rng) => {
  const top = skills.slice(0, 4).join(', ');
  const extra = skills.slice(4, 7).join(', ');
  const focus = randomFrom(
    [
      'production ML systems',
      'experimentation and A/B testing',
      'large-scale data pipelines',
      'real-time inference services',
      'model monitoring and drift detection',
      'LLM-powered product features',
      'search ranking and recommendations',
      'forecasting and optimization',
      'computer vision applications',
      'NLP and information extraction'
    ],
    rng
  );
  return (
    `${company} is hiring a ${title} for our ${industry} team. ` +
    `You will work on ${focus} using ${top}. ` +
    (extra ? `Additional exposure to ${extra} is a plus. ` : '') +
    `We value strong fundamentals in Python, statistics, and software engineering. ` +
    `You will collaborate with product, engineering, and analytics in an agile environment. ` +
    `Remote-friendly culture with mentorship and learning budgets for conferences and courses.`
  );
};

const printAtlasHints = (err) => {
  const text = `${err?.name || ''} ${err?.message || err || ''}`;
  if (
    /ReplicaSetNoPrimary|whitelist|ServerSelectionError|MongooseServerSelectionError|ETIMEDOUT|ECONNREFUSED/i.test(
      text
    )
  ) {
    console.error('\n--- Cannot reach MongoDB Atlas (ReplicaSetNoPrimary is usually network/cluster state) ---');
    console.error('1. Atlas → Network Access → add your current public IP (or 0.0.0.0/0 only for dev).');
    console.error('2. Atlas → Clusters → open your cluster → if PAUSED, click Resume.');
    console.error('3. Atlas → Database → Users → confirm user exists; password in MONGO_URI must be URL-encoded.');
    console.error('4. Use “Connect → Drivers” URI: mongodb+srv://USER:PASS@cluster.../dbname?retryWrites=true&w=majority');
    console.error('5. Corporate VPN/firewall: try off-VPN or allow outbound to *.mongodb.net (port 27017).\n');
  }
};

const seedJobs = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set in backend/.env');

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 45000,
      socketTimeoutMS: 45000
    });
  } catch (e) {
    printAtlasHints(e);
    throw e;
  }

  console.log('Connected to MongoDB, clearing existing jobs...');
  await Job.deleteMany({});

  const target = 280;
  const rng = createRng(20260322);
  const jobs = [];

  for (let i = 0; i < target; i++) {
    const title = randomFrom(titles, rng);
    const company = randomFrom(companies, rng);
    const location = randomFrom(cities, rng);
    const skills = randomSkillsSubset(rng);
    const experienceLevel = randomFrom(experienceLevels, rng);
    const salaryRange = randomFrom(salaryRanges, rng);
    const jobType = randomFrom(jobTypes, rng);
    const industry = randomFrom(industries, rng);
    const postedDate = randomPostedDate(rng);
    const description = buildDescription(
      title,
      company,
      skills,
      industry,
      rng
    );

    jobs.push({
      title,
      company,
      location,
      skills,
      experienceLevel,
      salaryRange,
      jobType,
      industry,
      postedDate,
      description
    });
  }

  await Job.insertMany(jobs);
  console.log(`Inserted ${jobs.length} jobs.`);

  await mongoose.disconnect();
  console.log('Done.');
};

seedJobs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding error:', err);
    printAtlasHints(err);
    process.exit(1);
  });
