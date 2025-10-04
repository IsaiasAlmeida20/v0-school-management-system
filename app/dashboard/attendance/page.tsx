"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SAMPLE_ATTENDANCE, SAMPLE_STUDENTS, SAMPLE_CLASSES, SAMPLE_SCHOOLS } from "@/lib/sample-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Check, X, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AttendancePage() {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])

  // Filter classes based on user role
  let availableClasses = SAMPLE_CLASSES
  if (user?.role === "coordenador") {
    availableClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user.schoolId)
  } else if (user?.role === "professor") {
    availableClasses = SAMPLE_CLASSES.filter((c) => user.classIds?.includes(c.id))
  }

  // Get students for selected class
  const classStudents = selectedClass ? SAMPLE_STUDENTS.filter((s) => s.classId === selectedClass) : []

  // Get attendance for selected date and class
  const attendanceRecords = SAMPLE_ATTENDANCE.filter((a) => a.classId === selectedClass && a.date === selectedDate)

  // Calculate attendance stats
  const presentCount = attendanceRecords.filter((a) => a.present).length
  const absentCount = attendanceRecords.filter((a) => !a.present).length
  const attendanceRate = classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 0

  const canManageAttendance = user?.role === "professor" || user?.role === "coordenador" || user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Frequência</h1>
          <p className="text-muted-foreground">Registre e acompanhe a frequência dos alunos</p>
        </div>
        {canManageAttendance && selectedClass && (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Presença</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {presentCount} de {classStudents.length} alunos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presentes</CardTitle>
            <Check className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentCount}</div>
            <p className="text-xs text-muted-foreground">alunos presentes hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausentes</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentCount}</div>
            <p className="text-xs text-muted-foreground">alunos ausentes hoje</p>
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

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {selectedClass ? (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Presença</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  {canManageAttendance && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((student) => {
                  const attendance = attendanceRecords.find((a) => a.studentId === student.id)
                  const isPresent = attendance?.present ?? false

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-muted-foreground">{student.email}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={isPresent ? "default" : "destructive"}
                          className={isPresent ? "bg-secondary text-secondary-foreground" : ""}
                        >
                          {isPresent ? "Presente" : "Ausente"}
                        </Badge>
                      </TableCell>
                      {canManageAttendance && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant={isPresent ? "default" : "outline"}
                              className={isPresent ? "bg-secondary text-secondary-foreground" : ""}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant={!isPresent ? "destructive" : "outline"}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
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
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Selecione uma turma</p>
            <p className="text-sm text-muted-foreground">Escolha uma turma para registrar a frequência</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
