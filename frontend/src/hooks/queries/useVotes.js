import { useDeleteMutation, usePostMutation, usePutMutation } from "./useApiMutations";
import { useApiQuery } from "./useApiQuery";

export const useVotes = (baseUrl, params = {}, onError) => {
    const queryClient = useQueryClient();
    const queryKey = 'votes';

    const { data, isLoading, error, refetch } = useApiQuery(queryKey, baseUrl, params);

    const postMutation = usePostMutation(onError);
    const putMutation = usePutMutation(onError);
    const deleteMutation = useDeleteMutation(onError);

    const postData = async (url, body, refresh = true) => {
        const result = await postMutation.mutateAsync({ url, data:body });
        if (refresh) {
            await queryClient.invalidateQueries({ queryKey: [queryKey] });
        }
        return result;
    }

    const putData = async (url, body, refresh = true) => {
        const result = await putMutation.mutateAsync({ url, data:body });
        if (refresh) {
            await queryClient.invalidateQueries({ queryKey: [queryKey] });
        }
        return result;
    }

    const deleteData = async (url, refresh = true) => {
        const result = await deleteMutation.mutateAsync({ url });
        if (refresh) {
            await queryClient.invalidateQueries({ queryKey: [queryKey] });
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