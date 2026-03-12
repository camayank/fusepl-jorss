import type { StartupCategory, SectorMapping, DamodaranBenchmark } from '@/types'
import damodaranRaw from '../../../public/data/damodaran/india-benchmarks.json'

const damodaranData = damodaranRaw as Record<string, DamodaranBenchmark>

export const SECTOR_MAPPING: Record<StartupCategory, SectorMapping> = {
  // ── FINTECH (14) ──────────────────────────────────────────────────────
  fintech_payments: {
    label: 'Fintech — Payments',
    description: 'Payment gateways, UPI, wallets, payment infrastructure',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['fintech_lending', 'fintech_embedded'],
  },
  fintech_insurance: {
    label: 'Fintech — InsurTech',
    description: 'Insurance distribution, claims automation, parametric insurance',
    primary_damodaran: 'Insurance (General)',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_payments', 'fintech_wealthtech'],
  },
  fintech_banking: {
    label: 'Fintech — Neo-Banking',
    description: 'Digital banking, account aggregators, banking-as-a-service',
    primary_damodaran: 'Banks (Regional)',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_payments', 'fintech_lending'],
  },
  fintech_lending: {
    label: 'Fintech — Lending & BNPL',
    description: 'Digital lending, BNPL, credit platforms',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Banks (Regional)',
    adjacent_sectors: ['fintech_payments', 'fintech_credit_scoring'],
  },
  fintech_wealthtech: {
    label: 'Fintech — WealthTech',
    description: 'Robo-advisory, investment platforms, portfolio management',
    primary_damodaran: 'Investments & Asset Management',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_neobroking', 'fintech_insurance'],
  },
  fintech_accounting: {
    label: 'Fintech — Accounting & Invoicing',
    description: 'Accounting software, GST filing, invoicing platforms',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['b2b_accounting', 'fintech_payments'],
  },
  fintech_credit_scoring: {
    label: 'Fintech — Credit Scoring',
    description: 'Alternative credit scoring, underwriting, risk analytics',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['fintech_lending', 'fintech_banking'],
  },
  fintech_remittance: {
    label: 'Fintech — Remittance',
    description: 'Cross-border payments, forex, international transfers',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Banks (Regional)',
    adjacent_sectors: ['fintech_payments', 'fintech_embedded'],
  },
  fintech_embedded: {
    label: 'Fintech — Embedded Finance',
    description: 'Embedded lending, insurance, payments within platforms',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['fintech_payments', 'saas_horizontal'],
  },
  fintech_neobroking: {
    label: 'Fintech — Neo-Broking',
    description: 'Discount broking, stock trading, mutual fund platforms',
    primary_damodaran: 'Investments & Asset Management',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_wealthtech', 'fintech_banking'],
  },
  fintech_regtech: {
    label: 'Fintech — RegTech',
    description: 'Regulatory compliance, KYC/AML, reporting automation',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['fintech_banking', 'legaltech_compliance'],
  },
  fintech_open_banking: {
    label: 'Fintech — Open Banking',
    description: 'Account aggregation, open APIs, data sharing platforms',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['fintech_banking', 'fintech_embedded'],
  },
  fintech_microfinance: {
    label: 'Fintech — Microfinance',
    description: 'Micro-lending, SHG digitization, rural credit',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Banks (Regional)',
    adjacent_sectors: ['fintech_lending', 'fintech_credit_scoring'],
  },
  fintech_collections: {
    label: 'Fintech — Collections',
    description: 'Debt collection, recovery automation, NPA management',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['fintech_lending', 'fintech_credit_scoring'],
  },

  // ── HEALTHTECH (10) ───────────────────────────────────────────────────
  healthtech_products: {
    label: 'HealthTech — Products & Devices',
    description: 'MedTech, diagnostics, health devices',
    primary_damodaran: 'Healthcare Products',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['healthtech_diagnostics', 'healthtech_services'],
  },
  healthtech_services: {
    label: 'HealthTech — Services & Platforms',
    description: 'Telemedicine, hospital tech, pharmacy',
    primary_damodaran: 'Healthcare Support Services',
    secondary_damodaran: 'Hospitals/Healthcare Facilities',
    adjacent_sectors: ['healthtech_products', 'healthtech_hospital_mgmt'],
  },
  healthtech_mental: {
    label: 'HealthTech — Mental Health',
    description: 'Mental health platforms, therapy apps, wellness',
    primary_damodaran: 'Healthcare Support Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['healthtech_services', 'healthtech_fitness'],
  },
  healthtech_fitness: {
    label: 'HealthTech — Fitness & Wellness',
    description: 'Fitness apps, wellness platforms, wearables',
    primary_damodaran: 'Healthcare Products',
    secondary_damodaran: 'Recreation',
    adjacent_sectors: ['sportstech_fitness', 'healthtech_mental'],
  },
  healthtech_pharma: {
    label: 'HealthTech — Pharmacy & Distribution',
    description: 'Online pharmacy, drug distribution, e-pharmacy',
    primary_damodaran: 'Drugs (Pharmaceutical)',
    secondary_damodaran: 'Healthcare Support Services',
    adjacent_sectors: ['healthtech_services', 'ecommerce_general'],
  },
  healthtech_genomics: {
    label: 'HealthTech — Genomics & Precision Medicine',
    description: 'Genomics, personalized medicine, genetic testing',
    primary_damodaran: 'Drugs (Biotechnology)',
    secondary_damodaran: 'Healthcare Products',
    adjacent_sectors: ['biotech_genomics', 'healthtech_diagnostics'],
  },
  healthtech_hospital_mgmt: {
    label: 'HealthTech — Hospital Management',
    description: 'Hospital information systems, OPD/IPD management',
    primary_damodaran: 'Hospitals/Healthcare Facilities',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['healthtech_services', 'saas_vertical'],
  },
  healthtech_elderly: {
    label: 'HealthTech — Elderly Care',
    description: 'Senior care platforms, geriatric health tech',
    primary_damodaran: 'Healthcare Support Services',
    secondary_damodaran: 'Hospitals/Healthcare Facilities',
    adjacent_sectors: ['eldercare', 'healthtech_services'],
  },
  healthtech_fertility: {
    label: 'HealthTech — Fertility & Reproductive',
    description: 'Fertility clinics tech, reproductive health platforms',
    primary_damodaran: 'Healthcare Support Services',
    secondary_damodaran: 'Hospitals/Healthcare Facilities',
    adjacent_sectors: ['healthtech_services', 'healthtech_diagnostics'],
  },
  healthtech_diagnostics: {
    label: 'HealthTech — Diagnostics',
    description: 'Diagnostic labs, pathology, imaging, point-of-care testing',
    primary_damodaran: 'Healthcare Products',
    secondary_damodaran: 'Healthcare Support Services',
    adjacent_sectors: ['healthtech_products', 'healthtech_services'],
  },

  // ── EDTECH (9) ────────────────────────────────────────────────────────
  edtech_k12: {
    label: 'EdTech — K-12',
    description: 'School learning, K-12 curriculum, student management',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['edtech_early_childhood', 'edtech_test_prep'],
  },
  edtech_higher_ed: {
    label: 'EdTech — Higher Education',
    description: 'University platforms, online degrees, MOOCs',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['edtech_upskilling', 'edtech_study_abroad'],
  },
  edtech_test_prep: {
    label: 'EdTech — Test Prep',
    description: 'Competitive exam prep, mock tests, coaching',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['edtech_k12', 'edtech_higher_ed'],
  },
  edtech_upskilling: {
    label: 'EdTech — Upskilling & Reskilling',
    description: 'Professional courses, skill development, bootcamps',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['edtech_coding', 'edtech_corporate'],
  },
  edtech_language: {
    label: 'EdTech — Language Learning',
    description: 'Language apps, vernacular education, translation',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['edtech_k12', 'edtech_upskilling'],
  },
  edtech_coding: {
    label: 'EdTech — Coding & STEM',
    description: 'Coding bootcamps, STEM education, robotics for kids',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['edtech_upskilling', 'edtech_k12'],
  },
  edtech_corporate: {
    label: 'EdTech — Corporate Training',
    description: 'LMS, corporate L&D, compliance training',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['edtech_upskilling', 'saas_horizontal'],
  },
  edtech_early_childhood: {
    label: 'EdTech — Early Childhood',
    description: 'Preschool tech, early learning, parent-child platforms',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['edtech_k12', 'childcare'],
  },
  edtech_study_abroad: {
    label: 'EdTech — Study Abroad',
    description: 'Overseas education consulting, visa, university admissions',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['edtech_higher_ed', 'edtech_test_prep'],
  },

  // ── ECOMMERCE (9) ────────────────────────────────────────────────────
  ecommerce_general: {
    label: 'E-commerce — General',
    description: 'Online retail, quick commerce, horizontal marketplaces',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['ecommerce_fashion', 'ecommerce_electronics'],
  },
  ecommerce_grocery: {
    label: 'E-commerce — Grocery',
    description: 'Online grocery, quick grocery delivery',
    primary_damodaran: 'Retail (Grocery and Food)',
    secondary_damodaran: 'Food Wholesalers',
    adjacent_sectors: ['ecommerce_general', 'foodtech_delivery'],
  },
  ecommerce_fashion: {
    label: 'E-commerce — Fashion',
    description: 'Online fashion, apparel marketplace, lifestyle',
    primary_damodaran: 'Retail (Special Lines)',
    secondary_damodaran: 'Apparel',
    adjacent_sectors: ['ecommerce_general', 'ecommerce_luxury'],
  },
  ecommerce_electronics: {
    label: 'E-commerce — Electronics',
    description: 'Electronics retail, gadget marketplace, refurbished devices',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['ecommerce_general', 'ecommerce_recommerce'],
  },
  ecommerce_luxury: {
    label: 'E-commerce — Luxury',
    description: 'Luxury goods, premium brands, authenticated resale',
    primary_damodaran: 'Retail (Special Lines)',
    secondary_damodaran: 'Apparel',
    adjacent_sectors: ['ecommerce_fashion', 'ecommerce_general'],
  },
  ecommerce_beauty: {
    label: 'E-commerce — Beauty & Personal Care',
    description: 'Beauty marketplace, cosmetics, skincare e-commerce',
    primary_damodaran: 'Household Products',
    secondary_damodaran: 'Retail (Special Lines)',
    adjacent_sectors: ['beauty_tech', 'ecommerce_fashion'],
  },
  ecommerce_furniture: {
    label: 'E-commerce — Furniture & Home',
    description: 'Furniture, home decor, interior design marketplace',
    primary_damodaran: 'Retail (Special Lines)',
    secondary_damodaran: 'Retail (General)',
    adjacent_sectors: ['ecommerce_general', 'proptech_rental'],
  },
  ecommerce_b2b: {
    label: 'E-commerce — B2B',
    description: 'B2B marketplace, wholesale, industrial procurement',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['b2b_procurement', 'ecommerce_general'],
  },
  ecommerce_recommerce: {
    label: 'E-commerce — ReCommerce',
    description: 'Resale, refurbished goods, circular marketplace',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Environmental & Waste Services',
    adjacent_sectors: ['ecommerce_general', 'circular_economy'],
  },

  // ── SAAS (10) ─────────────────────────────────────────────────────────
  saas_horizontal: {
    label: 'SaaS — Horizontal',
    description: 'CRM, ERP, project management, productivity tools',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['saas_collaboration', 'saas_analytics'],
  },
  saas_vertical: {
    label: 'SaaS — Vertical',
    description: 'Industry-specific SaaS for healthcare, legal, real estate',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['saas_horizontal', 'saas_devtools'],
  },
  saas_devtools: {
    label: 'SaaS — DevTools',
    description: 'Developer tools, CI/CD, code collaboration, APIs',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['saas_horizontal', 'ai_mlops'],
  },
  saas_martech: {
    label: 'SaaS — MarTech',
    description: 'Marketing automation, email, SEO, CRM marketing',
    primary_damodaran: 'Software (Internet)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['saas_salestech', 'media_adtech'],
  },
  saas_salestech: {
    label: 'SaaS — SalesTech',
    description: 'Sales enablement, CRM, revenue intelligence',
    primary_damodaran: 'Software (Internet)',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['saas_martech', 'saas_horizontal'],
  },
  saas_collaboration: {
    label: 'SaaS — Collaboration',
    description: 'Team collaboration, video conferencing, whiteboarding',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['saas_communication', 'saas_horizontal'],
  },
  saas_security: {
    label: 'SaaS — Security',
    description: 'Cloud security, IAM, compliance-as-a-service',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['cybersecurity_cloud_sec', 'saas_devtools'],
  },
  saas_analytics: {
    label: 'SaaS — Analytics',
    description: 'Business intelligence, data visualization, dashboards',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['ai_data_analytics', 'saas_horizontal'],
  },
  saas_nocode: {
    label: 'SaaS — No-Code / Low-Code',
    description: 'No-code builders, low-code platforms, workflow automation',
    primary_damodaran: 'Software (Internet)',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['saas_devtools', 'saas_horizontal'],
  },
  saas_communication: {
    label: 'SaaS — Communication',
    description: 'CPaaS, messaging APIs, notification platforms',
    primary_damodaran: 'Software (Internet)',
    secondary_damodaran: 'Telecom Services',
    adjacent_sectors: ['saas_collaboration', 'telecom'],
  },

  // ── FOODTECH (6) ──────────────────────────────────────────────────────
  foodtech_delivery: {
    label: 'FoodTech — Delivery',
    description: 'Food delivery, aggregators, hyperlocal food',
    primary_damodaran: 'Restaurant/Dining',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['foodtech_cloud_kitchen', 'ecommerce_grocery'],
  },
  foodtech_cloud_kitchen: {
    label: 'FoodTech — Cloud Kitchen',
    description: 'Cloud kitchens, virtual restaurants, ghost kitchens',
    primary_damodaran: 'Restaurant/Dining',
    secondary_damodaran: 'Food Processing',
    adjacent_sectors: ['foodtech_delivery', 'foodtech_restaurant'],
  },
  foodtech_processing: {
    label: 'FoodTech — Processing & Packaging',
    description: 'Food processing tech, packaging innovation, cold press',
    primary_damodaran: 'Food Processing',
    secondary_damodaran: 'Packaging & Container',
    adjacent_sectors: ['foodtech_nutrition', 'agritech_post_harvest'],
  },
  foodtech_beverages: {
    label: 'FoodTech — Beverages',
    description: 'Beverage brands, craft drinks, functional beverages',
    primary_damodaran: 'Beverage (Soft)',
    secondary_damodaran: 'Beverage (Alcoholic)',
    adjacent_sectors: ['foodtech_nutrition', 'foodtech_processing'],
  },
  foodtech_nutrition: {
    label: 'FoodTech — Nutrition & Health Food',
    description: 'Nutrition brands, supplements, health food D2C',
    primary_damodaran: 'Food Processing',
    secondary_damodaran: 'Healthcare Products',
    adjacent_sectors: ['foodtech_beverages', 'healthtech_fitness'],
  },
  foodtech_restaurant: {
    label: 'FoodTech — Restaurant Tech',
    description: 'Restaurant management, POS, table booking, kitchen OS',
    primary_damodaran: 'Restaurant/Dining',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['foodtech_delivery', 'foodtech_cloud_kitchen'],
  },

  // ── LOGISTICS (6) ────────────────────────────────────────────────────
  logistics_last_mile: {
    label: 'Logistics — Last Mile',
    description: 'Last-mile delivery, hyperlocal logistics, courier',
    primary_damodaran: 'Transportation',
    secondary_damodaran: 'Trucking',
    adjacent_sectors: ['logistics_warehousing', 'ecommerce_general'],
  },
  logistics_warehousing: {
    label: 'Logistics — Warehousing',
    description: 'Warehousing, fulfillment centers, inventory management',
    primary_damodaran: 'Transportation',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['logistics_last_mile', 'logistics_3pl'],
  },
  logistics_cold_chain: {
    label: 'Logistics — Cold Chain',
    description: 'Cold storage, temperature-controlled logistics',
    primary_damodaran: 'Transportation',
    secondary_damodaran: 'Food Wholesalers',
    adjacent_sectors: ['logistics_warehousing', 'foodtech_processing'],
  },
  logistics_freight: {
    label: 'Logistics — Freight & Trucking',
    description: 'Full truck load, freight marketplace, fleet management',
    primary_damodaran: 'Trucking',
    secondary_damodaran: 'Transportation',
    adjacent_sectors: ['logistics_3pl', 'auto_fleet'],
  },
  logistics_reverse: {
    label: 'Logistics — Reverse Logistics',
    description: 'Returns management, reverse supply chain',
    primary_damodaran: 'Transportation',
    secondary_damodaran: 'Environmental & Waste Services',
    adjacent_sectors: ['logistics_last_mile', 'ecommerce_recommerce'],
  },
  logistics_3pl: {
    label: 'Logistics — 3PL',
    description: 'Third-party logistics, supply chain orchestration',
    primary_damodaran: 'Transportation',
    secondary_damodaran: 'Trucking',
    adjacent_sectors: ['logistics_warehousing', 'logistics_freight'],
  },

  // ── CLEANTECH (8) ────────────────────────────────────────────────────
  cleantech_solar: {
    label: 'CleanTech — Solar',
    description: 'Solar energy, rooftop solar, solar marketplace',
    primary_damodaran: 'Green & Renewable Energy',
    secondary_damodaran: 'Power',
    adjacent_sectors: ['cleantech_battery', 'cleantech_hydrogen'],
  },
  cleantech_ev: {
    label: 'CleanTech — EV Infrastructure',
    description: 'EV charging, battery swapping, EV fleet management',
    primary_damodaran: 'Green & Renewable Energy',
    secondary_damodaran: 'Auto & Truck',
    adjacent_sectors: ['auto_ev', 'cleantech_battery'],
  },
  cleantech_battery: {
    label: 'CleanTech — Battery & Storage',
    description: 'Battery tech, energy storage, solid-state batteries',
    primary_damodaran: 'Green & Renewable Energy',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['cleantech_ev', 'cleantech_solar'],
  },
  cleantech_waste: {
    label: 'CleanTech — Waste Management',
    description: 'Waste recycling, waste-to-energy, circular economy',
    primary_damodaran: 'Environmental & Waste Services',
    secondary_damodaran: 'Green & Renewable Energy',
    adjacent_sectors: ['circular_economy', 'cleantech_carbon'],
  },
  cleantech_carbon: {
    label: 'CleanTech — Carbon & Climate',
    description: 'Carbon credits, carbon capture, climate analytics',
    primary_damodaran: 'Green & Renewable Energy',
    secondary_damodaran: 'Environmental & Waste Services',
    adjacent_sectors: ['cleantech_waste', 'cleantech_solar'],
  },
  cleantech_water: {
    label: 'CleanTech — Water Tech',
    description: 'Water purification, wastewater, water management',
    primary_damodaran: 'Environmental & Waste Services',
    secondary_damodaran: 'Green & Renewable Energy',
    adjacent_sectors: ['cleantech_waste', 'cleantech_carbon'],
  },
  cleantech_hydrogen: {
    label: 'CleanTech — Hydrogen',
    description: 'Green hydrogen, hydrogen fuel cells, electrolyzers',
    primary_damodaran: 'Green & Renewable Energy',
    secondary_damodaran: 'Power',
    adjacent_sectors: ['cleantech_solar', 'cleantech_battery'],
  },
  cleantech_biomass: {
    label: 'CleanTech — Biomass & Bioenergy',
    description: 'Biomass energy, biofuels, biogas, pellet manufacturing',
    primary_damodaran: 'Green & Renewable Energy',
    secondary_damodaran: 'Power',
    adjacent_sectors: ['cleantech_waste', 'agritech_post_harvest'],
  },

  // ── AI_ML (6) ─────────────────────────────────────────────────────────
  ai_conversational: {
    label: 'AI — Conversational AI',
    description: 'Chatbots, voice assistants, conversational platforms',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['ai_genai', 'saas_communication'],
  },
  ai_computer_vision: {
    label: 'AI — Computer Vision',
    description: 'Image recognition, video analytics, OCR',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['ai_genai', 'deeptech_robotics'],
  },
  ai_genai: {
    label: 'AI — Generative AI',
    description: 'LLMs, text generation, image generation, AI copilots',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['ai_conversational', 'ai_enterprise'],
  },
  ai_data_analytics: {
    label: 'AI — Data Analytics',
    description: 'AI-powered analytics, predictive models, data platforms',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['saas_analytics', 'ai_mlops'],
  },
  ai_mlops: {
    label: 'AI — MLOps',
    description: 'ML pipelines, model deployment, experiment tracking',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['ai_data_analytics', 'saas_devtools'],
  },
  ai_enterprise: {
    label: 'AI — Enterprise AI',
    description: 'Enterprise AI solutions, automation, decision intelligence',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['ai_genai', 'saas_horizontal'],
  },

  // ── DEEPTECH (6) ──────────────────────────────────────────────────────
  deeptech_robotics: {
    label: 'DeepTech — Robotics',
    description: 'Industrial robots, service robots, autonomous systems',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Machinery',
    adjacent_sectors: ['deeptech_iot', 'manufacturing_smart'],
  },
  deeptech_quantum: {
    label: 'DeepTech — Quantum Computing',
    description: 'Quantum algorithms, quantum hardware, quantum-as-a-service',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['deeptech_semiconductor', 'ai_enterprise'],
  },
  deeptech_semiconductor: {
    label: 'DeepTech — Semiconductor',
    description: 'Chip design, VLSI, fabless semiconductor',
    primary_damodaran: 'Electronics (General)',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['deeptech_iot', 'deeptech_quantum'],
  },
  deeptech_iot: {
    label: 'DeepTech — IoT',
    description: 'IoT platforms, connected devices, edge computing',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['deeptech_robotics', 'deeptech_semiconductor'],
  },
  deeptech_ar_vr: {
    label: 'DeepTech — AR/VR',
    description: 'Augmented reality, virtual reality, mixed reality',
    primary_damodaran: 'Software (Entertainment)',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['gaming_mobile', 'deeptech_iot'],
  },
  deeptech_nanotech: {
    label: 'DeepTech — Nanotechnology',
    description: 'Nanomaterials, nano-manufacturing, nano-medicine',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['deeptech_semiconductor', 'biotech_pharma'],
  },

  // ── AGRITECH (5) ──────────────────────────────────────────────────────
  agritech_precision: {
    label: 'AgriTech — Precision Farming',
    description: 'Precision agriculture, farm sensors, drone spraying',
    primary_damodaran: 'Farming/Agriculture',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['agritech_input', 'agritech_marketplace'],
  },
  agritech_marketplace: {
    label: 'AgriTech — Marketplace',
    description: 'Farm-to-fork marketplace, mandi platform, agri e-commerce',
    primary_damodaran: 'Farming/Agriculture',
    secondary_damodaran: 'Food Wholesalers',
    adjacent_sectors: ['agritech_precision', 'agritech_post_harvest'],
  },
  agritech_input: {
    label: 'AgriTech — Inputs & Advisory',
    description: 'Seeds, fertilizers, crop advisory, agri-inputs marketplace',
    primary_damodaran: 'Farming/Agriculture',
    secondary_damodaran: 'Food Processing',
    adjacent_sectors: ['agritech_precision', 'agritech_marketplace'],
  },
  agritech_post_harvest: {
    label: 'AgriTech — Post-Harvest & Storage',
    description: 'Cold storage, post-harvest processing, food supply chain',
    primary_damodaran: 'Farming/Agriculture',
    secondary_damodaran: 'Food Processing',
    adjacent_sectors: ['agritech_marketplace', 'logistics_cold_chain'],
  },
  agritech_dairy: {
    label: 'AgriTech — Dairy & Animal Husbandry',
    description: 'Dairy tech, cattle management, aquaculture',
    primary_damodaran: 'Farming/Agriculture',
    secondary_damodaran: 'Food Processing',
    adjacent_sectors: ['agritech_input', 'agritech_marketplace'],
  },

  // ── PROPTECH (5) ──────────────────────────────────────────────────────
  proptech_rental: {
    label: 'PropTech — Rental & Brokerage',
    description: 'Rental platforms, brokerage tech, tenant management',
    primary_damodaran: 'Real Estate (Operations & Services)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['proptech_commercial', 'proptech_facility'],
  },
  proptech_construction: {
    label: 'PropTech — Construction Tech',
    description: 'Construction management, BIM, site monitoring',
    primary_damodaran: 'Real Estate (Development)',
    secondary_damodaran: 'Engineering/Construction',
    adjacent_sectors: ['proptech_facility', 'manufacturing_smart'],
  },
  proptech_coworking: {
    label: 'PropTech — Coworking',
    description: 'Coworking spaces, flexible office, managed offices',
    primary_damodaran: 'Real Estate (Operations & Services)',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['proptech_commercial', 'proptech_rental'],
  },
  proptech_facility: {
    label: 'PropTech — Facility Management',
    description: 'Facility management, building automation, maintenance',
    primary_damodaran: 'Real Estate (Operations & Services)',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['proptech_construction', 'proptech_coworking'],
  },
  proptech_commercial: {
    label: 'PropTech — Commercial Real Estate',
    description: 'Commercial leasing, office space platforms, CRE analytics',
    primary_damodaran: 'Real Estate (Operations & Services)',
    secondary_damodaran: 'Real Estate (Development)',
    adjacent_sectors: ['proptech_rental', 'proptech_coworking'],
  },

  // ── AUTO (5) ──────────────────────────────────────────────────────────
  auto_ev: {
    label: 'Auto — Electric Vehicles',
    description: 'EV manufacturing, electric two-wheelers, EV platforms',
    primary_damodaran: 'Auto & Truck',
    secondary_damodaran: 'Green & Renewable Energy',
    adjacent_sectors: ['cleantech_ev', 'auto_connected'],
  },
  auto_fleet: {
    label: 'Auto — Fleet Management',
    description: 'Fleet tracking, telematics, fleet optimization',
    primary_damodaran: 'Auto & Truck',
    secondary_damodaran: 'Transportation',
    adjacent_sectors: ['logistics_freight', 'auto_connected'],
  },
  auto_ride_hailing: {
    label: 'Auto — Ride Hailing & Mobility',
    description: 'Ride-sharing, cab aggregators, micro-mobility',
    primary_damodaran: 'Auto & Truck',
    secondary_damodaran: 'Transportation',
    adjacent_sectors: ['auto_fleet', 'logistics_last_mile'],
  },
  auto_parts: {
    label: 'Auto — Parts & Aftermarket',
    description: 'Auto parts marketplace, aftermarket, car services',
    primary_damodaran: 'Auto Parts',
    secondary_damodaran: 'Retail (Special Lines)',
    adjacent_sectors: ['auto_connected', 'ecommerce_general'],
  },
  auto_connected: {
    label: 'Auto — Connected Vehicles',
    description: 'Connected car, ADAS, vehicle-to-everything (V2X)',
    primary_damodaran: 'Auto & Truck',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['auto_ev', 'deeptech_iot'],
  },

  // ── MEDIA (5) ─────────────────────────────────────────────────────────
  media_ott: {
    label: 'Media — OTT & Streaming',
    description: 'Video streaming, OTT platforms, audio streaming',
    primary_damodaran: 'Broadcasting',
    secondary_damodaran: 'Entertainment',
    adjacent_sectors: ['media_creator', 'gaming_mobile'],
  },
  media_creator: {
    label: 'Media — Creator Economy',
    description: 'Creator platforms, influencer tools, fan engagement',
    primary_damodaran: 'Publishing & Newspapers',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['media_ott', 'media_adtech'],
  },
  media_adtech: {
    label: 'Media — AdTech',
    description: 'Programmatic advertising, ad networks, attribution',
    primary_damodaran: 'Publishing & Newspapers',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['saas_martech', 'media_creator'],
  },
  media_news: {
    label: 'Media — News & Content',
    description: 'Digital news, content aggregation, media tech',
    primary_damodaran: 'Publishing & Newspapers',
    secondary_damodaran: 'Broadcasting',
    adjacent_sectors: ['media_creator', 'media_podcast'],
  },
  media_podcast: {
    label: 'Media — Podcast & Audio',
    description: 'Podcast platforms, audio content, vernacular audio',
    primary_damodaran: 'Broadcasting',
    secondary_damodaran: 'Entertainment',
    adjacent_sectors: ['media_news', 'media_ott'],
  },

  // ── GAMING (4) ────────────────────────────────────────────────────────
  gaming_mobile: {
    label: 'Gaming — Mobile',
    description: 'Mobile gaming studios, hyper-casual, mid-core games',
    primary_damodaran: 'Software (Entertainment)',
    secondary_damodaran: 'Entertainment',
    adjacent_sectors: ['gaming_casual', 'gaming_esports'],
  },
  gaming_esports: {
    label: 'Gaming — Esports',
    description: 'Esports platforms, tournaments, competitive gaming',
    primary_damodaran: 'Entertainment',
    secondary_damodaran: 'Software (Entertainment)',
    adjacent_sectors: ['gaming_mobile', 'gaming_fantasy'],
  },
  gaming_fantasy: {
    label: 'Gaming — Fantasy Sports',
    description: 'Fantasy sports, prediction platforms, skill-based gaming',
    primary_damodaran: 'Software (Entertainment)',
    secondary_damodaran: 'Entertainment',
    adjacent_sectors: ['gaming_esports', 'sportstech_analytics'],
  },
  gaming_casual: {
    label: 'Gaming — Casual & Social',
    description: 'Casual games, social gaming, puzzle & board games',
    primary_damodaran: 'Software (Entertainment)',
    secondary_damodaran: 'Entertainment',
    adjacent_sectors: ['gaming_mobile', 'deeptech_ar_vr'],
  },

  // ── TRAVEL (4) ────────────────────────────────────────────────────────
  travel_booking: {
    label: 'Travel — Booking & Aggregation',
    description: 'Travel booking, OTA, flight & hotel aggregators',
    primary_damodaran: 'Hotel/Gaming',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['travel_experiences', 'travel_business'],
  },
  travel_experiences: {
    label: 'Travel — Experiences & Tours',
    description: 'Activity booking, tours, local experiences',
    primary_damodaran: 'Recreation',
    secondary_damodaran: 'Hotel/Gaming',
    adjacent_sectors: ['travel_booking', 'travel_homestay'],
  },
  travel_homestay: {
    label: 'Travel — Homestay & Alternate Stays',
    description: 'Homestays, vacation rentals, alternative accommodation',
    primary_damodaran: 'Hotel/Gaming',
    secondary_damodaran: 'Real Estate (Operations & Services)',
    adjacent_sectors: ['travel_booking', 'proptech_rental'],
  },
  travel_business: {
    label: 'Travel — Business Travel',
    description: 'Corporate travel management, expense management',
    primary_damodaran: 'Hotel/Gaming',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['travel_booking', 'b2b_consulting'],
  },

  // ── MANUFACTURING (5) ────────────────────────────────────────────────
  manufacturing_3d: {
    label: 'Manufacturing — 3D Printing',
    description: '3D printing, additive manufacturing, rapid prototyping',
    primary_damodaran: 'Machinery',
    secondary_damodaran: 'Engineering/Construction',
    adjacent_sectors: ['manufacturing_smart', 'deeptech_robotics'],
  },
  manufacturing_smart: {
    label: 'Manufacturing — Smart Factory',
    description: 'Industry 4.0, smart factory, industrial automation',
    primary_damodaran: 'Machinery',
    secondary_damodaran: 'Engineering/Construction',
    adjacent_sectors: ['deeptech_iot', 'deeptech_robotics'],
  },
  manufacturing_textile: {
    label: 'Manufacturing — Textile',
    description: 'Textile manufacturing, garment tech, fabric innovation',
    primary_damodaran: 'Apparel',
    secondary_damodaran: 'Machinery',
    adjacent_sectors: ['ecommerce_fashion', 'manufacturing_smart'],
  },
  manufacturing_chemical: {
    label: 'Manufacturing — Chemical',
    description: 'Specialty chemicals, chemical processing, formulation',
    primary_damodaran: 'Chemical (Basic)',
    secondary_damodaran: 'Machinery',
    adjacent_sectors: ['manufacturing_smart', 'cleantech_water'],
  },
  manufacturing_electronics: {
    label: 'Manufacturing — Electronics',
    description: 'Electronics manufacturing, PCB, EMS, contract manufacturing',
    primary_damodaran: 'Electronics (General)',
    secondary_damodaran: 'Machinery',
    adjacent_sectors: ['deeptech_semiconductor', 'manufacturing_smart'],
  },

  // ── B2B (5) ───────────────────────────────────────────────────────────
  b2b_staffing: {
    label: 'B2B — Staffing & Workforce',
    description: 'Staffing platforms, temp workforce, blue-collar hiring',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['hrtech_recruitment', 'hrtech_gig'],
  },
  b2b_consulting: {
    label: 'B2B — Consulting & Professional Services',
    description: 'Consulting platforms, fractional CXO, advisory',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['b2b_staffing', 'b2b_outsourcing'],
  },
  b2b_procurement: {
    label: 'B2B — Procurement',
    description: 'Procurement platforms, vendor management, sourcing',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['ecommerce_b2b', 'b2b_accounting'],
  },
  b2b_accounting: {
    label: 'B2B — Accounting & Finance',
    description: 'Bookkeeping, CFO services, accounting platforms',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_accounting', 'b2b_consulting'],
  },
  b2b_outsourcing: {
    label: 'B2B — Outsourcing & BPO',
    description: 'Business process outsourcing, managed services',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['b2b_staffing', 'b2b_consulting'],
  },

  // ── LEGALTECH (3) ────────────────────────────────────────────────────
  legaltech_contracts: {
    label: 'LegalTech — Contracts',
    description: 'Contract management, CLM, e-signatures, legal docs',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['legaltech_compliance', 'saas_horizontal'],
  },
  legaltech_compliance: {
    label: 'LegalTech — Compliance',
    description: 'Regulatory compliance, audit tools, policy management',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['fintech_regtech', 'legaltech_contracts'],
  },
  legaltech_dispute: {
    label: 'LegalTech — Dispute Resolution',
    description: 'Online dispute resolution, arbitration platforms, legal AI',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['legaltech_contracts', 'legaltech_compliance'],
  },

  // ── HRTECH (4) ────────────────────────────────────────────────────────
  hrtech_recruitment: {
    label: 'HRTech — Recruitment',
    description: 'Job platforms, ATS, recruitment automation',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['b2b_staffing', 'hrtech_engagement'],
  },
  hrtech_payroll: {
    label: 'HRTech — Payroll & Benefits',
    description: 'Payroll automation, benefits administration, PF/ESI',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['hrtech_recruitment', 'fintech_accounting'],
  },
  hrtech_engagement: {
    label: 'HRTech — Employee Engagement',
    description: 'Employee engagement, rewards, culture platforms',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['hrtech_recruitment', 'hrtech_payroll'],
  },
  hrtech_gig: {
    label: 'HRTech — Gig & Freelance',
    description: 'Gig economy platforms, freelancer marketplaces',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['b2b_staffing', 'hrtech_recruitment'],
  },

  // ── CYBERSECURITY (3) ────────────────────────────────────────────────
  cybersecurity_identity: {
    label: 'Cybersecurity — Identity & Access',
    description: 'IAM, identity verification, authentication, SSO',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['cybersecurity_cloud_sec', 'saas_security'],
  },
  cybersecurity_threat: {
    label: 'Cybersecurity — Threat Detection',
    description: 'Threat intelligence, SIEM, SOC, endpoint security',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['cybersecurity_identity', 'cybersecurity_cloud_sec'],
  },
  cybersecurity_cloud_sec: {
    label: 'Cybersecurity — Cloud Security',
    description: 'Cloud security posture, CASB, container security',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['saas_security', 'cybersecurity_threat'],
  },

  // ── WEB3 (4) ──────────────────────────────────────────────────────────
  web3_defi: {
    label: 'Web3 — DeFi',
    description: 'Decentralized finance, DEX, lending protocols, yield',
    primary_damodaran: 'Software (Internet)',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['web3_infra', 'fintech_payments'],
  },
  web3_nft: {
    label: 'Web3 — NFT & Digital Assets',
    description: 'NFT marketplaces, digital collectibles, tokenization',
    primary_damodaran: 'Software (Internet)',
    secondary_damodaran: 'Entertainment',
    adjacent_sectors: ['web3_infra', 'media_creator'],
  },
  web3_infra: {
    label: 'Web3 — Infrastructure',
    description: 'Blockchain infra, nodes, wallets, cross-chain bridges',
    primary_damodaran: 'Software (Internet)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['web3_defi', 'web3_dao'],
  },
  web3_dao: {
    label: 'Web3 — DAO & Governance',
    description: 'DAOs, on-chain governance, community treasuries',
    primary_damodaran: 'Software (Internet)',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['web3_infra', 'web3_defi'],
  },

  // ── SPACETECH (3) ────────────────────────────────────────────────────
  spacetech_satellite: {
    label: 'SpaceTech — Satellite',
    description: 'Satellite manufacturing, small sats, satellite imagery',
    primary_damodaran: 'Aerospace/Defense',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['spacetech_data', 'spacetech_launch'],
  },
  spacetech_launch: {
    label: 'SpaceTech — Launch Vehicles',
    description: 'Launch vehicles, rockets, propulsion systems',
    primary_damodaran: 'Aerospace/Defense',
    secondary_damodaran: 'Engineering/Construction',
    adjacent_sectors: ['spacetech_satellite', 'drone_defense'],
  },
  spacetech_data: {
    label: 'SpaceTech — Space Data & Analytics',
    description: 'Earth observation, geospatial analytics, space data',
    primary_damodaran: 'Aerospace/Defense',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['spacetech_satellite', 'ai_data_analytics'],
  },

  // ── BIOTECH (4) ──────────────────────────────────────────────────────
  biotech_pharma: {
    label: 'BioTech — Pharma R&D',
    description: 'Drug discovery, novel molecules, pharma R&D platforms',
    primary_damodaran: 'Drugs (Pharmaceutical)',
    secondary_damodaran: 'Drugs (Biotechnology)',
    adjacent_sectors: ['biotech_clinical', 'biotech_genomics'],
  },
  biotech_genomics: {
    label: 'BioTech — Genomics',
    description: 'Genomics platforms, gene therapy, CRISPR applications',
    primary_damodaran: 'Drugs (Biotechnology)',
    secondary_damodaran: 'Healthcare Products',
    adjacent_sectors: ['healthtech_genomics', 'biotech_pharma'],
  },
  biotech_clinical: {
    label: 'BioTech — Clinical Trials',
    description: 'Clinical trial management, patient recruitment, CRO tech',
    primary_damodaran: 'Drugs (Pharmaceutical)',
    secondary_damodaran: 'Healthcare Support Services',
    adjacent_sectors: ['biotech_pharma', 'healthtech_services'],
  },
  biotech_agri: {
    label: 'BioTech — Agriculture BioTech',
    description: 'Crop biotech, seed innovation, bio-pesticides',
    primary_damodaran: 'Drugs (Biotechnology)',
    secondary_damodaran: 'Farming/Agriculture',
    adjacent_sectors: ['agritech_input', 'agritech_precision'],
  },

  // ── DRONE (2) ─────────────────────────────────────────────────────────
  drone_commercial: {
    label: 'Drone — Commercial',
    description: 'Commercial drones, surveying, delivery, agriculture drones',
    primary_damodaran: 'Aerospace/Defense',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['agritech_precision', 'logistics_last_mile'],
  },
  drone_defense: {
    label: 'Drone — Defense',
    description: 'Defense drones, UAV platforms, counter-drone systems',
    primary_damodaran: 'Aerospace/Defense',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['spacetech_launch', 'drone_commercial'],
  },

  // ── RETAIL (3) ────────────────────────────────────────────────────────
  retail_pos: {
    label: 'Retail — POS & Billing',
    description: 'Point-of-sale, billing software, retail management',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['retail_analytics', 'retail_omnichannel'],
  },
  retail_analytics: {
    label: 'Retail — Analytics',
    description: 'Retail analytics, demand forecasting, shelf intelligence',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['retail_pos', 'saas_analytics'],
  },
  retail_omnichannel: {
    label: 'Retail — Omnichannel',
    description: 'Omnichannel commerce, O2O, unified commerce platforms',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['retail_pos', 'ecommerce_general'],
  },

  // ── SPORTSTECH (3) ───────────────────────────────────────────────────
  sportstech_analytics: {
    label: 'SportsTech — Analytics',
    description: 'Sports analytics, performance tracking, team analytics',
    primary_damodaran: 'Recreation',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['sportstech_fitness', 'gaming_fantasy'],
  },
  sportstech_fitness: {
    label: 'SportsTech — Fitness',
    description: 'Fitness platforms, gym management, home fitness',
    primary_damodaran: 'Recreation',
    secondary_damodaran: 'Healthcare Products',
    adjacent_sectors: ['healthtech_fitness', 'sportstech_wearables'],
  },
  sportstech_wearables: {
    label: 'SportsTech — Wearables',
    description: 'Fitness wearables, smart watches, performance trackers',
    primary_damodaran: 'Recreation',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['sportstech_fitness', 'deeptech_iot'],
  },

  // ── STANDALONE (15) ──────────────────────────────────────────────────
  pet_care: {
    label: 'Pet Care & Animal Health',
    description: 'Pet care services, animal health, vet-tech',
    primary_damodaran: 'Healthcare Products',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['healthtech_services', 'ecommerce_general'],
  },
  social_impact: {
    label: 'Social Impact',
    description: 'Impact investing, social enterprises, non-profit tech',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Environmental & Waste Services',
    adjacent_sectors: ['cleantech_carbon', 'edtech_k12'],
  },
  telecom: {
    label: 'Telecom & Connectivity',
    description: 'Telecom services, ISP, connectivity solutions',
    primary_damodaran: 'Telecom Services',
    secondary_damodaran: 'Telecom Equipment',
    adjacent_sectors: ['deeptech_iot', 'saas_communication'],
  },
  wedding_tech: {
    label: 'Wedding Tech',
    description: 'Wedding planning, venue booking, wedding services marketplace',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['event_tech', 'marketplace'],
  },
  beauty_tech: {
    label: 'Beauty Tech',
    description: 'Beauty-tech, AR try-on, personalized beauty, salon platforms',
    primary_damodaran: 'Household Products',
    secondary_damodaran: 'Retail (Special Lines)',
    adjacent_sectors: ['ecommerce_beauty', 'home_services'],
  },
  govtech: {
    label: 'GovTech',
    description: 'Government technology, civic tech, public sector digitization',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['legaltech_compliance', 'saas_vertical'],
  },
  event_tech: {
    label: 'Event Tech',
    description: 'Event management, ticketing, virtual events, venue tech',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Entertainment',
    adjacent_sectors: ['wedding_tech', 'travel_experiences'],
  },
  home_services: {
    label: 'Home Services',
    description: 'Home services marketplace, plumbing, cleaning, repairs',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['marketplace', 'proptech_facility'],
  },
  personal_finance: {
    label: 'Personal Finance',
    description: 'Budgeting apps, expense tracking, financial literacy',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['fintech_wealthtech', 'fintech_banking'],
  },
  circular_economy: {
    label: 'Circular Economy',
    description: 'Recycling, upcycling, sustainable commerce, waste reduction',
    primary_damodaran: 'Environmental & Waste Services',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['cleantech_waste', 'ecommerce_recommerce'],
  },
  eldercare: {
    label: 'Eldercare',
    description: 'Senior care services, assisted living, elder-tech',
    primary_damodaran: 'Healthcare Support Services',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['healthtech_elderly', 'home_services'],
  },
  childcare: {
    label: 'Childcare',
    description: 'Childcare platforms, daycare management, parenting apps',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Education',
    adjacent_sectors: ['edtech_early_childhood', 'healthtech_services'],
  },
  marketplace: {
    label: 'Marketplace / Platform',
    description: 'Horizontal and vertical marketplaces, aggregators',
    primary_damodaran: 'Information Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['ecommerce_general', 'home_services'],
  },
  insurance_distribution: {
    label: 'Insurance Distribution',
    description: 'Insurance aggregators, InsurTech distribution, policy platforms',
    primary_damodaran: 'Insurance (General)',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_insurance', 'fintech_embedded'],
  },
  other: {
    label: 'Other',
    description: 'Other industry not listed',
    primary_damodaran: 'Total Market',
    secondary_damodaran: null,
    adjacent_sectors: [],
  },
}

const FALLBACK_BENCHMARK: DamodaranBenchmark = damodaranData['Total Market'] ?? {
  ev_revenue: 3.0,
  ev_ebitda: 15.0,
  wacc: 0.12,
  beta: 1.0,
  gross_margin: 0.40,
}

export function getSectorLabel(category: StartupCategory): string {
  return SECTOR_MAPPING[category]?.label ?? 'Other'
}

export function getAdjacentSectors(category: StartupCategory): string[] {
  return SECTOR_MAPPING[category]?.adjacent_sectors ?? []
}

export function getDamodaranBenchmark(category: StartupCategory): DamodaranBenchmark {
  const mapping = SECTOR_MAPPING[category]
  if (!mapping) {
    return FALLBACK_BENCHMARK
  }

  const primary = damodaranData[mapping.primary_damodaran]

  if (!primary) {
    return FALLBACK_BENCHMARK
  }

  // If primary has null fields and secondary exists, fill from secondary
  if (mapping.secondary_damodaran) {
    const secondary = damodaranData[mapping.secondary_damodaran]
    if (secondary) {
      return {
        ev_revenue: primary.ev_revenue ?? secondary.ev_revenue,
        ev_ebitda: primary.ev_ebitda ?? secondary.ev_ebitda,
        wacc: primary.wacc ?? secondary.wacc,
        beta: primary.beta ?? secondary.beta,
        gross_margin: primary.gross_margin ?? secondary.gross_margin,
      }
    }
  }

  return primary
}
