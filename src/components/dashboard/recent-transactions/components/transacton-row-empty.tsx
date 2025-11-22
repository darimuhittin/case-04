const TransactionRowEmpty = () => {
  return (
    <tr>
      <td
        colSpan={4}
        className="py-8 text-center text-gray-500"
        role="status"
        aria-live="polite"
      >
        No transactions found
      </td>
    </tr>
  );
};
export default TransactionRowEmpty;
