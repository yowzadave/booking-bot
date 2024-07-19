async function waitUntil(condition, time = 1) {
  return await new Promise((resolve) => {
    const interval = setInterval(() => {
      const ready = condition();
      if (ready) {
        resolve(ready);
        clearInterval(interval);
      }
    }, time);
  });
}

export default waitUntil;
