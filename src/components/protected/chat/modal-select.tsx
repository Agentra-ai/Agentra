import { Button } from '@/components/ui/button'
import React from 'react'

type Props = {}

const ModalSelect = (props: Props) => {
  return (
  <div className="flex w-full items-center justify-between overflow-x-hidden p-2 px-4 ">
    <h2 className="text-lg font-semibold">AImodals</h2>
    <Button variant={"blue"}>Deploy</Button>
  </div>
  )
}

export default ModalSelect