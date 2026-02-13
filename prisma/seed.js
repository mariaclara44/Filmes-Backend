import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Iniciando o seed");
    
await prisma.movie.createMany ({ 

    data: [
        {
      title: "A Origem",
      description: "Um ladrão que invade sonhos precisa plantar uma ideia na mente de um CEO.",
      duration: 148,
      genre: "Ficção Científica",
      rating: 8.8,
      available: true,
    },
    {
      title: "O Poderoso Chefão",
      description: "A história da família mafiosa Corleone e sua luta pelo poder.",
      duration: 175,
      genre: "Drama",
      rating: 9.2,
      available: true,
    },
    {
      title: "Forrest Gump",
      description: "A vida extraordinária de um homem simples que testemunha momentos históricos.",
      duration: 142,
      genre: "Drama",
      rating: 8.8,
      available: true,
    },
    {
      title: "O Senhor dos Anéis: A Sociedade do Anel",
      description: "Um hobbit começa uma jornada para destruir um anel poderoso.",
      duration: 178,
      genre: "Fantasia",
      rating: 8.8,
      available: true,
    },
    {
        title: "Matrix",
      description: "Um hacker descobre que o mundo é uma simulação e luta contra máquinas.",
      duration: 136,
      genre: "Ação",
      rating: 8.7,
      available: true,
    },
    {
      title: "A Viagem de Chihiro",
      description: "Uma garota entra em um mundo mágico e precisa salvar seus pais.",
      duration: 125,
      genre: "Animação",
      rating: 8.6,
      available: true,
    },
    {
        title: "Gladiador",
        description: "Um general romano busca vingança após ser traído pelo imperador.",
        duration: 155,
        genre: "Ação",
        rating: 8.5,
        available: true,
    },
    {
        title: "O Silêncio dos Inocentes",
        description: "Uma jovem agente do FBI busca a ajuda de um serial killer para capturar outro.",
      duration: 118,
      genre: "Suspense",
      rating: 8.6,
      available: true,
    },
    {
        title: "Toy Story",
        description: "Brinquedos ganham vida quando humanos não estão por perto.",
      duration: 81,
      genre: "Animação",
      rating: 8.3,
      available: true,
    },
    {
      title: "Interestelar",
      description: "Exploradores viajam pelo espaço para encontrar um novo lar para a humanidade.",
      duration: 169,
      genre: "Ficção Científica",
      rating: 8.6,
      available: true,
    },
  ],

});
 
  
  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
