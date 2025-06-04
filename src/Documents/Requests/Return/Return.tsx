import { Outlet, useOutletContext } from "react-router-dom"

const Return = () => {
  return (
      <div>
        <Outlet context={useOutletContext()} />
      </div>
  )
}

export default Return