const createErr = (errInfo) => {
  const { method, type, err } = errInfo;
  return {
    log: `${method} ${type}: ${err}`,
    message: {
      err: `Error occurred in ${method}. Check server logs for more details.`,
    },
  };
};

module.exports = { createErr };
