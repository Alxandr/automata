let id = -1;

export const setId = newId => {
  if (id !== -1) {
    throw new Error('Cannot re-set window id');
  }

  id = newId;
};

export default function getId() {
  return id;
}
