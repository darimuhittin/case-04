import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Transaction } from "@/lib/types";
import { formatCurrency, formatDate, getInitials } from "./utils";

interface Props {
  transaction: Transaction;
}

const TransactionRow = ({ transaction }: Props) => {
  return (
    <tr
      key={transaction.id}
      className="group hover:bg-gray-50 transition-colors"
    >
      <td className="py-4 pl-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-xl bg-gray-100">
            <AvatarImage
              src={transaction.image}
              alt={`${transaction.name} avatar`}
            />
            <AvatarFallback
              className="rounded-xl font-semibold text-gray-800"
              aria-label={`${transaction.name} initials`}
            >
              {getInitials(transaction.business || transaction.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-maglo-black">{transaction.name}</p>
            <p className="text-xs text-gray-500">
              {transaction.business || (
                <span className="sr-only">No business name</span>
              )}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 text-gray-500 font-medium text-center">
        {transaction.type}
      </td>
      <td className="py-4 font-semibold text-maglo-black text-center">
        {formatCurrency(transaction.amount, transaction.currency)}
      </td>
      <td className="py-4 text-center text-gray-500 font-medium pr-2">
        {formatDate(transaction.date)}
      </td>
    </tr>
  );
};
export default TransactionRow;
