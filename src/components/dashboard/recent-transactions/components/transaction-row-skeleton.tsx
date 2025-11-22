import { Skeleton } from "@/components/ui/skeleton";
interface Props {
  index: number;
}

const TransactionRowSkeleton = ({ index }: Props) => {
  return (
    <tr key={index} className="group hover:bg-gray-50 transition-colors">
      <td className="py-4 pl-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </td>
      <td className="py-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-4 text-right pr-2">
        <Skeleton className="h-4 w-20 ml-auto" />
      </td>
    </tr>
  );
};
export default TransactionRowSkeleton;
