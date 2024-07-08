export default (inclusion, exclusion) => {
  inclusion = inclusion?.split(',').filter((item) => {
    if (item.length) {
      return item.trim();
    }
  });

  exclusion = exclusion?.split(',').filter((item) => {
    if (item.length) {
      return item.trim();
    }
  });

  return { inclusion, exclusion };
};
