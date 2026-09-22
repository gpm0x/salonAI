import { prisma } from "./client"

/**
 * Resolve a organizationId de um usuario: `User.organizationId` e a fonte
 * primaria (staff e admin normal). Fallback pra `Organization.ownerId` cobre
 * users criados antes da coluna existir, caso em que persiste o vinculo
 * (self-heal) pra nao repetir o fallback nas proximas chamadas.
 *
 * Usado por auth.plugin.ts (authenticate) e pelo modulo onboarding, que
 * precisam da mesma resolucao antes de existir organizationId garantido.
 */
export async function resolveUserOrganizationId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true },
  })

  if (user?.organizationId) return user.organizationId

  const owned = await prisma.organization.findFirst({
    where: { ownerId: userId },
    select: { id: true },
  })
  if (!owned) return null

  await prisma.user.update({ where: { id: userId }, data: { organizationId: owned.id } })
  return owned.id
}
