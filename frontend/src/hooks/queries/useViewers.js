import { useDeleteMutation, usePostMutation, usePutMutation } from "./useApiMutations";
import { useApiQuery } from "./useApiQuery";
import { useQueryClient } from '@tanstack/react-query';
import { invalidateKeys } from "@/util/apiUtils";

export const useViewers = (baseUrl, params = {}, onError, refreshKeys = ['viewers']) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useApiQuery(refreshKeys, baseUrl, params);

    const postMutation = usePostMutation(onError);
    const putMutation = usePutMutation(onError);
    const deleteMutation = useDeleteMutation(onError);

    const postData = async (url, body, refresh = true) => {
        const result = await postMutation.mutateAsync({ url, data: body });
        if (refresh) {
            await invalidateKeys(queryClient, refreshKeys);
        }
        return result;
    }

    const putData = async (url, body, refresh = true) => {
        const result = await putMutation.mutateAsync({ url, data: body });
        if (refresh) {
            await invalidateKeys(queryClient, refreshKeys);
        }
        return result;
    }

    const deleteData = async (url, refresh = true) => {
        const result = await deleteMutation.mutateAsync({ url });
        if (refresh) {
            await invalidateKeys(queryClient, refreshKeys);
        }
        return result;
    }

    return {
        data,
        dataLoading: isLoading,
        dataError: error,
        refetch,
        postData,
        putData,
        deleteData
    };
}