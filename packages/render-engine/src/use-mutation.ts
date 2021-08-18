import { useState } from 'react';

export type UseMutationResult = {
  mutate: (params: any) => void,
  loading: boolean,
};

export type UseMutationCallbacks = Partial<{
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
}>;

function refreshQueryResult(key: string) {
  // todo implement this
}

function useMutation(apiID: string, callbacks?: UseMutationCallbacks): UseMutationResult {
  const [loading, setLoading] = useState(false);

  function mutate(data: any) {
    setLoading(true);

    const request = new Request('/api/products/add', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // todo this is pseudo code
    fetch(request).then((response) => {
      setLoading(false);
      refreshQueryResult(apiID);
      callbacks?.onSuccess?.(response);
    }).catch((err) => {
      callbacks?.onError?.(err);
    });
  }

  return { mutate, loading };
}

export default useMutation;
