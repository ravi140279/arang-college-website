/**
 * One-time migration script: extracts data from site-data.ts into JSON files.
 * Run with: node scripts/migrate-data.mjs
 */
import fs from "node:fs";

fs.mkdirSync("data", { recursive: true });

const officialSite = "https://govpgcollarang.cgstate.gov.in";

const pages = {
  "about-us": {
    slug: "about-us", title: "About Us", heroTag: "Institution Profile", type: "text",
    intro: "Established in 1965, the institution serves Arts, Commerce, and Science learners from Arang and nearby rural communities.",
    content: [
      "Govt. Badri Prasad Arts, Commerce and Science College Arang is named after Late Shri Badri Prasad Garudik.",
      "Smt. Maniyara Bai Garudik donated nearly 2.20 acres to establish higher education access in the region.",
      "The college is located near National Highway 53, around 35 km from Raipur, and affiliated to Pt. Ravishankar Shukla University.",
    ],
  },
  vision: {
    slug: "vision", title: "Vision", heroTag: "Value-Centered Learning", type: "text",
    intro: "To establish the college as a center of excellence through quality education that integrates knowledge, skill, and values.",
    content: [
      "Build an academic environment that supports curiosity, innovation, and responsible citizenship.",
      "Promote holistic growth through ethics, character, and social sensitivity.",
      "Prepare graduates to contribute meaningfully to society and nation building.",
    ],
  },
  mission: {
    slug: "mission", title: "Mission", heroTag: "Rural Education Commitment", type: "text",
    intro: "Mission statements are aligned with the citizen charter and regional educational needs.",
    content: [
      "Provide undergraduate and postgraduate education in Arts, Commerce, and Science streams.",
      "Support students from nearby villages and socio-economically underserved backgrounds.",
      "Promote sports, physical education, and personality development through NCC and NSS.",
      "Build environmental awareness and encourage sensitivity to local culture and traditions.",
    ],
  },
  "principal-details": {
    slug: "principal-details", title: "Principal Details", heroTag: "Institution Leadership", type: "records",
    intro: "Current principal and official communication details.",
    records: [{ title: "Dr. Abhaya R. Joglekar", category: "Principal", date: "Mobile: 9425203225 | Fax: 07720-25842x", href: "mailto:gbpca1963@gmail.com" }],
  },
  "department-list": {
    slug: "department-list", title: "Department List", heroTag: "Academic Units", type: "records",
    intro: "Major departments and institutional academic units listed on the official portal.",
    records: [
      { title: "Commerce Department" }, { title: "Department Computer Science" },
      { title: "Department of Economics / Political Science / History" }, { title: "Department of Hindi" },
      { title: "Library" }, { title: "Sports" }, { title: "Zoology / Mathematics / Chemistry" },
    ],
  },
  "course-details": {
    slug: "course-details", title: "Course Details", heroTag: "Programs Offered", type: "records",
    intro: "UG, PG, and diploma programs under NEP with duration, medium, and sanctioned strength.",
    records: [
      { title: "B.Sc. (NEP) Biology", category: "UG", date: "36 months | Strength: 200" },
      { title: "B.Sc. Maths (NEP)", category: "UG", date: "36 months | Strength: 150" },
      { title: "B.Com. (NEP)", category: "UG", date: "36 months | Strength: 170" },
      { title: "BA (NEP)", category: "UG", date: "36 months | Strength: 400" },
      { title: "M.Sc. Zoology (NEP)", category: "PG", date: "24 months | Strength: 50" },
      { title: "M.Sc. Maths (NEP)", category: "PG", date: "24 months | Strength: 25" },
      { title: "M.Com. (NEP)", category: "PG", date: "24 months | Strength: 50" },
      { title: "MA Hindi / Political Science / Economics", category: "PG", date: "24 months" },
      { title: "DCA", category: "Diploma", date: "12 months | Strength: 70" },
      { title: "PGDCA", category: "Diploma", date: "12 months | Strength: 80" },
    ],
  },
  syllabus: {
    slug: "syllabus", title: "Syllabus", heroTag: "Academic Resource", type: "text",
    intro: "The official page currently shows the syllabus section header without active listed files.",
    note: "No active downloadable syllabus entries were visible during crawl.",
  },
  "time-table": {
    slug: "time-table", title: "Time Table", heroTag: "Session Planning", type: "records",
    intro: "Published timetable notices for UG, PG, and diploma programs.",
    records: [
      { title: "BA 1st Sem NEP Time Table 2025-26", date: "07-07-2025" },
      { title: "BA 3rd Sem NEP Time Table 2025-26", date: "07-07-2025" },
      { title: "BA Final Year Time Table 2025-26", date: "07-07-2025" },
      { title: "B.Com. All Sem NEP Time Table 2025-26", date: "07-07-2025" },
      { title: "B.Sc. and M.Sc. NEP Time Table 2025-26", date: "07-07-2025" },
    ],
  },
  "teaching-staff": {
    slug: "teaching-staff", title: "Teaching Staff", heroTag: "Faculty Directory", type: "records",
    intro: "Representative faculty listings from the official portal.",
    records: [
      { title: "Asst. Prof. Gyanesh Shukla", category: "History" },
      { title: "Prof. Bhuneshwar Sahu", category: "Commerce" },
      { title: "Dr. L. P. Sharma", category: "Hindi" },
      { title: "Mr. Piyush Rathod", category: "Computer Science" },
      { title: "Dr. Indu Soni", category: "Botany" },
      { title: "Prof. Avinash Singh", category: "English" },
      { title: "Prof. Dr. Sadhna Dixit", category: "Zoology" },
      { title: "Bhavna Purabiya", category: "Mathematics" },
      { title: "Vibha Satpathi", category: "Chemistry" },
    ],
  },
  "non-teaching-staff": {
    slug: "non-teaching-staff", title: "Non-Teaching Staff", heroTag: "Administrative Team", type: "records",
    intro: "Administrative, library, sports, and support staff listed on the institution page.",
    records: [
      { title: "Shri Aditya Hariarno", category: "Librarian" },
      { title: "Ku. Rina Dhruw", category: "Sport Officer" },
      { title: "Shri Ravindra Sharma", category: "Data Entry Operator" },
      { title: "Shri Tulsi Ram Sahu", category: "Lab Technician" },
      { title: "Smt. Rukhmani Kurre", category: "Lab Technician" },
      { title: "Shri Aman Kumar Shery", category: "Assistant Grade-3" },
    ],
  },
  "student-union": {
    slug: "student-union", title: "Student Union", heroTag: "Student Representation", type: "text",
    intro: "The current portal table indicates no active student union entries.",
    note: "Official table status: No students found.",
  },
  "college-samiti": {
    slug: "college-samiti", title: "College Samiti", heroTag: "Committee Records", type: "records",
    intro: "Committee documents are shared as downloadable entries.",
    records: [{ title: "College Samiti 2025-26", date: "01-08-2025" }],
  },
  "janbhagidari-samiti-details": {
    slug: "janbhagidari-samiti-details", title: "Janbhagidari Samiti", heroTag: "Community Governance", type: "records",
    intro: "Community and institutional representatives involved in governance.",
    records: [
      { title: "Mr. Ganpat Ram Lodhi", category: "President" },
      { title: "Anuvibhagi Adhikari (Rev.) Arang", category: "Vice President" },
      { title: "Dr. Abhaya R. Joglekar", category: "Secretary" },
      { title: "Mr. Suraj Lodhi", category: "MP Representative" },
      { title: "Mr. Suraj Sahu", category: "MLA Representative" },
      { title: "Mr. Vaibhav Agrawal", category: "Industry Representative" },
    ],
  },
  ncc: { slug: "ncc", title: "NCC", heroTag: "Leadership & Discipline", type: "text", intro: "NCC activities are focused on character, discipline, comradeship, and national values." },
  nss: {
    slug: "nss", title: "NSS", heroTag: "Community Engagement", type: "text",
    intro: "NSS is presented as a student community-service platform supported by the Government of India.",
    content: ["Encourages student participation in social outreach and public service programs.", "Focuses on experiential learning through community work."],
  },
  "red-cross": { slug: "red-cross", title: "Red Cross", heroTag: "Health & Service", type: "text", intro: "The source page currently marks this section as content not available.", note: "Content not available on source page at crawl time." },
  "girls-common-room": { slug: "girls-common-room", title: "Girls Common Room", heroTag: "Student Facility", type: "text", intro: "The source page currently marks this section as content not available.", note: "Content not available on source page at crawl time." },
  "smart-class": { slug: "smart-class", title: "Smart Class Room", heroTag: "Learning Infrastructure", type: "text", intro: "The source page currently marks this section as content not available.", note: "Content not available on source page at crawl time." },
  "botnical-garden": { slug: "botnical-garden", title: "Botanical Garden", heroTag: "Eco Campus", type: "text", intro: "The source page currently marks this section as content not available.", note: "Content not available on source page at crawl time." },
  "harbal-garden": { slug: "harbal-garden", title: "Herbal Garden", heroTag: "Eco Campus", type: "text", intro: "The source page currently marks this section as content not available.", note: "Content not available on source page at crawl time." },
  ramp: { slug: "ramp", title: "Ramp", heroTag: "Accessibility", type: "text", intro: "The source page currently marks this section as content not available.", note: "Content not available on source page at crawl time." },
  "iqac-details": {
    slug: "iqac-details", title: "IQAC", heroTag: "Internal Quality Assurance", type: "records",
    intro: "IQAC repository includes institutional development plans, best practices, and annual reports.",
    records: [
      { title: "IDP 2023-28 Part 1", date: "2025" }, { title: "IDP 2023-28 Part 2", date: "2025" },
      { title: "Best Practice 2023-24", date: "2025" }, { title: "Students Feedback Analysis 2023-24", date: "2025" },
      { title: "IIQA Revision", date: "2024" }, { title: "IQAC Annual Report 2018-19", date: "2024" },
    ],
  },
  "aqar-details": {
    slug: "aqar-details", title: "AQAR", heroTag: "Annual Quality Assurance Report", type: "records",
    intro: "Published AQAR documents from cycle years.",
    records: [
      { title: "AQAR 2023-24 Part 1", date: "2025" }, { title: "AQAR 2023-24 Part 2", date: "2025" },
      { title: "AQAR 2021-22", date: "2024" }, { title: "AQAR 2020-21", date: "2023" },
      { title: "AQAR 2019-20", date: "2023" }, { title: "AQAR 2018-19", date: "2023" },
    ],
  },
  "ssr-details": {
    slug: "ssr-details", title: "SSR", heroTag: "Self Study Report", type: "records",
    intro: "NAAC SSR archive available on the official portal.",
    records: [{ title: "NAAC SSR 2024", date: "2024" }, { title: "NAAC SSR 2018", date: "2022" }],
  },
  "peer-team-report-details": {
    slug: "peer-team-report-details", title: "Peer Team Report", heroTag: "Assessment Records", type: "records",
    intro: "Peer team assessment report listing.",
    records: [{ title: "Peer Team Report Cycle 2", date: "2025" }],
  },
  "naac-certificate-details": {
    slug: "naac-certificate-details", title: "NAAC Certificate", heroTag: "Accreditation", type: "text",
    intro: "This section is present in navigation but no visible certificate entries were listed during crawl.",
    note: "No active listing rendered at crawl time.",
  },
  "naac-feedback-details": {
    slug: "naac-feedback-details", title: "Feedback", heroTag: "Stakeholder Feedback", type: "records",
    intro: "Feedback documentation under NAAC section.",
    records: [{ title: "Feedback Report", date: "2024" }],
  },
  "aish-details": {
    slug: "aish-details", title: "AISHE", heroTag: "AISHE Compliance", type: "records",
    intro: "AISHE certification documents listed on portal.",
    records: [{ title: "AISHE Certificate 2023-24", date: "2025" }, { title: "AISHE Certificate 2022", date: "2024" }],
  },
  "important-link-details": {
    slug: "important-link-details", title: "Important Links", heroTag: "Documents & External References", type: "links",
    intro: "Compiled official links and institutional document references.",
    links: [
      { label: "Swayam Education Portal", href: `${officialSite}/assets/uploads/implink/Swayam_Website_FileArang_16708268724076396cb78637b2.pdf` },
      { label: "MOU Shrijan Sonkar Coaching Arang", href: `${officialSite}/assets/uploads/implink/MOU_FileArang_1713175912173661cfd682a44b.pdf` },
      { label: "Journals", href: `${officialSite}/assets/uploads/implink/GyaneshSirJurnals_compressed_FileArang_1714378951663662f58c7a1ce0.pdf` },
      { label: "Teacher Financial Support", href: `${officialSite}/assets/uploads/implink/TeacherSupport_FileArang_1714399534078662fa92e13111.pdf` },
      { label: "NSS Prativedan", href: `${officialSite}/assets/uploads/implink/NSS_Prativedan_FileArang_1714401699411662fb1a364543.pdf` },
    ],
  },
  "notice-board": {
    slug: "notice-board", title: "Notice Board", heroTag: "Latest Notifications", type: "records",
    intro: "Large notice repository spanning admissions, practicals, examinations, and institutional circulars.",
    records: [
      { title: "Career Guidance Program - Guide (IAS Mr. Sanjay Dahariya)", category: "Career Guidance Cell", date: "17-03-2026" },
      { title: "DSC/GE 2nd Sem Practical (Zoology)", category: "Zoology", date: "28-04-2025" },
      { title: "DSC/GE 2nd Sem Practical (Botany)", category: "Botany", date: "28-04-2025" },
      { title: "M.Sc. Zoology Practical Notice", category: "Zoology", date: "28-04-2025" },
      { title: "BA 2nd Sem SEC Subject Selection", category: "Arts", date: "09-04-2025" },
      { title: "UG 2nd Sem Internal Exam 2024-25", category: "UG All Department", date: "12-03-2025" },
      { title: "1st Internal Exam PG 2nd/4th Sem", category: "PG All Department", date: "12-03-2025" },
      { title: "National Science Day Notice", category: "Science", date: "25-02-2025" },
      { title: "Annual Sports Notice", category: "Sports", date: "21-02-2025" },
    ],
  },
  event: {
    slug: "event", title: "Events", heroTag: "Institutional Activities", type: "records",
    intro: "Highlighted events and notices published by the college.",
    records: [
      { title: "Annual Sports 2024-25", date: "21-02-2025" },
      { title: "SSR", date: "28-08-2024" },
      { title: "Sports Notice 2024-25", date: "24-08-2024" },
      { title: "National Sports Day Event 2024-25", date: "24-08-2024" },
      { title: "Sports Calendar 2024-25", date: "24-08-2024" },
      { title: "NEP Instruction 2020", date: "01-07-2024" },
      { title: "MOU Kalinga University", date: "20-04-2023" },
    ],
  },
  result: {
    slug: "result", title: "Result", heroTag: "Exam Outcomes", type: "records",
    intro: "Result section entries on source portal.",
    records: [{ title: "Result Link Document", date: "30-12-2022" }],
  },
  "unit-test": {
    slug: "unit-test", title: "Unit Test", heroTag: "Internal Exams", type: "records",
    intro: "Unit/internal exam related results and notices.",
    records: [
      { title: "Internal Exam Result", date: "27-02-2024" },
      { title: "Internal Exam PG", date: "06-11-2023" },
      { title: "Internal Exam 1st Sem PGDCA DCA", date: "17-11-2022" },
    ],
  },
  "admission-guideline": {
    slug: "admission-guideline", title: "Admission Guideline", heroTag: "Admissions", type: "records",
    intro: "Admission related guideline files.",
    records: [
      { title: "All About NEP 2020", date: "22-02-2025" },
      { title: "Admission Guideline", date: "01-06-2023" },
    ],
  },
  calendar: {
    slug: "calendar", title: "Calendar", heroTag: "Academic Calendar", type: "records",
    intro: "Government and institution academic calendar releases.",
    records: [
      { title: "Academic Calendar 2025-26 (Government)", date: "01-07-2025" },
      { title: "Academic Calendar 2025-26 (College/Institute)", date: "01-07-2025" },
      { title: "Academic Calendar 2024-25 1st Sem", date: "23-09-2024" },
      { title: "Revised Academic Calendar 2024-25 1st Sem", date: "23-09-2024" },
    ],
  },
  "fees-payment": {
    slug: "fees-payment", title: "Fees Payment", heroTag: "Online Fee Facility", type: "links",
    intro: "Source page directs users to SBI Collect for online payment.",
    links: [{ label: "SBI Collect", href: "https://www.onlinesbi.sbi/sbicollect/icollecthome.htm" }],
  },
  "alumni-details": {
    slug: "alumni-details", title: "List Of Alumni", heroTag: "Alumni Section", type: "records",
    intro: "Alumni records and supporting documents listed on the portal.",
    records: [
      { title: "Alumni Meet", date: "16-12-2023" }, { title: "Alumni Certificate", date: "04-08-2023" },
      { title: "Gyapan", date: "28-07-2023" }, { title: "Niyamavali", date: "28-07-2023" },
    ],
  },
  "activities-gallery": { slug: "activities-gallery", title: "Activities Photo Gallery", heroTag: "Campus Life", type: "gallery", intro: "Activity gallery section exists on the official site.", note: "Gallery grid appeared without text labels in crawl output." },
  "award-gallery": { slug: "award-gallery", title: "Award Photo Gallery", heroTag: "Achievements", type: "gallery", intro: "Award gallery section exists on the official site.", note: "Gallery grid appeared without text labels in crawl output." },
  "other-gallery": { slug: "other-gallery", title: "Gallery", heroTag: "Visual Archive", type: "gallery", intro: "Additional media gallery section.", note: "Gallery grid appeared without text labels in crawl output." },
  "contact-us": {
    slug: "contact-us", title: "Contact Us", heroTag: "Reach The College", type: "text",
    intro: "Official contact details captured from the source contact page.",
    content: [
      "Govt. B.P. Arts and Commerce College, Arang",
      "City: Arang, State: Chhattisgarh",
      "Phone: 07720-258423",
      "Email: gbpca1963@gmail.com",
      "Affiliation: Pt. Ravishankar Shukla University, Raipur",
    ],
    links: [
      { label: "Open Official Google Map", href: "https://www.google.com/maps/place/Badri+Prasad+Lodhi+Govt.College+Arang" },
      { label: "Original Contact Page", href: `${officialSite}/Contact-Us` },
    ],
  },
};

fs.writeFileSync("data/pages.json", JSON.stringify(pages, null, 2));

const navigation = [
  { label: "About", items: [
    { label: "About Us", href: "/about-us" }, { label: "Vision", href: "/vision" },
    { label: "Mission", href: "/mission" }, { label: "Principal Details", href: "/principal-details" },
    { label: "Janbhagidari Samiti", href: "/janbhagidari-samiti-details" },
    { label: "College Samiti", href: "/college-samiti" }, { label: "Department List", href: "/department-list" },
    { label: "Teaching Staff", href: "/teaching-staff" }, { label: "Non-Teaching Staff", href: "/non-teaching-staff" },
    { label: "Alumni", href: "/alumni-details" },
  ]},
  { label: "Academic Informations", items: [
    { label: "Course Details", href: "/course-details" }, { label: "Syllabus", href: "/syllabus" },
    { label: "Calendar", href: "/calendar" }, { label: "Admission Guideline", href: "/admission-guideline" },
    { label: "Fees Payment", href: "/fees-payment" }, { label: "Student Union", href: "/student-union" },
  ]},
  { label: "Facilities", items: [
    { label: "NCC", href: "/ncc" }, { label: "NSS", href: "/nss" },
    { label: "Red Cross", href: "/red-cross" }, { label: "Girls Common Room", href: "/girls-common-room" },
    { label: "Smart Class", href: "/smart-class" }, { label: "Botanical Garden", href: "/botnical-garden" },
    { label: "Herbal Garden", href: "/harbal-garden" }, { label: "Ramp", href: "/ramp" },
  ]},
  { label: "NAAC & Research", items: [
    { label: "IQAC", href: "/iqac-details" }, { label: "AISHE", href: "/aish-details" },
    { label: "Important Links", href: "/important-link-details" }, { label: "NAAC Feedback", href: "/naac-feedback-details" },
    { label: "SSR", href: "/ssr-details" }, { label: "AQAR", href: "/aqar-details" },
    { label: "Peer Team Report", href: "/peer-team-report-details" }, { label: "NAAC Certificate", href: "/naac-certificate-details" },
  ]},
  { label: "Exam & Gallery", items: [
    { label: "Unit Test", href: "/unit-test" }, { label: "Result", href: "/result" },
    { label: "Time Table", href: "/time-table" }, { label: "Notice Board", href: "/notice-board" },
    { label: "Events", href: "/event" }, { label: "Award Gallery", href: "/award-gallery" },
    { label: "Activities Gallery", href: "/activities-gallery" }, { label: "Other Gallery", href: "/other-gallery" },
    { label: "Contact", href: "/contact-us" },
  ]},
];

fs.writeFileSync("data/navigation.json", JSON.stringify(navigation, null, 2));

const settings = {
  siteName: "Badri Prasad Lodhi PG College Arang",
  siteDescription: "Responsive Next.js rebuild inspired by the official website of Badri Prasad Lodhi Post Graduate Government College, Arang.",
  collegeName: "Badri Prasad Lodhi PG Govt. College",
  collegeSubtitle: "Arang, District Raipur, Chhattisgarh",
  footerName: "Badri Prasad Lodhi Post Graduate Government College",
  footerAddress: "Arang, District Raipur, Chhattisgarh",
  footerAffiliation: "Affiliated to Pt. Ravishankar Shukla University, Raipur",
  officialSiteUrl: "https://govpgcollarang.cgstate.gov.in/",
  quickLinks: [
    { label: "Notice Board", href: "/notice-board" },
    { label: "Events", href: "/event" },
    { label: "Courses", href: "/course-details" },
    { label: "Time Table", href: "/time-table" },
    { label: "NAAC", href: "/iqac-details" },
    { label: "Contact", href: "/contact-us" },
  ],
  footerLinks: [
    { label: "Notice Board", href: "/notice-board" },
    { label: "Events", href: "/event" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  stats: [
    { label: "Established", value: "1965" },
    { label: "Streams", value: "Arts / Commerce / Science" },
    { label: "Affiliation", value: "Pt. RSU, Raipur" },
    { label: "Location", value: "Arang, Chhattisgarh" },
  ],
};

fs.writeFileSync("data/settings.json", JSON.stringify(settings, null, 2));

const homeContent = {
  slides: [
    {
      title: "Badri Prasad Lodhi Post Graduate Government College, Arang",
      subtitle: "Affiliated to Pt. Ravishankar Shukla University, Raipur",
      image: "https://govpgcollarang.cgstate.gov.in/assets/img/silde/College_New_Building_FileArang_17326939409856746cfb4f06f6.jpg",
    },
    {
      title: "Academic, Co-curricular, and Sports Excellence",
      subtitle: "Serving learners from Arang and nearby rural communities since 1965",
      image: "https://govpgcollarang.cgstate.gov.in/assets/img/silde/Clg-sport1_FileArang_177383100967669ba8361a50de.jpeg",
    },
    {
      title: "Modern Teaching Spaces and Laboratories",
      subtitle: "Equipped classrooms, computer labs, and science laboratories for practical learning.",
      image: "https://govpgcollarang.cgstate.gov.in/assets/img/silde/Smart-Class-_FileArang_177383094317669ba7f185a3f.jpeg",
    },
  ],
  heroBadge: "Official Institution Rebuild",
  ctaButtons: [
    { label: "Explore College", href: "/about-us" },
    { label: "Latest Notices", href: "/notice-board" },
  ],
};

fs.writeFileSync("data/home.json", JSON.stringify(homeContent, null, 2));

console.log("Migration complete! JSON files created in data/");
