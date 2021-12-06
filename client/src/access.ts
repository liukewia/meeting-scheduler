export default function (initialState) {
  return {
    isLoggedIn: !!initialState?.currentUser?.id,
  };
}
