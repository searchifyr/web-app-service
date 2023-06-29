const dates = {
  dateToDDMMYYYYHHMM(payload) {
    return new Date(payload).toLocaleDateString()
  },
};

export default dates;
