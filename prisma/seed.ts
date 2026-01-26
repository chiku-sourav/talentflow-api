import { PrismaClient, ProjectStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const hash = async (pw: string) => await bcrypt.hash(pw, 10);

async function main() {
  console.log('🌱 Seeding database...');

  /////////////////////////////////////////////////////
  // CLEAN (safe re-run)
  /////////////////////////////////////////////////////
  await prisma.contract.deleteMany();
  await prisma.match.deleteMany();
  await prisma.projectSkill.deleteMany();
  await prisma.developerSkill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.developer.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  /////////////////////////////////////////////////////
  // SKILLS
  /////////////////////////////////////////////////////
  const skillNames = [
    'node',
    'nestjs',
    'typescript',
    'postgres',
    'docker',
    'aws',
    'redis',
    'graphql',
  ];

  const skills = await Promise.all(
    skillNames.map((name) =>
      prisma.skill.create({
        data: { name },
      }),
    ),
  );

  const getSkill = (name: string) => skills.find((s) => s.name === name)!;

  /////////////////////////////////////////////////////
  // ADMIN
  /////////////////////////////////////////////////////
  await prisma.user.create({
    data: {
      email: 'admin@talentflow.com',
      password: await hash('password'),
      role: Role.ADMIN,
    },
  });

  /////////////////////////////////////////////////////
  // DEVELOPERS
  /////////////////////////////////////////////////////
  const devSkillSets = [
    ['node', 'nestjs', 'postgres'],
    ['node', 'typescript', 'docker'],
    ['nestjs', 'graphql', 'redis'],
    ['node', 'aws'],
    ['typescript', 'postgres'],
    ['node', 'nestjs', 'docker', 'aws'],
    ['redis', 'postgres'],
    ['graphql', 'typescript'],
    ['node', 'redis'],
    ['nestjs', 'docker'],
  ];

  const developers: any[] = [];

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `dev${i + 1}@mail.com`,
        password: await hash('password'),
        role: Role.DEVELOPER,
      },
    });

    const dev = await prisma.developer.create({
      data: {
        userId: user.id,
        bio: `Developer ${i + 1}`,
        experience: Math.floor(Math.random() * 8) + 1,
        hourlyRate: 20 + i * 5,
        available: true,
      },
    });

    for (const skillName of devSkillSets[i]) {
      await prisma.developerSkill.create({
        data: {
          developerId: dev.id,
          skillId: getSkill(skillName).id,
        },
      });
    }

    developers.push(dev);
  }

  /////////////////////////////////////////////////////
  // CLIENTS + PROJECTS
  /////////////////////////////////////////////////////
  const projectSkillSets = [
    ['node', 'nestjs'],
    ['typescript', 'postgres'],
    ['node', 'docker'],
    ['graphql', 'redis'],
    ['nestjs', 'aws'],
  ];

  for (let i = 0; i < 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `client${i + 1}@mail.com`,
        password: await hash('password'),
        role: Role.CLIENT,
      },
    });

    const client = await prisma.client.create({
      data: {
        userId: user.id,
        companyName: `Company ${i + 1}`,
      },
    });

    // each client gets projects
    for (let j = 0; j < 2; j++) {
      const project = await prisma.project.create({
        data: {
          clientId: client.id,
          title: `Project ${i + 1}-${j + 1}`,
          description: 'Sample hiring project',
          budget: 40 + j * 20,
          status: ProjectStatus.OPEN,
        },
      });

      const skillsForProject =
        projectSkillSets[(i + j) % projectSkillSets.length];

      for (const skillName of skillsForProject) {
        await prisma.projectSkill.create({
          data: {
            projectId: project.id,
            skillId: getSkill(skillName).id,
          },
        });
      }
    }
  }

  console.log('✅ Seeding completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
