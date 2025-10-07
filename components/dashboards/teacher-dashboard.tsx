"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SAMPLE_CLASSES, SAMPLE_STUDENTS, SAMPLE_GRADES, SAMPLE_ATTENDANCE } from "@/lib/sample-data"
import { ClipboardList, Award, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Progress } from "@/components/ui/progress"

export function TeacherDashboard() {
  const { user } = useAuth()

  const teacherClasses = SAMPLE_CLASSES.filter((c) => user?.classIds?.includes(c.id))
  const teacherStudents = SAMPLE_STUDENTS.filter((s) => teacherClasses.some((c) => c.id === s.classId))

  const classesPerformance = teacherClasses.map((classItem) => {
    const classStudents = SAMPLE_STUDENTS.filter((s) => s.classId === classItem.id)
    const classGrades = SAMPLE_GRADES.filter((g) => g.classId === classItem.id)
    const classAttendance = SAMPLE_ATTENDANCE.filter((a) => a.classId === classItem.id)

    const avgGrade = classGrades.length > 0 ? classGrades.reduce((sum, g) => sum + g.value, 0) / classGrades.length : 0

    const attRate =
      classAttendance.length > 0
        ? Math.round((classAttendance.filter((a) => a.present).length / classAttendance.length) * 100)
        : 0

    return {
      classItem,
      name: classItem.name,
      students: classStudents.length,
      average: isNaN(avgGrade) ? 0 : Number(avgGrade.toFixed(1)),
      attendance: attRate,
    }
  })

  const teacherGrades = SAMPLE_GRADES.filter((g) => teacherClasses.some((c) => c.id === g.classId))
  const teacherAttendance = SAMPLE_ATTENDANCE.filter((a) => teacherClasses.some((c) => c.id === a.classId))

  const avgGradeCalc =
    teacherGrades.length > 0 ? teacherGrades.reduce((sum, g) => sum + g.value, 0) / teacherGrades.length : 0

  const avgGrade = isNaN(avgGradeCalc) ? "0.0" : avgGradeCalc.toFixed(1)

  const attRate =
    teacherAttendance.length > 0
      ? Math.round((teacherAttendance.filter((a) => a.present).length / teacherAttendance.length) * 100)
      : 0

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Minhas Turmas</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Atalhos rápidos para frequência e notas</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgGrade}</div>
            <Progress value={Number(avgGrade) * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequência</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attRate}%</div>
            <Progress value={attRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {classesPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Desempenho das Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={classesPerformance}>
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

      <div className="grid gap-4 lg:grid-cols-2">
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
              {classesPerformance.map((item) => (
                <div key={item.classItem.id} className="rounded-lg border p-3">
                  <p className="font-medium">{item.classItem.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.students} alunos • Turno: {item.classItem.shift}
                  </p>
                  <div className="mt-2 flex gap-4 text-xs">
                    <span>
                      <span className="text-muted-foreground">Média: </span>
                      <span className="font-medium">{isNaN(item.average) ? "0.0" : item.average.toFixed(1)}</span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Freq: </span>
                      <span className="font-medium">{item.attendance}%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
