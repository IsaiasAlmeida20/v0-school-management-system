// Authentication and authorization utilities

export type UserRole = "admin" | "coordenador_geral" | "coordenador" | "professor"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  schoolId?: string // For coordenador
  classIds?: string[] // For professor
}

// Sample users for testing
export const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "Admin Sistema",
    email: "admin@escolaa.com.br",
    role: "admin",
  },
  {
    id: "2",
    name: "Maria Coordenadora Geral",
    email: "maria.geral@escolaa.com.br",
    role: "coordenador_geral",
  },
  {
    id: "3",
    name: "João Coordenador",
    email: "joao.coord@escolaa.com.br",
    role: "coordenador",
    schoolId: "escola-1",
  },
  {
    id: "4",
    name: "Ana Professora",
    email: "ana.prof@escolaa.com.br",
    role: "professor",
    classIds: ["turma-1", "turma-2"],
  },
]

// Role-based permissions
export const PERMISSIONS = {
  admin: {
    canViewAllSchools: true,
    canManageSchools: true,
    canManageUsers: true,
    canViewAllClasses: true,
    canManageClasses: true,
    canViewAllStudents: true,
    canManageStudents: true,
    canViewReports: true,
  },
  coordenador_geral: {
    canViewAllSchools: true,
    canManageSchools: false,
    canManageUsers: false,
    canViewAllClasses: true,
    canManageClasses: true,
    canViewAllStudents: true,
    canManageStudents: true,
    canViewReports: true,
  },
  coordenador: {
    canViewAllSchools: false,
    canManageSchools: false,
    canManageUsers: false,
    canViewAllClasses: false, // Only their school
    canManageClasses: true,
    canViewAllStudents: false, // Only their school
    canManageStudents: true,
    canViewReports: true,
  },
  professor: {
    canViewAllSchools: false,
    canManageSchools: false,
    canManageUsers: false,
    canViewAllClasses: false, // Only their classes
    canManageClasses: false,
    canViewAllStudents: false, // Only their students
    canManageStudents: false,
    canViewReports: false,
  },
}

export function hasPermission(role: UserRole, permission: keyof typeof PERMISSIONS.admin): boolean {
  return PERMISSIONS[role][permission] || false
}

export function getRoleLabel(role: UserRole): string {
  const labels = {
    admin: "Administrador",
    coordenador_geral: "Coordenador Geral",
    coordenador: "Coordenador",
    professor: "Professor",
  }
  return labels[role]
}
