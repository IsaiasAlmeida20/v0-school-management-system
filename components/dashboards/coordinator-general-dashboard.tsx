"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SAMPLE_SCHOOLS, SAMPLE_CLASSES, SAMPLE_STUDENTS } from "@/lib/sample-data"
import { School, Users, TrendingUp } from "lucide-react"

export function CoordinatorGeneralDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coordenação Geral</h1>
        <p className="text-muted-foreground">Comparativo entre escolas e turmas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Escolas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{SAMPLE_SCHOOLS.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{SAMPLE_CLASSES.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Alunos/Turma</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(SAMPLE_STUDENTS.length / SAMPLE_CLASSES.length)}</div>
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
              const schoolStudents = SAMPLE_STUDENTS.filter((s) => schoolClasses.some((c) => c.id === s.classId))

              return (
                <div key={school.id} className="rounded-lg border p-4">
                  <h3 className="font-semibold">{school.name}</h3>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Turmas</p>
                      <p className="text-lg font-semibold">{schoolClasses.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Alunos</p>
                      <p className="text-lg font-semibold">{schoolStudents.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Professores</p>
                      <p className="text-lg font-semibold">{school.totalTeachers}</p>
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
