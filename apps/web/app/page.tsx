import { prisma } from '@/utils/prisma'
import { checkInvoice, createInvoice, getUsers } from '../api'

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
  // const users = await getUsers()
  const walletData = await createInvoice(100, "Tiago's test")
  const invoiceStatus = await checkInvoice(walletData.payment_hash)

  return (
    <div className='text-red-50'>
      {/* <div className='users'>
        <h1>Users:</h1>
          {JSON.stringify(users)}
          --------------------------------------
      </div> */}

      <div className='invoice-data'>
        <h1>Invoice:</h1>
          {JSON.stringify(walletData)}
          --------------------------------------
      </div>
      
      <div className='invoice-status'>       
          <h1>Invoice Payment Status:</h1>
          {JSON.stringify(invoiceStatus)}
      </div>
      {/* <div className="">
        all bets:
        {JSON.stringify(allBets.map(x => ({
          ...x,
          amount: Number(x.amount)
        })), null, 2)}
      </div>
      <div className="">
        all quotes:
        {JSON.stringify(allQuotes, null, 2)}
      </div> */}
    </div>
  )
}
