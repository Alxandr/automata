export default function remove(obj, ...props) {
  props = props.map(i => i.toString());
  return Object.keys(obj)
    .filter(n => props.indexOf(n) === -1)
    .reduce((o, n) => ({ ...o, [n]: obj[n] }), {});
}
