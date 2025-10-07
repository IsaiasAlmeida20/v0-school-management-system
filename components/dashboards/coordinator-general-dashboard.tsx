"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SAMPLE_SCHOOLS, SAMPLE_CLASSES, SAMPLE_EXAMS } from "@/lib/sample-data"
import { School, Users, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function CoordinatorGeneralDashboard() {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("all")
  const [selectedClassId, setSelectedClassId] = useState<string>("all")

  const availableClasses =
    selectedSchoolId !== "all" ? SAMPLE_CLASSES.filter((c) => c.schoolId === selectedSchoolId) : []

  const getPerformanceData = () => {
    let filteredExams = SAMPLE_EXAMS

    if (selectedClassId !== "all") {
      filteredExams = SAMPLE_EXAMS.filter((exam) => exam.classId === selectedClassId)
    } else if (selectedSchoolId !== "all") {
      const schoolClassIds = SAMPLE_CLASSES.filter((c) => c.schoolId === selectedSchoolId).map((c) => c.id)
      filteredExams = SAMPLE_EXAMS.filter((exam) => schoolClassIds.includes(exam.classId))
    }

    if (filteredExams.length === 0) {
      return []
    }

    const simuladoData: Record<string, { portuguese: number[]; math: number[]; count: number }> = {}

    filteredExams.forEach((exam) => {
      if (!simuladoData[exam.simulado]) {
        simuladoData[exam.simulado] = { portuguese: [], math: [], count: 0 }
      }
      simuladoData[exam.simulado].portuguese.push(exam.portugueseGrade)
      simuladoData[exam.simulado].math.push(exam.mathGrade)
      simuladoData[exam.simulado].count++
    })

    return Object.entries(simuladoData).map(([simulado, data]) => {
      const avgPortuguese =
        data.portuguese.length > 0 ? data.portuguese.reduce((a, b) => a + b, 0) / data.portuguese.length : 0
      const avgMath = data.math.length > 0 ? data.math.reduce((a, b) => a + b, 0) / data.math.length : 0
      const avgGeneral = (avgPortuguese + avgMath) / 2

      return {
        name: simulado,
        geral: Number(avgGeneral.toFixed(1)),
        portugues: Number(avgPortuguese.toFixed(1)),
        matematica: Number(avgMath.toFixed(1)),
      }
    })
  }

  const performanceData = getPerformanceData()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Coordenação Geral</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Comparativo entre escolas e turmas</p>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Escolas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedSchoolId !== "all" ? 1 : SAMPLE_SCHOOLS.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedSchoolId !== "all" ? availableClasses.length : SAMPLE_CLASSES.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.length > 0
                ? (performanceData.reduce((sum, d) => sum + d.geral, 0) / performanceData.length).toFixed(1)
                : "0.0"}
            </div>
          </CardContent>
        </Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Comparativo por Escola</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SAMPLE_SCHOOLS.map((school) => {
              const schoolClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === school.id)
              const schoolStudents = SAMPLE_CLASSES.filter((c) => c.schoolId === school.id).reduce(
                (sum, c) => sum + c.studentCount,
                0,
              )
              const schoolTeachers = school.totalTeachers
              const avgGrade = "7.5"
              const attRate = "92"

              return (
                <div key={school.id} className="rounded-lg border p-4">
                  <h3 className="font-semibold">{school.name}</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3 lg:grid-cols-5">
                    <div>
                      <p className="text-muted-foreground">Turmas</p>
                      <p className="text-lg font-semibold">{schoolClasses.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Alunos</p>
                      <p className="text-lg font-semibold">{schoolStudents}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Professores</p>
                      <p className="text-lg font-semibold">{schoolTeachers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Média</p>
                      <p className="text-lg font-semibold">{avgGrade}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Frequência</p>
                      <p className="text-lg font-semibold">{attRate}%</p>
                    </div>
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
