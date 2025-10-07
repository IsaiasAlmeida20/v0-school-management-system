"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  SAMPLE_CLASSES,
  SAMPLE_STUDENTS,
  SAMPLE_EXAMS,
  SAMPLE_EXAM_RESULTS,
  calculatePortugueseAverage,
  calculateMathAverage,
  calculateGeneralAverage,
} from "@/lib/sample-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

const PORTUGUESE_CRITERIA = [
  { key: "criterio1", name: "Leitura" },
  { key: "criterio2", name: "Interpretação" },
  { key: "criterio3", name: "Gramática" },
  { key: "criterio4", name: "Produção Textual" },
  { key: "criterio5", name: "Ortografia" },
  { key: "criterio6", name: "Coesão e Coerência" },
]

const MATH_CRITERIA = [
  { key: "criterio1", name: "Números e Operações" },
  { key: "criterio2", name: "Geometria" },
  { key: "criterio3", name: "Grandezas e Medidas" },
  { key: "criterio4", name: "Tratamento da Informação" },
]

export default function PerformancePage() {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<string>("")

  // Filter classes based on user role
  let availableClasses = SAMPLE_CLASSES
  if (user?.role === "coordenador") {
    availableClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user.schoolId)
  } else if (user?.role === "professor") {
    availableClasses = SAMPLE_CLASSES.filter((c) => c.teacherId === user.id)
  }

  // Get students for selected class
  const availableStudents = selectedClass ? SAMPLE_STUDENTS.filter((s) => s.classId === selectedClass) : []

  // Calculate performance data based on selection
  const getPerformanceData = () => {
    if (selectedStudent) {
      // Individual student view
      return SAMPLE_EXAMS.map((exam) => {
        const result = SAMPLE_EXAM_RESULTS.find((r) => r.studentId === selectedStudent && r.examId === exam.id)

        if (!result) {
          return {
            exam: exam.name,
            geral: 0,
            portugues: 0,
            matematica: 0,
          }
        }

        return {
          exam: exam.name,
          geral: Number(calculateGeneralAverage(result).toFixed(1)),
          portugues: Number(calculatePortugueseAverage(result.portugueseCriteria).toFixed(1)),
          matematica: Number(calculateMathAverage(result.mathCriteria).toFixed(1)),
        }
      })
    } else if (selectedClass) {
      // Class view
      return SAMPLE_EXAMS.map((exam) => {
        const examResults = SAMPLE_EXAM_RESULTS.filter(
          (result) => result.examId === exam.id && result.classId === selectedClass,
        )

        if (examResults.length === 0) {
          return {
            exam: exam.name,
            geral: 0,
            portugues: 0,
            matematica: 0,
          }
        }

        const generalAvg =
          examResults.reduce((sum, result) => sum + calculateGeneralAverage(result), 0) / examResults.length

        const portugueseAvg =
          examResults.reduce((sum, result) => sum + calculatePortugueseAverage(result.portugueseCriteria), 0) /
          examResults.length

        const mathAvg =
          examResults.reduce((sum, result) => sum + calculateMathAverage(result.mathCriteria), 0) / examResults.length

        return {
          exam: exam.name,
          geral: Number(generalAvg.toFixed(1)),
          portugues: Number(portugueseAvg.toFixed(1)),
          matematica: Number(mathAvg.toFixed(1)),
        }
      })
    }

    return []
  }

  // Get criteria-specific data for individual student
  const getCriteriaData = (subject: "portugues" | "matematica", criteriaKey: string) => {
    if (!selectedStudent) return []

    return SAMPLE_EXAMS.map((exam) => {
      const result = SAMPLE_EXAM_RESULTS.find((r) => r.studentId === selectedStudent && r.examId === exam.id)

      if (!result) {
        return { exam: exam.name, value: 0 }
      }

      const value =
        subject === "portugues"
          ? result.portugueseCriteria[criteriaKey as keyof typeof result.portugueseCriteria]
          : result.mathCriteria[criteriaKey as keyof typeof result.mathCriteria]

      return {
        exam: exam.name,
        value: Number(value.toFixed(1)),
      }
    })
  }

  const performanceData = getPerformanceData()
  const selectedStudentData = selectedStudent ? SAMPLE_STUDENTS.find((s) => s.id === selectedStudent) : null
  const selectedClassData = selectedClass ? SAMPLE_CLASSES.find((c) => c.id === selectedClass) : null

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Desempenho Detalhado</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Análise de desempenho por turma e aluno</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={selectedClass}
          onValueChange={(value) => {
            setSelectedClass(value)
            setSelectedStudent("")
          }}
        >
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent>
            {availableClasses.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedClass && (
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Selecione um aluno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os alunos</SelectItem>
              {availableStudents.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {performanceData.length > 0 && (
        <>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {selectedStudentData
                    ? `Desempenho de ${selectedStudentData.name}`
                    : selectedClassData
                      ? `Desempenho da ${selectedClassData.name}`
                      : "Selecione uma turma"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedStudentData
                    ? "Análise individual com detalhamento por critério"
                    : "Média geral da turma nos 4 simulados"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Desempenho Geral</CardTitle>
                <p className="text-xs text-muted-foreground">Português + Matemática</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="geral" fill="#3b82f6" name="Média Geral" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Desempenho em Português</CardTitle>
                <p className="text-xs text-muted-foreground">Média de todos os critérios</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="portugues" fill="#10b981" name="Português" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Desempenho em Matemática</CardTitle>
                <p className="text-xs text-muted-foreground">Média de todos os critérios</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="matematica" fill="#f59e0b" name="Matemática" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {selectedStudent && (
            <>
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold">Análise por Critério - Português</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {PORTUGUESE_CRITERIA.map((criteria) => (
                    <Card key={criteria.key}>
                      <CardHeader>
                        <CardTitle className="text-sm">{criteria.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={getCriteriaData("portugues", criteria.key)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="exam" tick={{ fontSize: 10 }} />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#10b981" name={criteria.name} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold">Análise por Critério - Matemática</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {MATH_CRITERIA.map((criteria) => (
                    <Card key={criteria.key}>
                      <CardHeader>
                        <CardTitle className="text-sm">{criteria.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={getCriteriaData("matematica", criteria.key)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="exam" tick={{ fontSize: 10 }} />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#f59e0b" name={criteria.name} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {!selectedClass && (
        <Card>
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Selecione uma turma</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Escolha uma turma acima para visualizar os gráficos de desempenho
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
