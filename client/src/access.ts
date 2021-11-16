export default function (initialState) {
  console.log('initialState in access: ', initialState);

  return {
    hasLoggedIn: !!initialState?.currentUser?.id,
    // canUpdateFoo: role === 'admin',
    // canDeleteFoo: (foo) => {
    //   return foo.ownerId === userId;
    // },
  };
}
