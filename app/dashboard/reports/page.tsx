"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SAMPLE_SCHOOLS, SAMPLE_CLASSES, SAMPLE_STUDENTS, SAMPLE_ATTENDANCE, SAMPLE_GRADES } from "@/lib/sample-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, GraduationCap, Download, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ReportsPage() {
  const { user } = useAuth()
  const [selectedSchool, setSelectedSchool] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current")

  // Filter data based on user role
  let availableSchools = SAMPLE_SCHOOLS
  let availableClasses = SAMPLE_CLASSES

  if (user?.role === "coordenador") {
    availableSchools = SAMPLE_SCHOOLS.filter((s) => s.id === user.schoolId)
    availableClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user.schoolId)
    setSelectedSchool(user.schoolId || "all")
  }

  // Filter by selected school
  const filteredClasses =
    selectedSchool === "all" ? availableClasses : availableClasses.filter((c) => c.schoolId === selectedSchool)

  const filteredStudents = SAMPLE_STUDENTS.filter((s) => filteredClasses.some((c) => c.id === s.classId))

  // Calculate overall statistics
  const totalStudents = filteredStudents.length
  const totalClasses = filteredClasses.length

  // Calculate attendance rate
  const relevantAttendance = SAMPLE_ATTENDANCE.filter((a) => filteredClasses.some((c) => c.id === a.classId))
  const attendanceRate =
    relevantAttendance.length > 0
      ? Math.round((relevantAttendance.filter((a) => a.present).length / relevantAttendance.length) * 100)
      : 0

  // Calculate average grade
  const relevantGrades = SAMPLE_GRADES.filter((g) => filteredClasses.some((c) => c.id === g.classId))
  const averageGrade =
    relevantGrades.length > 0
      ? (relevantGrades.reduce((sum, g) => sum + g.value, 0) / relevantGrades.length).toFixed(1)
      : "0.0"

  // Calculate approval rate
  const studentAverages = filteredStudents.map((student) => {
    const studentGrades = relevantGrades.filter((g) => g.studentId === student.id)
    const avg = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g.value, 0) / studentGrades.length : 0
    return avg
  })
  const approvalRate =
    studentAverages.length > 0
      ? Math.round((studentAverages.filter((avg) => avg >= 7).length / studentAverages.length) * 100)
      : 0

  // Performance by class
  const classPerformance = filteredClasses.map((classItem) => {
    const classStudents = SAMPLE_STUDENTS.filter((s) => s.classId === classItem.id)
    const classGrades = SAMPLE_GRADES.filter((g) => g.classId === classItem.id)
    const classAttendance = SAMPLE_ATTENDANCE.filter((a) => a.classId === classItem.id)

    const avgGrade =
      classGrades.length > 0
        ? (classGrades.reduce((sum, g) => sum + g.value, 0) / classGrades.length).toFixed(1)
        : "0.0"

    const attRate =
      classAttendance.length > 0
        ? Math.round((classAttendance.filter((a) => a.present).length / classAttendance.length) * 100)
        : 0

    return {
      class: classItem,
      students: classStudents.length,
      averageGrade: avgGrade,
      attendanceRate: attRate,
    }
  })

  // Performance by subject
  const subjects = Array.from(new Set(relevantGrades.map((g) => g.subject)))
  const subjectPerformance = subjects.map((subject) => {
    const subjectGrades = relevantGrades.filter((g) => g.subject === subject)
    const avg =
      subjectGrades.length > 0
        ? (subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length).toFixed(1)
        : "0.0"
    return { subject, average: avg }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Desempenho</h1>
          <p className="text-muted-foreground">Análise completa do desempenho acadêmico</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {(user?.role === "admin" || user?.role === "coordenador_geral") && (
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Todas as escolas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as escolas</SelectItem>
              {availableSchools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Período Atual</SelectItem>
            <SelectItem value="semester">Semestre</SelectItem>
            <SelectItem value="year">Ano Letivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">em {totalClasses} turmas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequência Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <Progress value={attendanceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrade}</div>
            <p className="text-xs text-muted-foreground">de 10.0 pontos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <Progress value={approvalRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classes">Por Turma</TabsTrigger>
          <TabsTrigger value="subjects">Por Disciplina</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Turma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {classPerformance.map((item) => {
                const school = SAMPLE_SCHOOLS.find((s) => s.id === item.class.schoolId)
                return (
                  <div key={item.class.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.class.name}</p>
                        <p className="text-sm text-muted-foreground">{school?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Média: {item.averageGrade}</p>
                        <p className="text-xs text-muted-foreground">{item.students} alunos</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Frequência</span>
                        <span className="font-medium">{item.attendanceRate}%</span>
                      </div>
                      <Progress value={item.attendanceRate} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Disciplina</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectPerformance.map((item) => (
                <div key={item.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm font-medium">Média: {item.average}</p>
                  </div>
                  <Progress value={Number.parseFloat(item.average) * 10} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Tendências</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Evolução da Frequência</span>
                  <span className="text-sm text-secondary">+2.5%</span>
                </div>
                <Progress value={attendanceRate} className="h-2" />
                <p className="text-xs text-muted-foreground">Comparado ao período anterior</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Evolução das Notas</span>
                  <span className="text-sm text-secondary">+0.8</span>
                </div>
                <Progress value={Number.parseFloat(averageGrade) * 10} className="h-2" />
                <p className="text-xs text-muted-foreground">Comparado ao período anterior</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Taxa de Aprovação</span>
                  <span className="text-sm text-secondary">+5.2%</span>
                </div>
                <Progress value={approvalRate} className="h-2" />
                <p className="text-xs text-muted-foreground">Comparado ao período anterior</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Atenção à frequência</p>
                  <p className="text-xs text-muted-foreground">
                    3 turmas apresentam frequência abaixo de 85%. Considere ações de engajamento.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Reforço em Matemática</p>
                  <p className="text-xs text-muted-foreground">
                    A disciplina apresenta média inferior às demais. Recomenda-se aulas de reforço.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Desempenho positivo</p>
                  <p className="text-xs text-muted-foreground">
                    A taxa de aprovação está 5% acima do período anterior. Continue com as estratégias atuais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
