const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UserModel } = require("./models/user");
const { connectDB } = require("./config/database");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const seedUsers = [
  {
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav.sharma@example.com",
    password: "Password@123",
    age: 24,
    gender: "male",
    skills: ["React", "Node.js", "MongoDB"],
    about: "Full stack developer passionate about building scalable web applications.",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Ananya",
    lastName: "Iyer",
    email: "ananya.iyer@example.com",
    password: "Password@123",
    age: 22,
    gender: "female",
    skills: ["Python", "Django", "PostgreSQL"],
    about: "Data science enthusiast and backend developer. I love solving complex problems.",
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Rohan",
    lastName: "Verma",
    email: "rohan.verma@example.com",
    password: "Password@123",
    age: 26,
    gender: "male",
    skills: ["Java", "Spring Boot", "AWS"],
    about: "Cloud architect and Java expert. Always exploring new technologies.",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Priya",
    lastName: "Patel",
    email: "priya.patel@example.com",
    password: "Password@123",
    age: 23,
    gender: "female",
    skills: ["UI/UX", "Figma", "React Native"],
    about: "Designer turned developer. I focus on creating beautiful and intuitive user interfaces.",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Kabir",
    lastName: "Singh",
    email: "kabir.singh@example.com",
    password: "Password@123",
    age: 28,
    gender: "male",
    skills: ["Go", "Kubernetes", "Docker"],
    about: "DevOps engineer with a love for automation and containerization.",
    photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Ishani",
    lastName: "Gupta",
    email: "ishani.gupta@example.com",
    password: "Password@123",
    age: 25,
    gender: "female",
    skills: ["Angular", "TypeScript", "Firebase"],
    about: "Frontend specialist. I enjoy building responsive and high-performance web apps.",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Vikram",
    lastName: "Reddy",
    email: "vikram.reddy@example.com",
    password: "Password@123",
    age: 27,
    gender: "male",
    skills: ["C++", "Embedded Systems", "Rust"],
    about: "Low-level programmer. I like working close to the hardware.",
    photoURL: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Sanya",
    lastName: "Malhotra",
    email: "sanya.malhotra@example.com",
    password: "Password@123",
    age: 24,
    gender: "female",
    skills: ["Machine Learning", "PyTorch", "NLP"],
    about: "AI researcher and developer. Building the future with intelligent systems.",
    photoURL: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Arjun",
    lastName: "Kapoor",
    email: "arjun.kapoor@example.com",
    password: "Password@123",
    age: 29,
    gender: "male",
    skills: ["PHP", "Laravel", "Vue.js"],
    about: "Experienced web developer. I've been building for the web for over 7 years.",
    photoURL: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Meera",
    lastName: "Nair",
    email: "meera.nair@example.com",
    password: "Password@123",
    age: 21,
    gender: "female",
    skills: ["Swift", "iOS Development", "Xcode"],
    about: "Aspiring mobile developer. I love the Apple ecosystem.",
    photoURL: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Rahul",
    lastName: "Khanna",
    email: "rahul.khanna@example.com",
    password: "Password@123",
    age: 25,
    gender: "male",
    skills: ["Ruby", "Rails", "Redis"],
    about: "Backend engineer who loves the simplicity of Ruby. Building robust APIs.",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Zoya",
    lastName: "Akhtar",
    email: "zoya.akhtar@example.com",
    password: "Password@123",
    age: 23,
    gender: "female",
    skills: ["React", "Tailwind CSS", "Next.js"],
    about: "Frontend developer focused on modern web performance and accessibility.",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Dev",
    lastName: "Patel",
    email: "dev.patel@example.com",
    password: "Password@123",
    age: 27,
    gender: "male",
    skills: ["Kotlin", "Android", "Jetpack Compose"],
    about: "Android developer building high-quality mobile experiences.",
    photoURL: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Kiara",
    lastName: "Advani",
    email: "kiara.advani@example.com",
    password: "Password@123",
    age: 24,
    gender: "female",
    skills: ["GraphQL", "Apollo", "Node.js"],
    about: "API enthusiast. I believe GraphQL is the future of data fetching.",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Siddharth",
    lastName: "Malhotra",
    email: "sid.malhotra@example.com",
    password: "Password@123",
    age: 26,
    gender: "male",
    skills: ["Rust", "WebAssembly", "C"],
    about: "Systems programmer exploring the intersection of safety and performance.",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Tara",
    lastName: "Sutaria",
    email: "tara.sutaria@example.com",
    password: "Password@123",
    age: 22,
    gender: "female",
    skills: ["Flutter", "Dart", "Firebase"],
    about: "Cross-platform mobile developer. One codebase to rule them all!",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Varun",
    lastName: "Dhawan",
    email: "varun.dhawan@example.com",
    password: "Password@123",
    age: 28,
    gender: "male",
    skills: ["Docker", "Terraform", "Azure"],
    about: "Cloud engineer helping companies scale their infrastructure.",
    photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Kriti",
    lastName: "Sanon",
    email: "kriti.sanon@example.com",
    password: "Password@123",
    age: 25,
    gender: "female",
    skills: ["Vue.js", "Nuxt.js", "Sass"],
    about: "Frontend architect with a love for clean code and modular design.",
    photoURL: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Ayushmann",
    lastName: "Khurrana",
    email: "ayush.khurrana@example.com",
    password: "Password@123",
    age: 30,
    gender: "male",
    skills: ["Solidity", "Ethereum", "Web3.js"],
    about: "Blockchain developer building decentralized applications for the future.",
    photoURL: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Sara",
    lastName: "Ali",
    email: "sara.ali@example.com",
    password: "Password@123",
    age: 23,
    gender: "female",
    skills: ["D3.js", "Three.js", "Canvas"],
    about: "Data visualization expert. I make data beautiful and interactive.",
    photoURL: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Kartik",
    lastName: "Aaryan",
    email: "kartik.aaryan@example.com",
    password: "Password@123",
    age: 26,
    gender: "male",
    skills: ["Elasticsearch", "Logstash", "Kibana"],
    about: "Search engine specialist. I help you find what you're looking for.",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Janhvi",
    lastName: "Kapoor",
    email: "janhvi.kapoor@example.com",
    password: "Password@123",
    age: 24,
    gender: "female",
    skills: ["C#", ".NET Core", "SQL Server"],
    about: "Enterprise software developer. Building robust systems for big business.",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Ranbir",
    lastName: "Kapoor",
    email: "ranbir.kapoor@example.com",
    password: "Password@123",
    age: 31,
    gender: "male",
    skills: ["Scala", "Akka", "Spark"],
    about: "Big data engineer. Processing massive datasets at scale.",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Alia",
    lastName: "Bhatt",
    email: "alia.bhatt@example.com",
    password: "Password@123",
    age: 25,
    gender: "female",
    skills: ["Cypress", "Jest", "TDD"],
    about: "Quality assurance engineer. I break things so you don't have to.",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Vicky",
    lastName: "Kaushal",
    email: "vicky.kaushal@example.com",
    password: "Password@123",
    age: 29,
    gender: "male",
    skills: ["Cyber Security", "Penetration Testing", "Ethical Hacking"],
    about: "Security researcher. Protecting the web one vulnerability at a time.",
    photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Rashmika",
    lastName: "Mandanna",
    email: "rashmika.m@example.com",
    password: "Password@123",
    age: 24,
    gender: "female",
    skills: ["Unity", "C#", "Game Design"],
    about: "Game developer building immersive worlds and interactive experiences.",
    photoURL: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Vijay",
    lastName: "Deverakonda",
    email: "vijay.d@example.com",
    password: "Password@123",
    age: 28,
    gender: "male",
    skills: ["Rust", "WebAssembly", "C"],
    about: "Performance-obsessed developer. I love making things run fast.",
    photoURL: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Samantha",
    lastName: "Ruth",
    email: "samantha.r@example.com",
    password: "Password@123",
    age: 27,
    gender: "female",
    skills: ["React", "Redux", "GraphQL"],
    about: "Senior frontend engineer. I build complex user interfaces with ease.",
    photoURL: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Prabhas",
    lastName: "Raju",
    email: "prabhas.r@example.com",
    password: "Password@123",
    age: 32,
    gender: "male",
    skills: ["Hadoop", "Spark", "Scala"],
    about: "Data engineer handling petabytes of data for large-scale analytics.",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Nayanthara",
    lastName: "Kurian",
    email: "nayan.k@example.com",
    password: "Password@123",
    age: 30,
    gender: "female",
    skills: ["Product Management", "Agile", "Scrum"],
    about: "Technical product manager bridging the gap between business and tech.",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Allu",
    lastName: "Arjun",
    email: "allu.arjun@example.com",
    password: "Password@123",
    age: 29,
    gender: "male",
    skills: ["Three.js", "WebGL", "Creative Coding"],
    about: "Creative technologist. I blend art and code to create unique web experiences.",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Tamannaah",
    lastName: "Bhatia",
    email: "tamannaah.b@example.com",
    password: "Password@123",
    age: 26,
    gender: "female",
    skills: ["Node.js", "Express", "Microservices"],
    about: "Backend specialist. I design and build scalable microservice architectures.",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Mahesh",
    lastName: "Babu",
    email: "mahesh.b@example.com",
    password: "Password@123",
    age: 33,
    gender: "male",
    skills: ["Cloud Computing", "GCP", "Serverless"],
    about: "Cloud solutions architect. Helping businesses migrate to the cloud.",
    photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Kajal",
    lastName: "Aggarwal",
    email: "kajal.a@example.com",
    password: "Password@123",
    age: 28,
    gender: "female",
    skills: ["SEO", "Digital Marketing", "Analytics"],
    about: "Growth engineer. I use data and tech to drive user acquisition.",
    photoURL: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Ram",
    lastName: "Charan",
    email: "ram.charan@example.com",
    password: "Password@123",
    age: 30,
    gender: "male",
    skills: ["Objective-C", "macOS Dev", "C#"],
    about: "Apple platform specialist. I build high-performance desktop and mobile apps.",
    photoURL: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Trisha",
    lastName: "Krishnan",
    email: "trisha.k@example.com",
    password: "Password@123",
    age: 29,
    gender: "female",
    skills: ["Ruby", "Sinatra", "PostgreSQL"],
    about: "Backend developer with a focus on simplicity and maintainability.",
    photoURL: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Yash",
    lastName: "Gowda",
    email: "yash.g@example.com",
    password: "Password@123",
    age: 28,
    gender: "male",
    skills: ["Solidity", "Smart Contracts", "DeFi"],
    about: "Web3 developer building the future of decentralized finance.",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60"
  },
  {
    firstName: "Keerthy",
    lastName: "Suresh",
    email: "keerthy.s@example.com",
    password: "Password@123",
    age: 25,
    gender: "female",
    skills: ["Python", "Flask", "AWS Lambda"],
    about: "Serverless enthusiast. I love building event-driven architectures.",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60"
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to DB for seeding");

    // Clear existing users
    await UserModel.deleteMany({});
    console.log("🗑️ Cleared existing users");

    for (const user of seedUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      
      const newUser = new UserModel(user);
      await newUser.save();
      console.log(`👤 Added user: ${user.firstName} ${user.lastName}`);
    }

    console.log("✨ Seeding completed successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
