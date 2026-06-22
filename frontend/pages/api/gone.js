export default function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.status(410).json({
    status: 410,
    message: 'Gone',
  });
}
