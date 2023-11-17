import { useMutation } from '@tanstack/react-query'

export const useCustomMutation = (fnCallback) => {
    const mutation = useMutation({
        mutationFn: fnCallback
    })
    return mutation
}
