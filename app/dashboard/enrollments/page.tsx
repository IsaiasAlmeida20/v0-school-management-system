"use client"
import { useAuth } from "@/lib/auth-context"
import {
  SAMPLE_ENROLLMENTS,
  SAMPLE_STUDENTS,
  SAMPLE_CLASSES,
  SAMPLE_SCHOOLS,
  SAMPLE_TRANSFERS,
} from "@/lib/sample-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, ArrowRightLeft } from "lucide-react"

export default function EnrollmentsPage() {
  const { user } = useAuth()

  // Filter data based on user role
  let availableEnrollments = SAMPLE_ENROLLMENTS
  let availableTransfers = SAMPLE_TRANSFERS

  if (user?.role === "coordenador") {
    const schoolClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user.schoolId)
    availableEnrollments = SAMPLE_ENROLLMENTS.filter((e) => schoolClasses.some((c) => c.id === e.classId))
    availableTransfers = SAMPLE_TRANSFERS.filter((t) =>
      schoolClasses.some((c) => c.id === t.fromClassId || c.id === t.toClassId),
    )
  }

  const canManage = user?.role === "admin" || user?.role === "coordenador_geral" || user?.role === "coordenador"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrículas e Transferências</h1>
          <p className="text-muted-foreground">Gerencie matrículas e transferências de alunos</p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Nova Matrícula
            </Button>
            <Button>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Nova Transferência
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="enrollments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrollments">Matrículas</TabsTrigger>
          <TabsTrigger value="transfers">Transferências</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matrículas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Escola</TableHead>
                    <TableHead>Data de Matrícula</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableEnrollments.slice(0, 15).map((enrollment) => {
                    const student = SAMPLE_STUDENTS.find((s) => s.id === enrollment.studentId)
                    const classItem = SAMPLE_CLASSES.find((c) => c.id === enrollment.classId)
                    const school = SAMPLE_SCHOOLS.find((s) => s.id === classItem?.schoolId)

                    return (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">{student?.name}</TableCell>
                        <TableCell>{classItem?.name}</TableCell>
                        <TableCell className="text-muted-foreground">{school?.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(enrollment.enrollmentDate).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-secondary text-secondary-foreground">
                            {enrollment.status === "active"
                              ? "Ativa"
                              : enrollment.status === "completed"
                                ? "Concluída"
                                : "Cancelada"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transferências</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>De</TableHead>
                    <TableHead>Para</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableTransfers.map((transfer) => {
                    const student = SAMPLE_STUDENTS.find((s) => s.id === transfer.studentId)
                    const fromClass = SAMPLE_CLASSES.find((c) => c.id === transfer.fromClassId)
                    const toClass = SAMPLE_CLASSES.find((c) => c.id === transfer.toClassId)

                    return (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">{student?.name}</TableCell>
                        <TableCell>{fromClass?.name}</TableCell>
                        <TableCell>{toClass?.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(transfer.transferDate).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{transfer.reason}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transfer.status === "approved"
                                ? "default"
                                : transfer.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={transfer.status === "approved" ? "bg-secondary text-secondary-foreground" : ""}
                          >
                            {transfer.status === "approved"
                              ? "Aprovada"
                              : transfer.status === "pending"
                                ? "Pendente"
                                : "Rejeitada"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
