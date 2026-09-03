export function toFaithItem({ id, kind, title, text, ref, color, tags = [], createdAt, spatial = null }) {
  return { id, kind, title, text, ref, color, tags, createdAt, spatial };
}