"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  SAMPLE_SCHOOLS,
  SAMPLE_CLASSES,
  SAMPLE_EXAMS,
  SAMPLE_EXAM_RESULTS,
  calculatePortugueseAverage,
  calculateMathAverage,
  calculateGeneralAverage,
} from "@/lib/sample-data"
import { School, Users, GraduationCap, UserCheck } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AdminDashboard() {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("all")
  const [selectedClassId, setSelectedClassId] = useState<string>("all")

  const availableClasses =
    selectedSchoolId !== "all" ? SAMPLE_CLASSES.filter((c) => c.schoolId === selectedSchoolId) : []

  const getPerformanceData = () => {
    // Filter exam results based on selection
    let filteredResults = SAMPLE_EXAM_RESULTS

    if (selectedClassId !== "all") {
      // Show specific class data
      filteredResults = SAMPLE_EXAM_RESULTS.filter((result) => result.classId === selectedClassId)
    } else if (selectedSchoolId !== "all") {
      // Show school-wide data (all classes in the school)
      const schoolClassIds = SAMPLE_CLASSES.filter((c) => c.schoolId === selectedSchoolId).map((c) => c.id)
      filteredResults = SAMPLE_EXAM_RESULTS.filter((result) => schoolClassIds.includes(result.classId))
    }
    // If no selection, show all data

    if (filteredResults.length === 0) {
      return []
    }

    // Group results by exam
    const examGroups: Record<string, typeof SAMPLE_EXAM_RESULTS> = {}
    filteredResults.forEach((result) => {
      if (!examGroups[result.examId]) {
        examGroups[result.examId] = []
      }
      examGroups[result.examId].push(result)
    })

    // Calculate averages for each exam
    return SAMPLE_EXAMS.map((exam) => {
      const examResults = examGroups[exam.id] || []

      if (examResults.length === 0) {
        return {
          name: exam.name,
          geral: 0,
          portugues: 0,
          matematica: 0,
        }
      }

      // Calculate averages using helper functions
      const portugueseScores = examResults.map((r) => calculatePortugueseAverage(r.portugueseCriteria))
      const mathScores = examResults.map((r) => calculateMathAverage(r.mathCriteria))
      const generalScores = examResults.map((r) => calculateGeneralAverage(r))

      const avgPortuguese = portugueseScores.reduce((sum, score) => sum + score, 0) / portugueseScores.length
      const avgMath = mathScores.reduce((sum, score) => sum + score, 0) / mathScores.length
      const avgGeneral = generalScores.reduce((sum, score) => sum + score, 0) / generalScores.length

      return {
        name: exam.name,
        geral: Number(avgGeneral.toFixed(1)) || 0,
        portugues: Number(avgPortuguese.toFixed(1)) || 0,
        matematica: Number(avgMath.toFixed(1)) || 0,
      }
    })
  }

  const performanceData = getPerformanceData()

  const totalSchools = SAMPLE_SCHOOLS.length
  const totalClasses = selectedSchoolId !== "all" ? availableClasses.length : SAMPLE_CLASSES.length
  const totalTeachers =
    selectedSchoolId !== "all"
      ? SAMPLE_SCHOOLS.find((s) => s.id === selectedSchoolId)?.totalTeachers || 0
      : SAMPLE_SCHOOLS.reduce((sum, s) => sum + s.totalTeachers, 0)
  const totalStudents =
    selectedSchoolId !== "all"
      ? SAMPLE_SCHOOLS.find((s) => s.id === selectedSchoolId)?.totalStudents || 0
      : SAMPLE_SCHOOLS.reduce((sum, s) => sum + s.totalStudents, 0)

  const stats = [
    {
      title: "Escolas",
      value: selectedSchoolId !== "all" ? 1 : totalSchools,
      icon: School,
      description: selectedSchoolId !== "all" ? "Escola selecionada" : "Escolas na rede",
    },
    {
      title: "Turmas",
      value: totalClasses,
      icon: Users,
      description: "Turmas ativas",
    },
    {
      title: "Professores",
      value: totalTeachers,
      icon: GraduationCap,
      description: "Professores cadastrados",
    },
    {
      title: "Alunos",
      value: totalStudents,
      icon: UserCheck,
      description: "Alunos matriculados",
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Visão Geral da Rede</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Acompanhe as métricas principais do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Visualização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Escola</label>
              <Select
                value={selectedSchoolId}
                onValueChange={(value) => {
                  setSelectedSchoolId(value)
                  setSelectedClassId("all")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as escolas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as escolas</SelectItem>
                  {SAMPLE_SCHOOLS.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Turma</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId} disabled={selectedSchoolId === "all"}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedSchoolId !== "all" ? "Todas as turmas" : "Selecione uma escola"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as turmas</SelectItem>
                  {availableClasses.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho Geral</CardTitle>
            <p className="text-sm text-muted-foreground">Média de Português + Matemática</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="geral" fill="#3b82f6" name="Média Geral" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho em Português</CardTitle>
            <p className="text-sm text-muted-foreground">Média por simulado</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="portugues" fill="#10b981" name="Português" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho em Matemática</CardTitle>
            <p className="text-sm text-muted-foreground">Média por simulado</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="matematica" fill="#f59e0b" name="Matemática" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Escolas da Rede</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SAMPLE_SCHOOLS.map((school) => (
                <div
                  key={school.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {school.totalStudents} alunos • {school.totalTeachers} professores
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Ativa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted">
                <p className="font-medium">Cadastrar Nova Escola</p>
                <p className="text-sm text-muted-foreground">Adicionar escola à rede</p>
              </button>
              <button className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted">
                <p className="font-medium">Gerenciar Usuários</p>
                <p className="text-sm text-muted-foreground">Adicionar coordenadores e professores</p>
              </button>
              <button className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted">
                <p className="font-medium">Relatórios Gerais</p>
                <p className="text-sm text-muted-foreground">Visualizar relatórios da rede</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
