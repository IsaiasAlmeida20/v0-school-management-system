"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SAMPLE_CLASSES, SAMPLE_STUDENTS } from "@/lib/sample-data"
import { ClipboardList, Award, Users } from "lucide-react"
import Link from "next/link"

export function TeacherDashboard() {
  const { user } = useAuth()

  // Get teacher's classes
  const teacherClasses = SAMPLE_CLASSES.filter((c) => user?.classIds?.includes(c.id))
  const teacherStudents = SAMPLE_STUDENTS.filter((s) => teacherClasses.some((c) => c.id === s.classId))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Turmas</h1>
        <p className="text-muted-foreground">Atalhos rápidos para frequência e notas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherClasses.length}</div>
            <p className="text-xs text-muted-foreground">Turmas sob sua responsabilidade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherStudents.length}</div>
            <p className="text-xs text-muted-foreground">Alunos em suas turmas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/attendance">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <ClipboardList className="mr-2 h-4 w-4" />
                Lançar Frequência
              </Button>
            </Link>
            <Link href="/dashboard/grades">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Award className="mr-2 h-4 w-4" />
                Lançar Notas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Minhas Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherClasses.map((classItem) => {
                const classStudents = SAMPLE_STUDENTS.filter((s) => s.classId === classItem.id)

                return (
                  <div key={classItem.id} className="rounded-lg border p-3">
                    <p className="font-medium">{classItem.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {classStudents.length} alunos • Turno: {classItem.shift}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
