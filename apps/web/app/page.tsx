import { prisma } from '@/utils/prisma'

async function getAllBets() {
  return prisma.bet.findMany()
}
async function getAllQuotes() {
  return prisma.quote.findFirst({
    orderBy: {
      day: 'desc',
    },
  })
}

export default async function Home() {
  const allBets = await getAllBets()
  const allQuotes = await getAllQuotes()

  return (
    <div className='text-red-50'>
      <div className="">
        all bets:
        {JSON.stringify(allBets, null, 2)}
      </div>
      <div className="">
        all quotes:
        {JSON.stringify(allQuotes, null, 2)}
      </div>
    </div>
  )
}
