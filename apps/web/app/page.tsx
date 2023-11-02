import { prisma } from '@/utils/prisma'
import Image from 'next/image'

async function testDb() {
  return prisma.user.findMany()
}


export default async function Home() {
  const test = await testDb()

  return (
    <div className='text-red-50'>
      {JSON.stringify(test, null, 2)}
    </div>
  )
}
