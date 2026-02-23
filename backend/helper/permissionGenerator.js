const getDefaultPermissions = (role) => {
  if (role === "super-admin") {
    return {
      activeUser: true,
      deleteUser: true,
      activeAdmin: true,
      deleteAdmin: true,
    };
  }

  if (role === "admin") {
    return {
      activeUser: true,
      deleteUser: false,
      activeAdmin: false,
      deleteAdmin: false,
    };
  }

  return undefined;
};

module.exports = getDefaultPermissions;
