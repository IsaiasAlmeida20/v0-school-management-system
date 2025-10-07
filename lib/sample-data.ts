// Sample data for the school management system

export interface School {
  id: string
  name: string
  address: string
  phone: string
  totalStudents: number
  totalTeachers: number
}

export interface Class {
  id: string
  name: string
  schoolId: string
  grade: string
  shift: "morning" | "afternoon" | "evening"
  teacherId: string
  totalStudents: number
}

export interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  schoolId: string
  subjects: string[]
}

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  classId: string
  enrollmentDate: string
  status: "active" | "transferred" | "inactive"
}

export interface Attendance {
  id: string
  studentId: string
  classId: string
  date: string
  present: boolean
}

export interface Grade {
  id: string
  studentId: string
  classId: string
  subject: string
  value: number
  maxValue: number
  period: string
}

export interface Enrollment {
  id: string
  studentId: string
  classId: string
  enrollmentDate: string
  status: "active" | "completed" | "cancelled"
}

export interface Transfer {
  id: string
  studentId: string
  fromClassId: string
  toClassId: string
  transferDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
}

export interface Exam {
  id: string
  name: string
  number: 1 | 2 | 3 | 4
  date: string
}

export interface ExamResult {
  id: string
  studentId: string
  classId: string
  examId: string
  portugueseCriteria: {
    criterio1: number // Leitura
    criterio2: number // Interpretação
    criterio3: number // Gramática
    criterio4: number // Produção Textual
    criterio5: number // Ortografia
    criterio6: number // Coesão e Coerência
  }
  mathCriteria: {
    criterio1: number // Números e Operações
    criterio2: number // Geometria
    criterio3: number // Grandezas e Medidas
    criterio4: number // Tratamento da Informação
  }
}

// Sample Schools
export const SAMPLE_SCHOOLS: School[] = [
  {
    id: "escola-1",
    name: "Escola Municipal Centro",
    address: "Rua Principal, 100 - Centro",
    phone: "(11) 3333-4444",
    totalStudents: 320,
    totalTeachers: 18,
  },
  {
    id: "escola-2",
    name: "Escola Municipal Jardim",
    address: "Av. das Flores, 500 - Jardim",
    phone: "(11) 3333-5555",
    totalStudents: 280,
    totalTeachers: 15,
  },
]

// Sample Classes
export const SAMPLE_CLASSES: Class[] = [
  {
    id: "turma-1",
    name: "5º Ano A",
    schoolId: "escola-1",
    grade: "5º Ano",
    shift: "morning",
    teacherId: "prof-1",
    totalStudents: 28,
  },
  {
    id: "turma-2",
    name: "5º Ano B",
    schoolId: "escola-1",
    grade: "5º Ano",
    shift: "afternoon",
    teacherId: "prof-2",
    totalStudents: 26,
  },
  {
    id: "turma-3",
    name: "6º Ano A",
    schoolId: "escola-1",
    grade: "6º Ano",
    shift: "morning",
    teacherId: "prof-3",
    totalStudents: 30,
  },
  {
    id: "turma-4",
    name: "4º Ano A",
    schoolId: "escola-2",
    grade: "4º Ano",
    shift: "morning",
    teacherId: "prof-4",
    totalStudents: 25,
  },
  {
    id: "turma-5",
    name: "5º Ano A",
    schoolId: "escola-2",
    grade: "5º Ano",
    shift: "afternoon",
    teacherId: "prof-5",
    totalStudents: 27,
  },
  {
    id: "turma-6",
    name: "6º Ano A",
    schoolId: "escola-2",
    grade: "6º Ano",
    shift: "morning",
    teacherId: "prof-6",
    totalStudents: 29,
  },
]

// Sample Teachers
export const SAMPLE_TEACHERS: Teacher[] = [
  {
    id: "prof-1",
    name: "Ana Silva",
    email: "ana.silva@escolaa.com.br",
    phone: "(11) 98888-1111",
    schoolId: "escola-1",
    subjects: ["Matemática", "Ciências"],
  },
  {
    id: "prof-2",
    name: "Carlos Santos",
    email: "carlos.santos@escolaa.com.br",
    phone: "(11) 98888-2222",
    schoolId: "escola-1",
    subjects: ["Português", "História"],
  },
  {
    id: "prof-3",
    name: "Beatriz Costa",
    email: "beatriz.costa@escolaa.com.br",
    phone: "(11) 98888-3333",
    schoolId: "escola-1",
    subjects: ["Geografia", "Artes"],
  },
  {
    id: "prof-4",
    name: "Daniel Oliveira",
    email: "daniel.oliveira@escolaa.com.br",
    phone: "(11) 98888-4444",
    schoolId: "escola-2",
    subjects: ["Matemática", "Física"],
  },
  {
    id: "prof-5",
    name: "Eduarda Lima",
    email: "eduarda.lima@escolaa.com.br",
    phone: "(11) 98888-5555",
    schoolId: "escola-2",
    subjects: ["Português", "Literatura"],
  },
  {
    id: "prof-6",
    name: "Fernando Alves",
    email: "fernando.alves@escolaa.com.br",
    phone: "(11) 98888-6666",
    schoolId: "escola-2",
    subjects: ["Educação Física", "Inglês"],
  },
]

// Generate sample students (10 per class)
export const SAMPLE_STUDENTS: Student[] = SAMPLE_CLASSES.flatMap((classItem, classIndex) =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `student-${classIndex * 10 + i + 1}`,
    name: `Aluno ${classIndex * 10 + i + 1}`,
    email: `aluno${classIndex * 10 + i + 1}@email.com`,
    phone: `(11) 99999-${String(classIndex * 10 + i + 1).padStart(4, "0")}`,
    classId: classItem.id,
    enrollmentDate: "2024-02-01",
    status: "active" as const,
  })),
)

// Generate sample attendance (last 30 days)
export const SAMPLE_ATTENDANCE: Attendance[] = SAMPLE_STUDENTS.flatMap((student) =>
  Array.from({ length: 20 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return {
      id: `attendance-${student.id}-${i}`,
      studentId: student.id,
      classId: student.classId,
      date: date.toISOString().split("T")[0],
      present: Math.random() > 0.1, // 90% attendance rate
    }
  }),
)

// Generate sample grades
export const SAMPLE_GRADES: Grade[] = SAMPLE_STUDENTS.flatMap((student) =>
  ["Matemática", "Português", "Ciências", "História"].map((subject, i) => ({
    id: `grade-${student.id}-${i}`,
    studentId: student.id,
    classId: student.classId,
    subject,
    value: Math.floor(Math.random() * 4) + 6, // Grades between 6-10
    maxValue: 10,
    period: "1º Bimestre",
  })),
)

// Sample Exams (4 simulados per year)
export const SAMPLE_EXAMS: Exam[] = [
  { id: "exam-1", name: "1º Simulado", number: 1, date: "2024-03-15" },
  { id: "exam-2", name: "2º Simulado", number: 2, date: "2024-05-20" },
  { id: "exam-3", name: "3º Simulado", number: 3, date: "2024-08-10" },
  { id: "exam-4", name: "4º Simulado", number: 4, date: "2024-10-25" },
]

// Generate sample exam results for all students
export const SAMPLE_EXAM_RESULTS: ExamResult[] = SAMPLE_STUDENTS.flatMap((student) =>
  SAMPLE_EXAMS.map((exam) => {
    // Generate realistic progressive scores (students improve over time)
    const baseScore = 5 + Math.random() * 3 // Base between 5-8
    const progression = (exam.number - 1) * 0.3 // Improvement over exams

    const generateScore = () => {
      const score = baseScore + progression + (Math.random() * 1.5 - 0.5)
      return Math.min(10, Math.max(0, Number(score.toFixed(1))))
    }

    return {
      id: `exam-result-${student.id}-${exam.id}`,
      studentId: student.id,
      classId: student.classId,
      examId: exam.id,
      portugueseCriteria: {
        criterio1: generateScore(),
        criterio2: generateScore(),
        criterio3: generateScore(),
        criterio4: generateScore(),
        criterio5: generateScore(),
        criterio6: generateScore(),
      },
      mathCriteria: {
        criterio1: generateScore(),
        criterio2: generateScore(),
        criterio3: generateScore(),
        criterio4: generateScore(),
      },
    }
  }),
)

// Helper function to calculate Portuguese average
export const calculatePortugueseAverage = (criteria: ExamResult["portugueseCriteria"]) => {
  const values = Object.values(criteria)
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

// Helper function to calculate Math average
export const calculateMathAverage = (criteria: ExamResult["mathCriteria"]) => {
  const values = Object.values(criteria)
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

// Helper function to calculate general average (Portuguese + Math)
export const calculateGeneralAverage = (result: ExamResult) => {
  const portugueseAvg = calculatePortugueseAverage(result.portugueseCriteria)
  const mathAvg = calculateMathAverage(result.mathCriteria)
  return (portugueseAvg + mathAvg) / 2
}

// Sample Enrollments
export const SAMPLE_ENROLLMENTS: Enrollment[] = SAMPLE_STUDENTS.map((student) => ({
  id: `enrollment-${student.id}`,
  studentId: student.id,
  classId: student.classId,
  enrollmentDate: student.enrollmentDate,
  status: "active" as const,
}))

// Sample Transfers
export const SAMPLE_TRANSFERS: Transfer[] = [
  {
    id: "transfer-1",
    studentId: "student-1",
    fromClassId: "turma-1",
    toClassId: "turma-2",
    transferDate: "2024-03-15",
    reason: "Mudança de turno",
    status: "approved",
  },
  {
    id: "transfer-2",
    studentId: "student-15",
    fromClassId: "turma-2",
    toClassId: "turma-3",
    transferDate: "2024-04-01",
    reason: "Melhor adequação ao nível",
    status: "pending",
  },
]
