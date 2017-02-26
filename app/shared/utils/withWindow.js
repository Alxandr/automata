export default function withWindow(id, { meta = {}, ...props }) {
  return {
    ...props,
    meta: {
      ...meta,
      window: id
    }
  };
}
