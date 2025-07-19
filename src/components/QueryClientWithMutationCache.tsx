/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStateContext } from "@/context/useStateContext";
import {
  faSquareCheck,
  faSquareExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      titleOnSuccess?: string;
      titleOnError?: string;
      descriptionOnSuccess?: string;
    };
  }
}
let queryClient: QueryClient;

export const QueryClientWithMutationCache = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setDialogConfig, setDialogOpen } = useStateContext();
  if (!queryClient) {
    queryClient = new QueryClient({
      mutationCache: new MutationCache({
        onSuccess: (_data, _variables, _context, mutation) => {
          if (
            mutation.meta?.titleOnSuccess &&
            mutation.meta?.descriptionOnSuccess
          ) {
            setDialogConfig({
              title: mutation.meta.titleOnSuccess,
              description: mutation.meta.descriptionOnSuccess,
              icon: faSquareCheck,
              iconColor: "text-Success-600",
              variant: "success",
              type: "Info",
              confirm: undefined,
              confirmText: "OK",
            });
            setDialogOpen(true);
          }
        },

        onError: (error, _variables, _context, mutation) => {
          if (mutation.meta?.titleOnError) {
            const errorMessage =
              error.message === "Network Error"
                ? "Network error. Please check your connection."
                : (error as any).response?.data?.details || "An error occurred";
            setDialogConfig({
              title: mutation.meta.titleOnError,
              description: errorMessage,
              icon: faSquareExclamation,
              iconColor: "text-Error-600",
              variant: "danger",
              type: "Info",
              confirm: undefined,
              confirmText: "OK",
            });
            setDialogOpen(true);
          }
        },

        onSettled: (_data, _error, _variables, _context, mutation) => {
          if (mutation.meta?.invalidatesQuery) {
            queryClient.invalidateQueries({
              queryKey: mutation.meta?.invalidatesQuery,
            });
          }
        },
      }),
    });
  }
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
export default QueryClientWithMutationCache;
