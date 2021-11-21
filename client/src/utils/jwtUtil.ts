export const getJwt = () => {
  return localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
};
