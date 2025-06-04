import { Outlet, useOutletContext } from "react-router-dom"

const SiteTransfer = () => {
  return (
  <div >
      <Outlet context={useOutletContext()} />
    </div>  )
}

export default SiteTransfer