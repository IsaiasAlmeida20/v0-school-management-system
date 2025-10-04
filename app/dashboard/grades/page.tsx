"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SAMPLE_GRADES, SAMPLE_STUDENTS, SAMPLE_CLASSES, SAMPLE_SCHOOLS } from "@/lib/sample-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, TrendingUp, TrendingDown, Download } from "lucide-react"

export default function GradesPage() {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  // Filter classes based on user role
  let availableClasses = SAMPLE_CLASSES
  if (user?.role === "coordenador") {
    availableClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user.schoolId)
  } else if (user?.role === "professor") {
    availableClasses = SAMPLE_CLASSES.filter((c) => user.classIds?.includes(c.id))
  }

  // Get students for selected class
  const classStudents = selectedClass ? SAMPLE_STUDENTS.filter((s) => s.classId === selectedClass) : []

  // Get grades for selected class
  const classGrades = SAMPLE_GRADES.filter((g) => g.classId === selectedClass)

  // Get unique subjects
  const subjects = Array.from(new Set(classGrades.map((g) => g.subject)))

  // Filter grades by subject
  const filteredGrades =
    selectedSubject === "all" ? classGrades : classGrades.filter((g) => g.subject === selectedSubject)

  // Calculate class average
  const classAverage =
    filteredGrades.length > 0
      ? (filteredGrades.reduce((sum, g) => sum + g.value, 0) / filteredGrades.length).toFixed(1)
      : "0.0"

  // Count students above/below average
  const studentAverages = classStudents.map((student) => {
    const studentGrades = filteredGrades.filter((g) => g.studentId === student.id)
    const avg = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g.value, 0) / studentGrades.length : 0
    return { studentId: student.id, average: avg }
  })

  const aboveAverage = studentAverages.filter((s) => s.average >= 7).length
  const belowAverage = studentAverages.filter((s) => s.average < 7).length

  const canManageGrades = user?.role === "professor" || user?.role === "coordenador" || user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notas</h1>
          <p className="text-muted-foreground">Gerencie as notas e avaliações dos alunos</p>
        </div>
        {canManageGrades && selectedClass && (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Boletim
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média da Turma</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classAverage}</div>
            <p className="text-xs text-muted-foreground">de 10.0 pontos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acima da Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aboveAverage}</div>
            <p className="text-xs text-muted-foreground">alunos com média ≥ 7.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abaixo da Média</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{belowAverage}</div>
            <p className="text-xs text-muted-foreground">alunos com média {"<"} 7.0</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent>
            {availableClasses.map((classItem) => {
              const school = SAMPLE_SCHOOLS.find((s) => s.id === classItem.schoolId)
              return (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name} - {school?.name}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        {selectedClass && (
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Todas as disciplinas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as disciplinas</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedClass ? (
        <Card>
          <CardHeader>
            <CardTitle>Notas dos Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  {subjects.map((subject) => (
                    <TableHead key={subject} className="text-center">
                      {subject}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Média</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((student) => {
                  const studentGrades = classGrades.filter((g) => g.studentId === student.id)
                  const average =
                    studentGrades.length > 0
                      ? (studentGrades.reduce((sum, g) => sum + g.value, 0) / studentGrades.length).toFixed(1)
                      : "0.0"
                  const isApproved = Number.parseFloat(average) >= 7

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      {subjects.map((subject) => {
                        const grade = studentGrades.find((g) => g.subject === subject)
                        return (
                          <TableCell key={subject} className="text-center">
                            {grade ? (
                              <span className={grade.value >= 7 ? "font-semibold" : "text-muted-foreground"}>
                                {grade.value.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        )
                      })}
                      <TableCell className="text-center font-semibold">{average}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={isApproved ? "default" : "destructive"}
                          className={isApproved ? "bg-secondary text-secondary-foreground" : ""}
                        >
                          {isApproved ? "Aprovado" : "Recuperação"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Selecione uma turma</p>
            <p className="text-sm text-muted-foreground">Escolha uma turma para visualizar as notas</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
