export let axiosApi = null;

export function setAxiosInst(instance) {
  axiosApi = instance;
}

export function removeAxiosAuth() {
  if(axiosApi) delete axiosApi.defaults.headers.common["Authorization"];
}

export default function setAuthToken(token) {
  if(axiosApi) axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

