let alreadyTriggered: boolean[] = [];
export const removeTag = (target: number) =>
  (alreadyTriggered = alreadyTriggered.reduce(
    (currentTags, currentValue, index) => {
      if (target !== index) {
        currentTags.push(currentValue);
      }
      return currentTags;
    },
    [] as boolean[]
  ));

export const addTag = () => {
  alreadyTriggered = alreadyTriggered.concat([false]);
};

export const doNotify = (index: number) => !alreadyTriggered[index];

export const resetTriggered = () =>
  (alreadyTriggered = alreadyTriggered.map(() => false));

export const triggerTag = (index: number) => (alreadyTriggered[index] = true);

export const sendSystemNotification = (message: string) => {
  // Let's check if the browser supports notifications
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(message);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "default") {
          var notification = new Notification(message, {});
        }
      });
    }
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
};
