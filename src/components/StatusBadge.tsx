enum Status {
  APPROVED = "approved",
  OPENED = "opened",
  OPEN = "open",
  O="o",
  ACTIVE = "active",
  PENDING = "pending",
  CLOSED = "closed",
  CANCELLED = "cancelled",
  INACTIVE = "inactive",
  REJECTED = "rejected",
  UNMATCHED = "unmatched",
}

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClasses = (status: string): string => {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case Status.APPROVED:
      case Status.OPENED:
      case Status.OPEN:
      case Status.O:
      case Status.ACTIVE:
        return "bg-Success-50 text-Success-600 hover:bg-Success-100 ";
      case Status.PENDING:
      case Status.CLOSED:
      case Status.INACTIVE:
        return "bg-Gray-50 text-Gray-500 hover:bg-Gray-100";
      case Status.CANCELLED:
      case Status.REJECTED:
      case Status.UNMATCHED:
        return "bg-Error-50 text-Error-500 hover:bg-Error-100";
      default:
        return "bg-Gray-50 text-Gray-500 hover:bg-Gray-100";
    }
  };

  return (
    <span
      className={`
          ${getStatusClasses(status)}
          h-7
          p-2
        rounded-[2.5rem] 
        text-base 
        font-medium
        leading-CS
        lett
        capitalize
        inline-flex
        items-center
        justify-center
        transition-colors
        duration-200
        cursor-default
        
        `}>
      {status}
    </span>
  );
};

export default StatusBadge;
