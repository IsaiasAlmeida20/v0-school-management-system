"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SAMPLE_SCHOOLS, SAMPLE_CLASSES, SAMPLE_STUDENTS, SAMPLE_TEACHERS } from "@/lib/sample-data"
import { Users, GraduationCap, UserCheck } from "lucide-react"

export function CoordinatorDashboard() {
  const { user } = useAuth()

  // Get coordinator's school data
  const school = SAMPLE_SCHOOLS.find((s) => s.id === user?.schoolId)
  const schoolClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user?.schoolId)
  const schoolStudents = SAMPLE_STUDENTS.filter((s) => schoolClasses.some((c) => c.id === s.classId))
  const schoolTeachers = SAMPLE_TEACHERS.filter((t) => t.schoolId === user?.schoolId)

  if (!school) {
    return <div>Escola não encontrada</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{school.name}</h1>
        <p className="text-muted-foreground">Métricas e relatórios da sua escola</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Turmas da Escola</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schoolClasses.map((classItem) => {
              const classStudents = SAMPLE_STUDENTS.filter((s) => s.classId === classItem.id)
              const teacher = SAMPLE_TEACHERS.find((t) => t.id === classItem.teacherId)

              return (
                <div key={classItem.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{classItem.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher?.name} • {classStudents.length} alunos
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">{classItem.shift}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
