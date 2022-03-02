import md5Worker from "./md5.worker";
// macOS X:1000 KB = 1 MB Non-macOS X : 1024 KB = 1 MB
export const isMacosX = /macintosh|mac os x/i.test(navigator.userAgent);

export function isAcceptedFileType(file: File | QXPUploadFileBaseProps, accept: string): boolean {
  const suffix = file.name.split('.').pop();
  if (!accept || !suffix) return false;
  const { type: fileType } = file;  
  return accept.split(',')?.some((acceptType) => acceptType === fileType || acceptType.split('/')[1]?.includes(suffix));
}

export function createQueue(
  tasks: (() => Promise<void>)[],
  maxNumOfWorkers = 1,
): Promise<void> {
  let numOfWorkers = 0;
  let taskIndex = 0;

  return new Promise((resolve, reject) => {
    const getNextTask = (): void => {
      if (numOfWorkers < maxNumOfWorkers && taskIndex < tasks.length) {
        tasks[taskIndex]()
          .then(() => {
            numOfWorkers -= 1;
            getNextTask();
          })
          .catch((error: Error) => {
            reject(error);
          });
        taskIndex += 1;
        numOfWorkers += 1;
        getNextTask();
      } else if (numOfWorkers === 0 && taskIndex === tasks.length) {
        resolve();
      }
    };
    getNextTask();
  });
}

let alreadyAlertUnauthorizedError = false;

function getTimeZone(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  if (offset === 0) {
    return 'UTC+0';
  }

  const delta = Math.abs(offset) / 60;

  if (offset > 0) {
    return `UTC-${delta}`;
  }

  return `UTC+${delta}`;
}

export async function httpClient<TData, TBody = unknown>(
  path: string,
  body?: TBody,
  additionalHeaders?: HeadersInit,
  options?: Record<string, any>,
): Promise<TData> {
  const headers = {
    'X-Proxy': 'API',
    'X-Timezone': getTimeZone(),
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
  // while send form-data, do not set content-type
  if (options?.formData) {
    // @ts-ignore
    delete headers['Content-Type'];
  }
  const response = await fetch(path, {
    method: 'POST',
    body: options?.formData ? body as unknown as FormData : JSON.stringify(body || {}),
    headers,
  });

  if (response.status === 401) {
    if (!alreadyAlertUnauthorizedError) {
      alreadyAlertUnauthorizedError = true;
      alert('当前会话已失效，请重新登录!');
    }

    window.location.reload();
    return Promise.reject(new Error('当前会话已失效，请重新登录!'));
  }

  if ([404, 500].includes(response.status)) {
    return Promise.reject(new Error('请求失败!'));
  }

  const { code, msg, data } = await response.json();
  if (code !== 0) {
    const e = new Error(msg);
    if (data) {
      Object.assign(e, { data });
    }
    return Promise.reject(e);
  }

  return data as TData;
}

export { md5Worker }
