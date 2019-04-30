function endPoint(req, res) {
  const health = { status: 'UP' };
  res.writeHead(200, { 'Content-Type': 'application/json' });

  return res.end(JSON.stringify(health));
}

module.exports.endPoint = endPoint;
