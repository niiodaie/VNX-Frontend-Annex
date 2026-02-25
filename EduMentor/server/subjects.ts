import { 
  type IStorage, 
  type InsertSubject, 
  type InsertCourse, 
  type InsertLesson,
  type InsertAiInstructor
} from "./storage";

// Initialize subject data
export async function initializeSubjects(storage: IStorage) {
  const subjects: InsertSubject[] = [
    {
      name: "Mathematics",
      code: "math",
      description: "Algebra, Calculus, Geometry and more",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      color: "#3B82F6", // primary-500
    },
    {
      name: "English Literature",
      code: "english",
      description: "Shakespeare, Poetry, Essay Writing",
      imageUrl: "https://images.unsplash.com/photo-1490633874781-1c63cc424610",
      color: "#10B981", // secondary-500
    },
    {
      name: "Physics",
      code: "physics",
      description: "Mechanics, Thermodynamics, Electromagnetism",
      imageUrl: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa",
      color: "#8B5CF6", // accent-500
    },
    {
      name: "Languages",
      code: "languages",
      description: "Spanish, French, German, and more",
      imageUrl: "https://images.unsplash.com/photo-1546995022-530034374c86",
      color: "#F59E0B", // amber-500
    }
  ];

  for (const subject of subjects) {
    await storage.createSubject(subject);
  }
}

// Initialize course data
export async function initializeCourses(storage: IStorage) {
  const subjects = await storage.getAllSubjects();
  if (subjects.length === 0) {
    throw new Error("No subjects found. Please initialize subjects first.");
  }

  const mathSubject = subjects.find(s => s.code === "math");
  const englishSubject = subjects.find(s => s.code === "english");
  const physicsSubject = subjects.find(s => s.code === "physics");
  const languagesSubject = subjects.find(s => s.code === "languages");

  if (!mathSubject || !englishSubject || !physicsSubject || !languagesSubject) {
    throw new Error("Required subjects not found.");
  }

  const courses: InsertCourse[] = [
    {
      name: "Advanced Mathematics",
      description: "Complex algebra, calculus, and geometry for advanced students",
      subjectId: mathSubject.id,
      level: "advanced",
      imageUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
      certificationType: null
    },
    {
      name: "English Literature",
      description: "Explore classical and modern literature with critical analysis",
      subjectId: englishSubject.id,
      level: "intermediate",
      imageUrl: "https://images.unsplash.com/photo-1526243741027-444d633d7365",
      certificationType: null
    },
    {
      name: "SAT Preparation",
      description: "Comprehensive preparation for the SAT exam",
      subjectId: mathSubject.id,
      level: "advanced",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
      certificationType: "SAT"
    },
    {
      name: "IELTS Preparation",
      description: "Complete preparation for the IELTS English proficiency exam",
      subjectId: languagesSubject.id,
      level: "intermediate",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
      certificationType: "IELTS"
    },
    {
      name: "Physics Fundamentals",
      description: "Essential physics concepts and applications",
      subjectId: physicsSubject.id,
      level: "beginner",
      imageUrl: "https://images.unsplash.com/photo-1636466377311-3ceb7b8d5072",
      certificationType: null
    },
    {
      name: "Spanish for Beginners",
      description: "Learn basic Spanish vocabulary, grammar, and conversation",
      subjectId: languagesSubject.id,
      level: "beginner",
      imageUrl: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27",
      certificationType: null
    }
  ];

  for (const course of courses) {
    await storage.createCourse(course);
  }
}

// Initialize lesson data
export async function initializeLessons(storage: IStorage) {
  const courses = await storage.getAllCourses();
  if (courses.length === 0) {
    throw new Error("No courses found. Please initialize courses first.");
  }

  const advancedMath = courses.find(c => c.name === "Advanced Mathematics");
  const englishLit = courses.find(c => c.name === "English Literature");
  const satPrep = courses.find(c => c.name === "SAT Preparation");

  if (!advancedMath || !englishLit || !satPrep) {
    throw new Error("Required courses not found.");
  }

  // Advanced Math lessons
  const mathLessons: InsertLesson[] = [
    {
      courseId: advancedMath.id,
      title: "Introduction to Calculus",
      description: "Fundamentals of calculus and its applications",
      videoUrl: "https://example.com/videos/calculus-intro",
      order: 1,
      duration: 45
    },
    {
      courseId: advancedMath.id,
      title: "Limits and Continuity",
      description: "Understanding the concept of limits and continuity",
      videoUrl: "https://example.com/videos/limits",
      order: 2,
      duration: 50
    },
    {
      courseId: advancedMath.id,
      title: "Derivatives and Differentiation",
      description: "Fundamental rules and applications of derivatives",
      videoUrl: "https://example.com/videos/derivatives",
      order: 3,
      duration: 55
    },
    {
      courseId: advancedMath.id,
      title: "Chain Rule and Applications",
      description: "Understanding the chain rule and its real-world applications",
      videoUrl: "https://example.com/videos/chain-rule",
      order: 4,
      duration: 60
    },
    {
      courseId: advancedMath.id,
      title: "Integrals and Integration",
      description: "Fundamental concepts of integration and techniques",
      videoUrl: "https://example.com/videos/integration",
      order: 5,
      duration: 65
    }
  ];

  // English Literature lessons
  const englishLessons: InsertLesson[] = [
    {
      courseId: englishLit.id,
      title: "Introduction to Shakespeare",
      description: "Overview of Shakespeare's life and works",
      videoUrl: "https://example.com/videos/shakespeare-intro",
      order: 1,
      duration: 40
    },
    {
      courseId: englishLit.id,
      title: "Shakespeare's Sonnets",
      description: "Analysis of Shakespeare's most famous sonnets",
      videoUrl: "https://example.com/videos/shakespeare-sonnets",
      order: 2,
      duration: 45
    },
    {
      courseId: englishLit.id,
      title: "Hamlet: Themes and Analysis",
      description: "In-depth study of Hamlet's major themes",
      videoUrl: "https://example.com/videos/hamlet-analysis",
      order: 3,
      duration: 55
    },
    {
      courseId: englishLit.id,
      title: "Critical Analysis Techniques",
      description: "Methods for analyzing and critiquing literature",
      videoUrl: "https://example.com/videos/critical-analysis",
      order: 4,
      duration: 50
    },
    {
      courseId: englishLit.id,
      title: "Essay Writing Workshop",
      description: "Techniques for writing compelling literary essays",
      videoUrl: "https://example.com/videos/essay-writing",
      order: 5,
      duration: 60
    }
  ];

  // SAT Prep lessons
  const satLessons: InsertLesson[] = [
    {
      courseId: satPrep.id,
      title: "SAT Overview and Strategy",
      description: "Understanding the SAT structure and general strategies",
      videoUrl: "https://example.com/videos/sat-overview",
      order: 1,
      duration: 35
    },
    {
      courseId: satPrep.id,
      title: "SAT Math: Algebra and Functions",
      description: "Key concepts and practice questions for algebra section",
      videoUrl: "https://example.com/videos/sat-algebra",
      order: 2,
      duration: 60
    },
    {
      courseId: satPrep.id,
      title: "SAT Math: Geometry and Trigonometry",
      description: "Essential geometry and trigonometry concepts for the SAT",
      videoUrl: "https://example.com/videos/sat-geometry",
      order: 3,
      duration: 55
    },
    {
      courseId: satPrep.id,
      title: "SAT Reading Comprehension",
      description: "Strategies for the reading section with practice passages",
      videoUrl: "https://example.com/videos/sat-reading",
      order: 4,
      duration: 50
    },
    {
      courseId: satPrep.id,
      title: "SAT Writing and Language",
      description: "Grammar rules and writing improvement strategies",
      videoUrl: "https://example.com/videos/sat-writing",
      order: 5,
      duration: 45
    },
    {
      courseId: satPrep.id,
      title: "SAT Essay Writing",
      description: "How to write a high-scoring SAT essay",
      videoUrl: "https://example.com/videos/sat-essay",
      order: 6,
      duration: 40
    },
    {
      courseId: satPrep.id,
      title: "Full SAT Practice Test #1",
      description: "Complete timed practice test with review",
      videoUrl: "https://example.com/videos/sat-practice-1",
      order: 7,
      duration: 180
    },
    {
      courseId: satPrep.id,
      title: "Full SAT Practice Test #2",
      description: "Second complete practice test with detailed explanations",
      videoUrl: "https://example.com/videos/sat-practice-2",
      order: 8,
      duration: 180
    }
  ];

  const allLessons = [...mathLessons, ...englishLessons, ...satLessons];
  for (const lesson of allLessons) {
    await storage.createLesson(lesson);
  }
}

// Initialize AI instructor data
export async function initializeInstructors(storage: IStorage) {
  const subjects = await storage.getAllSubjects();
  if (subjects.length === 0) {
    throw new Error("No subjects found. Please initialize subjects first.");
  }

  const instructors: InsertAiInstructor[] = [
    {
      name: "Professor Emma",
      appearance: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
      voice: "en-US-Neural2-F",
      subjectSpecialties: [1, 2], // Math and English
      language: "en",
    },
    {
      name: "Dr. James",
      appearance: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
      voice: "en-US-Neural2-D",
      subjectSpecialties: [1, 3], // Math and Physics
      language: "en",
    },
    {
      name: "Prof. María",
      appearance: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      voice: "es-ES-Neural2-A",
      subjectSpecialties: [2, 4], // English and Languages
      language: "es",
    },
    {
      name: "Dr. Chen",
      appearance: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      voice: "en-US-Neural2-J",
      subjectSpecialties: [3, 1], // Physics and Math
      language: "en",
    }
  ];

  for (const instructor of instructors) {
    await storage.createInstructor(instructor);
  }
}
