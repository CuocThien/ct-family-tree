import { mkdir, writeFile } from 'fs/promises';

const directories = [
  'src/presentation/graphql/schema/types',
  'src/presentation/graphql/schema/inputs',
  'src/presentation/graphql/resolvers',
  'src/application/services',
  'src/application/dto',
  'src/domain/entities',
  'src/domain/value-objects',
  'src/domain/errors',
  'src/domain/interfaces',
  'src/infrastructure/database/models',
  'src/infrastructure/database/repositories',
  'src/infrastructure/storage',
  'src/utils',
  'tests/unit/domain',
  'tests/unit/services',
  'tests/unit/utils',
  'tests/integration/repositories',
  'tests/integration/graphql',
  'tests/e2e',
  'tests/fixtures',
];

const indexFiles = [
  'src/domain/errors/index.ts',
  'src/domain/interfaces/index.ts',
  'src/infrastructure/database/models/index.ts',
  'src/infrastructure/database/repositories/index.ts',
  'src/application/services/index.ts',
  'src/application/dto/index.ts',
];

async function scaffold() {
  console.log('🏗️  Scaffolding project structure...\n');

  // Create directories
  for (const dir of directories) {
    await mkdir(dir, { recursive: true });
    console.log(`✓ Created ${dir}`);
  }

  // Create index files
  for (const file of indexFiles) {
    await writeFile(file, '// Export barrel\nexport {};\n');
    console.log(`✓ Created ${file}`);
  }

  // Create test setup file
  await writeFile('tests/setup.ts', '// Test setup file\n');
  console.log('✓ Created tests/setup.ts');

  console.log('\n✅ Scaffold complete!');
}

scaffold().catch(console.error);
