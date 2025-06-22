import CreateVendorForm from "@/components/forms/CreateVendorForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { faGrid2Plus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateVendor = () => {
  return (
       <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-Primary-500 max-w-3xl  sm:w-[10rem] flex items-center rounded-2xl">
          <span className="size-6 flex items-center justify-center">
            <FontAwesomeIcon className="size-6" icon={faGrid2Plus} />
          </span>
          <span className="font-bold leading-CS text-base ">Create Vendor</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className=" sm:max-w-[46rem]  w-[90%]"
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}>
        <div className=" flex  h-fit  rounded-tl-CS rounded-tr-CS overflow-scroll flex-col justify-between w-full  ">
          <DialogHeader className="border-b bg-Primary-5 px-6 py-4 border-Primary-15 ">
            <DialogTitle className="text-2xl h-[2.063rem] leading-CS font-bold text-Primary-500 ">
              Create new vendor
            </DialogTitle>
            <DialogDescription className="text-lg h-[1.563rem] font-bold leading-CS text-Gray-500">
              Fill the needed information to create your vendor
            </DialogDescription>
          </DialogHeader>
          <CreateVendorForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateVendor