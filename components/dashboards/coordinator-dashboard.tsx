"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SAMPLE_SCHOOLS,
  SAMPLE_CLASSES,
  SAMPLE_STUDENTS,
  SAMPLE_TEACHERS,
  SAMPLE_GRADES,
  SAMPLE_ATTENDANCE,
  SAMPLE_EXAMS,
  SAMPLE_EXAM_RESULTS,
  calculatePortugueseAverage,
  calculateMathAverage,
  calculateGeneralAverage,
} from "@/lib/sample-data"
import { Users, GraduationCap, UserCheck, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function CoordinatorDashboard() {
  const { user } = useAuth()

  const school = SAMPLE_SCHOOLS.find((s) => s.id === user?.schoolId)
  const schoolClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user?.schoolId)
  const schoolStudents = SAMPLE_STUDENTS.filter((s) => schoolClasses.some((c) => c.id === s.classId))
  const schoolTeachers = SAMPLE_TEACHERS.filter((t) => t.schoolId === user?.schoolId)

  const schoolPerformanceData = SAMPLE_EXAMS.map((exam) => {
    const examResults = SAMPLE_EXAM_RESULTS.filter(
      (result) => result.examId === exam.id && schoolClasses.some((c) => c.id === result.classId),
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
      examResults.reduce((sum, result) => {
        const avg = calculateGeneralAverage(result)
        return sum + (isNaN(avg) ? 0 : avg)
      }, 0) / examResults.length

    const portugueseAvg =
      examResults.reduce((sum, result) => {
        const avg = calculatePortugueseAverage(result.portugueseCriteria)
        return sum + (isNaN(avg) ? 0 : avg)
      }, 0) / examResults.length

    const mathAvg =
      examResults.reduce((sum, result) => {
        const avg = calculateMathAverage(result.mathCriteria)
        return sum + (isNaN(avg) ? 0 : avg)
      }, 0) / examResults.length

    return {
      exam: exam.name,
      geral: isNaN(generalAvg) ? 0 : Number(generalAvg.toFixed(1)),
      portugues: isNaN(portugueseAvg) ? 0 : Number(portugueseAvg.toFixed(1)),
      matematica: isNaN(mathAvg) ? 0 : Number(mathAvg.toFixed(1)),
    }
  })

  const schoolAttendance = SAMPLE_ATTENDANCE.filter((a) => schoolClasses.some((c) => c.id === a.classId))

  const attRate =
    schoolAttendance.length > 0
      ? Math.round((schoolAttendance.filter((a) => a.present).length / schoolAttendance.length) * 100)
      : 0

  // Calculate current average from latest exam
  const latestExamData = schoolPerformanceData[schoolPerformanceData.length - 1]
  const avgGrade = latestExamData && !isNaN(latestExamData.geral) ? latestExamData.geral.toFixed(1) : "0.0"

  if (!school) {
    return <div>Escola não encontrada</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{school.name}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Métricas e relatórios da sua escola</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolClasses.length}</div>
            <p className="text-xs text-muted-foreground">Turmas ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolTeachers.length}</div>
            <p className="text-xs text-muted-foreground">Professores ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStudents.length}</div>
            <p className="text-xs text-muted-foreground">Alunos matriculados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgGrade}</div>
            <p className="text-xs text-muted-foreground">Frequência: {attRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Desempenho Geral</CardTitle>
            <p className="text-xs text-muted-foreground">Português + Matemática</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={schoolPerformanceData}>
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
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={schoolPerformanceData}>
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
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={schoolPerformanceData}>
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

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={schoolClasses.map((classItem) => {
                const classStudents = SAMPLE_STUDENTS.filter((s) => s.classId === classItem.id)
                const classGrades = SAMPLE_GRADES.filter((g) => g.classId === classItem.id)
                const classAttendance = SAMPLE_ATTENDANCE.filter((a) => a.classId === classItem.id)

                const avgGrade =
                  classGrades.length > 0 ? classGrades.reduce((sum, g) => sum + g.value, 0) / classGrades.length : 0

                const attRate =
                  classAttendance.length > 0
                    ? Math.round((classAttendance.filter((a) => a.present).length / classAttendance.length) * 100)
                    : 0

                const teacher = SAMPLE_TEACHERS.find((t) => t.id === classItem.teacherId)

                return {
                  classItem,
                  name: classItem.name,
                  students: classStudents.length,
                  average: isNaN(avgGrade) ? 0 : Number(avgGrade.toFixed(1)),
                  attendance: attRate,
                  teacher,
                }
              })}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#3b82f6" name="Média" />
              <Bar dataKey="attendance" fill="#10b981" name="Frequência %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Turmas da Escola</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schoolClasses.map((classItem) => {
              const classStudents = SAMPLE_STUDENTS.filter((s) => s.classId === classItem.id)
              const classGrades = SAMPLE_GRADES.filter((g) => g.classId === classItem.id)
              const classAttendance = SAMPLE_ATTENDANCE.filter((a) => a.classId === classItem.id)

              const avgGrade =
                classGrades.length > 0 ? classGrades.reduce((sum, g) => sum + g.value, 0) / classGrades.length : 0

              const attRate =
                classAttendance.length > 0
                  ? Math.round((classAttendance.filter((a) => a.present).length / classAttendance.length) * 100)
                  : 0

              const teacher = SAMPLE_TEACHERS.find((t) => t.id === classItem.teacherId)

              return (
                <div
                  key={classItem.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{classItem.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher?.name} • {classStudents.length} alunos
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Média: </span>
                      <span className="font-medium">{isNaN(avgGrade) ? "0.0" : avgGrade.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Freq: </span>
                      <span className="font-medium">{attRate}%</span>
                    </div>
                    <div className="capitalize text-muted-foreground">{classItem.shift}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
