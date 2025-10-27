export const REACT_STACKS = {
  base: [
    { id: 'react', name: 'React', required: true, version: '^18.3.0' },
    { id: 'typescript', name: 'TypeScript', required: false, version: '^5.5.0' },
    { id: 'vite', name: 'Vite', required: true, version: '^5.4.0' }
  ],
  styling: [
    { id: 'tailwind', name: 'Tailwind CSS', required: false, version: '^3.4.0' },
    { id: 'shadcn', name: 'shadcn/ui', required: false, version: 'latest', deps: ['tailwind'] }
  ],
  utils: [
    { id: 'react-router', name: 'React Router', required: false, version: '^6.26.0' },
    { id: 'zustand', name: 'Zustand', required: false, version: '^4.5.0' },
    { id: 'react-query', name: 'TanStack Query', required: false, version: '^5.51.0' },
    { id: 'axios', name: 'Axios', required: false, version: '^1.7.0' }
  ]
};

export const TYPESCRIPT_STACKS = {
  base: [
    { id: 'typescript', name: 'TypeScript', required: true, version: '^5.5.0', description: 'Superset tipado do JavaScript' },
    { id: 'tsx', name: 'TSX', required: false, version: '^4.19.0', description: 'TypeScript execute (ts-node melhorado)' },
    { id: 'ts-node', name: 'ts-node', required: false, version: '^10.9.0', description: 'Executar TypeScript diretamente' }
  ],
  frameworks: [
    { id: 'react', name: 'React', required: false, version: '^18.3.0', description: 'UI Library' },
    { id: 'next', name: 'Next.js', required: false, version: '^14.2.0', description: 'React Framework' },
    { id: 'express-ts', name: 'Express', required: false, version: '^4.19.0', description: 'Web Framework' },
    { id: 'fastify', name: 'Fastify', required: false, version: '^4.28.0', description: 'Fast web framework' },
    { id: 'nestjs', name: 'NestJS', required: false, version: '^10.0.0', description: 'Progressive Node.js framework' }
  ],
  types: [
    { id: '@types/node', name: '@types/node', required: false, version: '^22.0.0', description: 'Node.js type definitions' },
    { id: '@types/express', name: '@types/express', required: false, version: '^4.17.0', description: 'Express type definitions', deps: ['express-ts'] },
    { id: '@types/react', name: '@types/react', required: false, version: '^18.3.0', description: 'React type definitions', deps: ['react'] },
    { id: '@types/jest', name: '@types/jest', required: false, version: '^29.5.0', description: 'Jest type definitions' }
  ],
  tools: [
    { id: 'zod', name: 'Zod', required: false, version: '^3.23.0', description: 'Schema validation' },
    { id: 'type-fest', name: 'type-fest', required: false, version: '^4.26.0', description: 'Collection of essential TypeScript types' },
    { id: 'ts-pattern', name: 'ts-pattern', required: false, version: '^5.3.0', description: 'Pattern matching library' },
    { id: 'class-validator', name: 'class-validator', required: false, version: '^0.14.0', description: 'Decorator-based validation' }
  ],
  testing: [
    { id: 'vitest', name: 'Vitest', required: false, version: '^2.1.0', description: 'Blazing fast unit test framework' },
    { id: 'jest', name: 'Jest', required: false, version: '^29.7.0', description: 'Testing framework' },
    { id: '@testing-library/react', name: 'Testing Library', required: false, version: '^16.0.0', description: 'React testing utilities', deps: ['react'] }
  ],
  devtools: [
    { id: 'eslint-ts', name: 'ESLint TypeScript', required: false, version: '^8.0.0', description: 'TypeScript ESLint' },
    { id: 'prettier', name: 'Prettier', required: false, version: '^3.3.0', description: 'Code formatter' },
    { id: 'tsup', name: 'tsup', required: false, version: '^8.3.0', description: 'TypeScript bundler' }
  ]
};

export const MERN_STACKS = {
  backend: [
    { id: 'nodejs', name: 'Node.js', required: true, version: '^20.0.0', description: 'Runtime JavaScript' },
    { id: 'express', name: 'Express', required: true, version: '^4.19.0', description: 'Framework web minimalista' }
  ],
  database: [
    { id: 'mongodb', name: 'MongoDB', required: true, version: '^6.0.0', description: 'Banco NoSQL' },
    { id: 'mongoose', name: 'Mongoose', required: false, version: '^8.5.0', description: 'ODM para MongoDB' }
  ],
  frontend: [
    { id: 'react', name: 'React', required: true, version: '^18.3.0' },
    { id: 'vite', name: 'Vite', required: false, version: '^5.4.0', description: 'Build tool' }
  ],
  auth: [
    { id: 'jwt', name: 'JSON Web Token', required: false, version: '^9.0.0', description: 'Autenticação' },
    { id: 'bcrypt', name: 'bcrypt', required: false, version: '^5.1.0', description: 'Hash de senhas' },
    { id: 'passport', name: 'Passport', required: false, version: '^0.7.0', description: 'Estratégias de auth' }
  ],
  utils: [
    { id: 'cors', name: 'CORS', required: false, version: '^2.8.0' },
    { id: 'dotenv', name: 'dotenv', required: false, version: '^16.4.0' },
    { id: 'nodemon', name: 'Nodemon', required: false, version: '^3.1.0', description: 'Auto-restart' }
  ],
  devtools: [
    { id: 'eslint', name: 'ESLint', required: false, version: '^8.57.0' },
    { id: 'prettier', name: 'Prettier', required: false, version: '^3.3.0' },
    { id: 'jest', name: 'Jest', required: false, version: '^29.7.0' }
  ]
};
