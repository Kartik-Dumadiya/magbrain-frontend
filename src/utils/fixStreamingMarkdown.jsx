export function fixStreamingMarkdown(text) {
  const matches = text.match(/```/g);
  if (matches && matches.length % 2 === 1) {
    return text + "\n```";
  }
  return text;
}