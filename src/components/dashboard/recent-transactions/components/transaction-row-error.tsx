const TransactionRowError = () => {
  return (
    <tr>
      <td
        colSpan={4}
        className="py-8 text-center"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-red-500 font-medium">
            İşlemler yüklenirken bir hata oluştu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Sayfayı yenile
          </button>
        </div>
      </td>
    </tr>
  );
};
export default TransactionRowError;
