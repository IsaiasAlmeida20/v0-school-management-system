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
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function ReportsPage() {
  const { user } = useAuth()
  const [selectedSchool, setSelectedSchool] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current")

  let availableSchools = SAMPLE_SCHOOLS
  let availableClasses = SAMPLE_CLASSES

  if (user?.role === "coordenador") {
    availableSchools = SAMPLE_SCHOOLS.filter((s) => s.id === user.schoolId)
    availableClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user.schoolId)
  }

  const filteredClasses =
    selectedSchool === "all" ? availableClasses : availableClasses.filter((c) => c.schoolId === selectedSchool)

  const filteredStudents = SAMPLE_STUDENTS.filter((s) => filteredClasses.some((c) => c.id === s.classId))

  const totalStudents = filteredStudents.length
  const totalClasses = filteredClasses.length

  const relevantAttendance = SAMPLE_ATTENDANCE.filter((a) => filteredClasses.some((c) => c.id === a.classId))
  const attendanceRate =
    relevantAttendance.length > 0
      ? Math.round((relevantAttendance.filter((a) => a.present).length / relevantAttendance.length) * 100)
      : 0

  const relevantGrades = SAMPLE_GRADES.filter((g) => filteredClasses.some((c) => c.id === g.classId))
  const averageGrade =
    relevantGrades.length > 0
      ? (relevantGrades.reduce((sum, g) => sum + g.value, 0) / relevantGrades.length).toFixed(1)
      : "0.0"

  const studentAverages = filteredStudents.map((student) => {
    const studentGrades = relevantGrades.filter((g) => g.studentId === student.id)
    const avg = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g.value, 0) / studentGrades.length : 0
    return avg
  })
  const approvalRate =
    studentAverages.length > 0
      ? Math.round((studentAverages.filter((avg) => avg >= 7).length / studentAverages.length) * 100)
      : 0

  const classPerformance = filteredClasses.map((classItem) => {
    const classStudents = SAMPLE_STUDENTS.filter((s) => s.classId === classItem.id)
    const classGrades = SAMPLE_GRADES.filter((g) => g.classId === classItem.id)
    const classAttendance = SAMPLE_ATTENDANCE.filter((a) => a.classId === classItem.id)

    const avgGrade = classGrades.length > 0 ? classGrades.reduce((sum, g) => sum + g.value, 0) / classGrades.length : 0

    const attRate =
      classAttendance.length > 0
        ? Math.round((classAttendance.filter((a) => a.present).length / classAttendance.length) * 100)
        : 0

    return {
      class: classItem,
      name: classItem.name,
      students: classStudents.length,
      averageGrade: Number(avgGrade.toFixed(1)),
      attendanceRate: attRate,
    }
  })

  const subjects = Array.from(new Set(relevantGrades.map((g) => g.subject)))
  const subjectPerformance = subjects.map((subject) => {
    const subjectGrades = relevantGrades.filter((g) => g.subject === subject)
    const avg = subjectGrades.length > 0 ? subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length : 0
    return {
      subject,
      average: Number(avg.toFixed(1)),
      name: subject,
    }
  })

  const trendData = [
    { month: "Jan", attendance: 82, average: 7.2, approval: 78 },
    { month: "Fev", attendance: 85, average: 7.5, approval: 80 },
    { month: "Mar", attendance: 87, average: 7.8, approval: 83 },
    { month: "Abr", attendance: 86, average: 7.6, approval: 82 },
    { month: "Mai", attendance: 88, average: 7.9, approval: 85 },
    { month: "Jun", attendance: attendanceRate, average: Number(averageGrade), approval: approvalRate },
  ]

  const gradeDistribution = [
    { range: "0-4", count: studentAverages.filter((avg) => avg < 5).length },
    { range: "5-6", count: studentAverages.filter((avg) => avg >= 5 && avg < 7).length },
    { range: "7-8", count: studentAverages.filter((avg) => avg >= 7 && avg < 9).length },
    { range: "9-10", count: studentAverages.filter((avg) => avg >= 9).length },
  ]

  const schoolComparison = availableSchools.map((school) => {
    const schoolClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === school.id)
    const schoolStudents = SAMPLE_STUDENTS.filter((s) => schoolClasses.some((c) => c.id === s.classId))
    const schoolGrades = SAMPLE_GRADES.filter((g) => schoolClasses.some((c) => c.id === g.classId))
    const schoolAttendance = SAMPLE_ATTENDANCE.filter((a) => schoolClasses.some((c) => c.id === a.classId))

    const avgGrade =
      schoolGrades.length > 0
        ? Number((schoolGrades.reduce((sum, g) => sum + g.value, 0) / schoolGrades.length).toFixed(1))
        : 0

    const attRate =
      schoolAttendance.length > 0
        ? Math.round((schoolAttendance.filter((a) => a.present).length / schoolAttendance.length) * 100)
        : 0

    return {
      name: school.name,
      students: schoolStudents.length,
      average: avgGrade,
      attendance: attRate,
    }
  })

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Relatórios e Desempenho</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Análise completa do desempenho acadêmico</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {(user?.role === "admin" || user?.role === "coordenador_geral") && schoolComparison.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparação entre Escolas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={schoolComparison}>
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
      )}

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="classes">Por Turma</TabsTrigger>
          <TabsTrigger value="subjects">Por Disciplina</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Turma</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageGrade" fill="#3b82f6" name="Média" />
                  <Bar dataKey="attendanceRate" fill="#10b981" name="Frequência %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes por Turma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {classPerformance.map((item) => {
                const school = SAMPLE_SCHOOLS.find((s) => s.id === item.class.schoolId)
                return (
                  <div key={item.class.id} className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">{item.class.name}</p>
                        <p className="text-sm text-muted-foreground">{school?.name}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-medium">Média: {item.averageGrade.toFixed(1)}</p>
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
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis dataKey="subject" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3b82f6" name="Média">
                    {subjectPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="#10b981" name="Frequência %" strokeWidth={2} />
                  <Line type="monotone" dataKey="average" stroke="#3b82f6" name="Média" strokeWidth={2} />
                  <Line type="monotone" dataKey="approval" stroke="#f59e0b" name="Aprovação %" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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
