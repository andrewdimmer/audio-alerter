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
