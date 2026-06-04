export default function handler(req, res) {
  res.status(410).json({
    status: 410,
    message: 'Gone',
  });
}
