import React from 'react'
import { TransactionList } from '../Transactions/TransactionList'
import TransactionChart from '../Transactions/TransactionChart'
import AdList from '../Ad/AdList'

export const Dashboard = () => {
  return (
    <>
      <div className='bg-white dark:bg-gray-950'>
        <TransactionChart />
      </div>
      <div>
        <AdList/>
      </div>
     
    </>
  )
}
