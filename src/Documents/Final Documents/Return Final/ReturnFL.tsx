import { Outlet, useOutletContext } from "react-router-dom"

const ReturnFL = () => {
  return (
   <div >
      <Outlet context={useOutletContext()} />
    </div> 
  )
}

export default ReturnFL